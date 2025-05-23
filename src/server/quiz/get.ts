"use server";

import db from "@/database/db";
import {
  AdminQuiz,
  PublicQuiz,
  quizBookmarks,
  QuizWithAnswers,
  quizzes,
} from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
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

    const quizResults = await db.query.quizzes.findMany({
      where: eq(quizzes.userId, parseInt(userId)),
      with: {
        questions: {
          columns: {
            id: true,
            title: true,
            choices: true,
            correctAnswer: true,
          },
        },
        quizRatings: true,
      },
      orderBy: [desc(quizzes.createdAt)],
    });

    const quizzesWithMetadata = quizResults.map((quiz) => {
      // Calculate average rating and count
      const ratings = quiz.quizRatings || [];
      const ratingCount = ratings.length > 0 ? ratings.length : null;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          : null;
      return {
        ...quiz,
        avgRating,
        ratingCount,
      };
    });

    return quizzesWithMetadata;
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

    // Fetch all quizzes with their questions and user info
    const quizResults = await db.query.quizzes.findMany({
      with: {
        questions: {
          columns: {
            id: true,
            title: true,
            choices: true,
          },
        },
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
        quizRatings: true, // Include all ratings for each quiz
      },
      orderBy: [desc(quizzes.createdAt)],
    });

    // Fetch user bookmarks
    const userBookmarks = await db.query.quizBookmarks.findMany({
      where: eq(quizBookmarks.userId, userIdNum),
    });

    // Create a Set of bookmarked quiz IDs for efficient lookup
    const bookmarkedQuizIds = new Set(
      userBookmarks.map((bookmark) => bookmark.quizId)
    );

    // Process each quiz to add bookmark status and calculate ratings
    const quizzesWithMetadata = quizResults.map((quiz) => {
      // Calculate average rating and count
      const ratings = quiz.quizRatings || [];
      const ratingCount = ratings.length > 0 ? ratings.length : null;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          : null;

      return {
        ...quiz,
        isBookmarked: bookmarkedQuizIds.has(quiz.id),
        avgRating,
        ratingCount,
      };
    });

    return quizzesWithMetadata;
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
        "UNAUTHORIZED",
        "Invalid quiz ID",
        "getAdminQuiz"
      );
    }

    const quiz = await db.query.quizzes.findFirst({
      where: and(eq(quizzes.id, quizId), eq(quizzes.userId, parseInt(userId))),
      with: {
        questions: {
          columns: {
            id: true,
            title: true,
            choices: true,
            correctAnswer: true,
          },
        },
        quizRatings: true,
      },
    });

    if (!quiz) {
      throw new QuizActionError("NOT_FOUND", "Quiz not found", "getAdminQuiz");
    }

    // Calculate average rating and count
    const ratings = quiz.quizRatings || [];
    const ratingCount = ratings.length > 0 ? ratings.length : null;
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          ratings.length
        : null;

    return {
      ...quiz,
      avgRating,
      ratingCount,
    };
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
        "UNAUTHORIZED",
        "Invalid quiz ID",
        "getPublicQuiz"
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
          },
        },
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
        quizRatings: true,
      },
    });

    if (!quiz) {
      throw new QuizActionError("NOT_FOUND", "Quiz not found", "getPublicQuiz");
    }

    // Compute ratings
    const ratings = quiz.quizRatings || [];
    const ratingCount = ratings.length > 0 ? ratings.length : null;
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

    // Check bookmark
    const bookmark = await db.query.quizBookmarks.findFirst({
      where: and(
        eq(quizBookmarks.quizId, quizId),
        eq(quizBookmarks.userId, parseInt(userId))
      ),
    });

    return {
      ...quiz,
      isBookmarked: !!bookmark,
      avgRating,
      ratingCount,
    };
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
