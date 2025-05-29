"use server";

import db from "@/database/db";
import {
  OwnerQuizDetail,
  OwnerQuizOverview,
  PublicQuizDetail,
  PublicQuizOverview,
  questions,
  quizAttempts,
  quizBookmarks,
  quizRatings,
  quizzes,
  users,
} from "@/database/schema";
import { and, avg, countDistinct, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuizActionError } from "@/lib/error";

export const getOwnerQuizzes = async (
  userId?: string
): Promise<OwnerQuizOverview[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getOwnerQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getOwnerQuizzes"
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
        questions: countDistinct(questions.id),
        attempts: countDistinct(quizAttempts.id),
        avgRating: avg(quizRatings.rating),
        ratings: countDistinct(quizRatings.id),
      })
      .from(quizzes)
      .leftJoin(questions, eq(quizzes.id, questions.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .where(eq(quizzes.userId, userIdInt))
      .groupBy(quizzes.id)
      .orderBy(desc(quizzes.createdAt));

    // Combine results
    const ownerQuizzes: OwnerQuizOverview[] = quizzesResults.map((quiz) => ({
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
      // Aggregate data
      questions: quiz.questions,
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratings: quiz.ratings > 0 ? quiz.ratings : null,
      attempts: quiz.attempts > 0 ? quiz.attempts : null,
    }));

    return ownerQuizzes;
  } catch (error) {
    console.error("Error in getOwnerQuizzes:", error);
    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quizzes",
      "getOwnerQuizzes"
    );
  }
};

export const getPublicQuizzes = async (
  userId?: string
): Promise<PublicQuizOverview[]> => {
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
        questions: countDistinct(questions.id),
        avgRating: avg(quizRatings.rating),
        ratings: countDistinct(quizRatings.id),
        attempts: countDistinct(quizAttempts.id),
      })
      .from(quizzes)
      .innerJoin(users, eq(quizzes.userId, users.id))
      .leftJoin(questions, eq(quizzes.id, questions.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .groupBy(quizzes.id, users.id)
      .orderBy(desc(quizzes.createdAt));

    if (quizResults.length === 0) {
      return [];
    }

    // Batch fetch user bookmarks
    const userBookmarks = await db.query.quizBookmarks.findMany({
      where: eq(quizBookmarks.userId, userIdNum),
      columns: {
        quizId: true,
      },
    });

    const bookmarkedQuizIds = new Set(
      userBookmarks.map((bookmark) => bookmark.quizId)
    );

    // Combine all results
    const publicQuizzes: PublicQuizOverview[] = quizResults.map((quiz) => ({
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
      user: {
        name: quiz.userName,
        image: quiz.userImage,
      },
      // Aggregated data
      isBookmarked: bookmarkedQuizIds.has(quiz.id),
      questions: quiz.questions,
      attempts: quiz.attempts > 0 ? quiz.attempts : null,
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratings: quiz.ratings > 0 ? quiz.ratings : null,
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

export const getOwnerQuiz = async (
  quizId: number,
  userId?: string
): Promise<OwnerQuizDetail> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getOwnerQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getOwnerQuiz"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError(
        "VALIDATION_ERROR", // Better error type for invalid input
        "Invalid quiz ID",
        "getOwnerQuiz"
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
        ratings: countDistinct(quizRatings.id),
        attempts: countDistinct(quizAttempts.id),
      })
      .from(quizzes)
      .leftJoin(quizRatings, eq(quizzes.id, quizRatings.quizId))
      .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
      .where(and(eq(quizzes.id, quizId), eq(quizzes.userId, userIdInt)))
      .groupBy(quizzes.id)
      .limit(1); // Add limit since we only expect one result

    // Check if quiz exists and belongs to user
    if (!quizResults || quizResults.length === 0) {
      throw new QuizActionError("NOT_FOUND", "Quiz not found", "getOwnerQuiz");
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

    // Construct the OwnerQuiz object
    const OwnerQuiz: OwnerQuizDetail = {
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
      attempts: quiz.attempts > 0 ? quiz.attempts : null,
      avgRating: quiz.avgRating ? Number(quiz.avgRating) : null,
      ratings: quiz.ratings > 0 ? quiz.ratings : null,
    };

    return OwnerQuiz;
  } catch (error) {
    console.error("Error in getOwnerQuiz:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz",
      "getOwnerQuiz"
    );
  }
};

export async function getPublicQuiz(
  quizId: number,
  userId?: string
): Promise<PublicQuizDetail> {
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
        attempts: countDistinct(quizAttempts.id),
        avgRating: avg(quizRatings.rating),
        ratings: countDistinct(quizRatings.id),
        // Bookmark check
        isBookmarked: countDistinct(quizBookmarks.id),
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
    const publicQuiz: PublicQuizDetail = {
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
      ratings: quiz.ratings > 0 ? quiz.ratings : null,
      attempts: quiz.attempts > 0 ? quiz.attempts : null,
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
