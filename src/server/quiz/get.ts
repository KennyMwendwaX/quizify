"use server";

import db from "@/database/db";
import {
  AdminQuestion,
  AdminQuiz,
  PublicQuestion,
  PublicQuiz,
  questions,
  quizAttempts,
  quizBookmarks,
  quizRatings,
  QuizWithAnswers,
  quizzes,
  users,
} from "@/database/schema";
import { and, avg, count, desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuizActionError } from "@/lib/error";

export const getAdminQuizzes = async (
  userId?: string
): Promise<AdminQuiz[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getAdminQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getAdminQuizzes"
      );
    }

    const userIdInt = parseInt(userId);

    // Single optimized query with aggregations
    const quizzesResults = await db
      .select({
        // Quiz fields
        id: quizzes.id,
        userId: quizzes.userId,
        title: quizzes.title,
        description: quizzes.description,
        category: quizzes.category,
        difficulty: quizzes.difficulty,
        isTimeLimited: quizzes.isTimeLimited,
        timeLimit: quizzes.timeLimit,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        // Aggregated data
        avgRating: avg(quizRatings.rating),
        ratingCount: count(quizRatings.id),
        quizAttempts: count(quizAttempts.id),
      })
      .from(quizzes)
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .where(eq(quizzes.userId, userIdInt))
      .groupBy(quizzes.id)
      .orderBy(desc(quizzes.createdAt));

    // Fetch questions separately for better performance
    const quizIds = quizzesResults.map((q) => q.id);
    const questionsResult =
      quizIds.length > 0
        ? await db.query.questions.findMany({
            where: inArray(questions.quizId, quizIds),
            columns: {
              id: true,
              quizId: true,
              title: true,
              choices: true,
              correctAnswer: true,
            },
          })
        : [];

    // Group questions by quiz ID
    const questionsByQuizId = questionsResult.reduce((acc, question) => {
      if (!acc[question.quizId]) {
        acc[question.quizId] = [];
      }
      acc[question.quizId].push({
        id: question.id,
        title: question.title,
        choices: question.choices,
        correctAnswer: question.correctAnswer,
      });
      return acc;
    }, {} as Record<number, AdminQuestion[]>);

    // Combine results
    const adminQuizzes: AdminQuiz[] = quizzesResults.map((quiz) => ({
      id: quiz.id,
      userId: quiz.userId,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      isTimeLimited: quiz.isTimeLimited,
      timeLimit: quiz.timeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: questionsByQuizId[quiz.id] || [],
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratingCount: quiz.ratingCount > 0 ? quiz.ratingCount : null,
      quizAttempts: quiz.quizAttempts > 0 ? quiz.quizAttempts : null,
    }));

    return adminQuizzes;
  } catch (error) {
    console.error("Error in getAdminQuizzes:", error);
    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quizzes",
      "getAdminQuizzes"
    );
  }
};

export const getPublicQuizzes = async (
  userId?: string
): Promise<PublicQuiz[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getPublicQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getPublicQuizzes"
      );
    }

    const userIdNum = parseInt(userId, 10);

    // Single optimized query to get quizzes with aggregated data and user info
    const quizResults = await db
      .select({
        // Quiz fields
        id: quizzes.id,
        userId: quizzes.userId,
        title: quizzes.title,
        description: quizzes.description,
        category: quizzes.category,
        difficulty: quizzes.difficulty,
        isTimeLimited: quizzes.isTimeLimited,
        timeLimit: quizzes.timeLimit,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        // User fields
        userName: users.name,
        userImage: users.image,
        // Aggregated data
        avgRating: avg(quizRatings.rating),
        ratingCount: count(quizRatings.id),
        quizAttempts: count(quizAttempts.id),
      })
      .from(quizzes)
      .innerJoin(users, eq(quizzes.userId, users.id))
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .groupBy(quizzes.id, users.id)
      .orderBy(desc(quizzes.createdAt));

    if (quizResults.length === 0) {
      return [];
    }

    const quizIds = quizResults.map((q) => q.id);

    // Batch fetch questions (only public fields)
    const questionsResult = await db.query.questions.findMany({
      where: inArray(questions.quizId, quizIds),
      columns: {
        id: true,
        quizId: true,
        title: true,
        choices: true,
      },
    });

    // Batch fetch user bookmarks
    const userBookmarks = await db.query.quizBookmarks.findMany({
      where: eq(quizBookmarks.userId, userIdNum),
      columns: {
        quizId: true,
      },
    });

    // Create efficient lookup structures
    const questionsByQuizId = questionsResult.reduce((acc, question) => {
      if (!acc[question.quizId]) {
        acc[question.quizId] = [];
      }
      acc[question.quizId].push({
        id: question.id,
        title: question.title,
        choices: question.choices,
      });
      return acc;
    }, {} as Record<number, PublicQuestion[]>);

    const bookmarkedQuizIds = new Set(
      userBookmarks.map((bookmark) => bookmark.quizId)
    );

    // Combine all results
    const publicQuizzes: PublicQuiz[] = quizResults.map((quiz) => ({
      id: quiz.id,
      userId: quiz.userId,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      isTimeLimited: quiz.isTimeLimited,
      timeLimit: quiz.timeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: questionsByQuizId[quiz.id] || [],
      user: {
        name: quiz.userName,
        image: quiz.userImage,
      },
      isBookmarked: bookmarkedQuizIds.has(quiz.id),
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratingCount: quiz.ratingCount > 0 ? quiz.ratingCount : null,
      quizAttempts: quiz.quizAttempts > 0 ? quiz.quizAttempts : null,
    }));

    return publicQuizzes;
  } catch (error) {
    console.error("Error in getPublicQuizzes:", error);
    if (error instanceof QuizActionError) {
      throw error;
    }
    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quizzes",
      "getPublicQuizzes"
    );
  }
};

export const getAdminQuiz = async (
  quizId: number,
  userId?: string
): Promise<AdminQuiz> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getAdminQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getAdminQuiz"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError(
        "VALIDATION_ERROR", // Better error type for invalid input
        "Invalid quiz ID",
        "getAdminQuiz"
      );
    }

    const userIdInt = parseInt(userId);

    // Single query to get quiz with aggregated data
    const quizResults = await db
      .select({
        // Quiz fields
        id: quizzes.id,
        userId: quizzes.userId,
        title: quizzes.title,
        description: quizzes.description,
        category: quizzes.category,
        difficulty: quizzes.difficulty,
        isTimeLimited: quizzes.isTimeLimited,
        timeLimit: quizzes.timeLimit,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        // Aggregated data
        avgRating: avg(quizRatings.rating),
        ratingCount: count(quizRatings.id),
        quizAttempts: count(quizAttempts.id),
      })
      .from(quizzes)
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .where(and(eq(quizzes.id, quizId), eq(quizzes.userId, userIdInt)))
      .groupBy(quizzes.id)
      .limit(1); // Add limit since we only expect one result

    // Check if quiz exists and belongs to user
    if (!quizResults || quizResults.length === 0) {
      throw new QuizActionError("NOT_FOUND", "Quiz not found", "getAdminQuiz");
    }

    const quiz = quizResults[0];

    // Fetch questions for this quiz
    const questionsResult = await db.query.questions.findMany({
      where: eq(questions.quizId, quizId),
      columns: {
        id: true,
        title: true,
        choices: true,
        correctAnswer: true,
      },
      orderBy: [questions.id], // Ensure consistent ordering
    });

    // Construct the AdminQuiz object
    const adminQuiz: AdminQuiz = {
      id: quiz.id,
      userId: quiz.userId,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      isTimeLimited: quiz.isTimeLimited,
      timeLimit: quiz.timeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: questionsResult.map((q) => ({
        id: q.id,
        title: q.title,
        choices: q.choices,
        correctAnswer: q.correctAnswer,
      })),
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratingCount: quiz.ratingCount > 0 ? quiz.ratingCount : null,
      quizAttempts: quiz.quizAttempts > 0 ? quiz.quizAttempts : null,
    };

    return adminQuiz;
  } catch (error) {
    console.error("Error in getAdminQuiz:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz",
      "getAdminQuiz"
    );
  }
};

export async function getPublicQuiz(
  quizId: number,
  userId?: string
): Promise<PublicQuiz> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getPublicQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getPublicQuiz"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError(
        "VALIDATION_ERROR",
        "Invalid quiz ID",
        "getPublicQuiz"
      );
    }

    const userIdInt = parseInt(userId);

    // Single optimized query with all aggregations and user data
    const quizResults = await db
      .select({
        // Quiz fields
        id: quizzes.id,
        userId: quizzes.userId,
        title: quizzes.title,
        description: quizzes.description,
        category: quizzes.category,
        difficulty: quizzes.difficulty,
        isTimeLimited: quizzes.isTimeLimited,
        timeLimit: quizzes.timeLimit,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        // User fields
        userName: users.name,
        userImage: users.image,
        // Aggregated data
        avgRating: avg(quizRatings.rating),
        ratingCount: count(quizRatings.id),
        quizAttempts: count(quizAttempts.id),
        // Bookmark check
        isBookmarked: count(quizBookmarks.id),
      })
      .from(quizzes)
      .innerJoin(users, eq(quizzes.userId, users.id))
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .leftJoin(
        quizBookmarks,
        and(
          eq(quizBookmarks.quizId, quizId),
          eq(quizBookmarks.userId, userIdInt)
        )
      )
      .where(eq(quizzes.id, quizId))
      .groupBy(quizzes.id, users.id)
      .limit(1);

    if (!quizResults || quizResults.length === 0) {
      throw new QuizActionError("NOT_FOUND", "Quiz not found", "getPublicQuiz");
    }

    const quiz = quizResults[0];

    // Fetch questions separately (public version - no correct answers)
    const questionsResult = await db.query.questions.findMany({
      where: eq(questions.quizId, quizId),
      columns: {
        id: true,
        title: true,
        choices: true,
      },
      orderBy: [questions.id], // Ensure consistent ordering
    });

    // Construct the PublicQuiz object
    const publicQuiz: PublicQuiz = {
      id: quiz.id,
      userId: quiz.userId,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      isTimeLimited: quiz.isTimeLimited,
      timeLimit: quiz.timeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: questionsResult.map((q) => ({
        id: q.id,
        title: q.title,
        choices: q.choices,
      })),
      user: {
        name: quiz.userName,
        image: quiz.userImage,
      },
      isBookmarked: quiz.isBookmarked > 0,
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratingCount: quiz.ratingCount > 0 ? quiz.ratingCount : null,
      quizAttempts: quiz.quizAttempts > 0 ? quiz.quizAttempts : null,
    };

    return publicQuiz;
  } catch (error) {
    console.error("Error in getPublicQuiz:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz",
      "getPublicQuiz"
    );
  }
}

export const getQuizWithAnswers = async (
  quizId: number,
  userId?: string
): Promise<QuizWithAnswers> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getQuizWithAnswers"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getQuizWithAnswers"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "Invalid quiz ID",
        "getQuizWithAnswers"
      );
    }

    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      with: {
        questions: {
          columns: {
            id: true,
            title: true,
            choices: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new QuizActionError(
        "NOT_FOUND",
        "Quiz not found",
        "getQuizWithAnswers"
      );
    }

    return quiz;
  } catch (error) {
    console.error("Error in getQuizWithAnswers:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz",
      "getQuizWithAnswers"
    );
  }
};
