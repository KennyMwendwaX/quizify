"use server";

import db from "@/database/db";
import { quizzes } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  GetAdminQuizResponse,
  GetAdminQuizzesResponse,
  GetPublicQuizResponse,
  GetPublicQuizzesResponse,
  QuizActionError,
} from "./types";

export const getAdminQuizzes = async (
  userId?: string
): Promise<GetAdminQuizzesResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getAdminQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
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
      },
      orderBy: [desc(quizzes.createdAt)],
    });

    return {
      quizzes: quizResults,
    };
  } catch (error) {
    console.error("Error in getAdminQuizzes:", error);
    return {
      error: "Failed to fetch quizzes. Please try again later.",
      statusCode: 500,
    };
  }
};

export const getPublicQuizzes = async (
  userId?: string
): Promise<GetPublicQuizzesResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getPublicQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "getPublicQuizzes"
      );
    }

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
      },
      orderBy: [desc(quizzes.createdAt)],
    });

    return {
      quizzes: quizResults,
    };
  } catch (error) {
    console.error("Error in getPublicQuizzes:", error);
    return {
      error: "Failed to fetch quizzes. Please try again later.",
      statusCode: 500,
    };
  }
};

export const getAdminQuiz = async (
  quizId: number,
  userId?: string
): Promise<GetAdminQuizResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError("No active session found", 401, "getAdminQuiz");
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "getAdminQuiz"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError("Invalid quiz ID", 400, "getAdminQuiz");
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
      },
    });

    if (!quiz) {
      throw new QuizActionError("Quiz not found", 404, "getAdminQuiz");
    }

    return {
      quiz: quiz,
    };
  } catch (error) {
    console.error("Error in getAdminQuiz:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to fetch quiz. Please try again later.",
      statusCode: 500,
    };
  }
};

export async function getPublicQuiz(
  quizId: number,
  userId?: string
): Promise<GetPublicQuizResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getPublicQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "getPublicQuiz"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError("Invalid quiz ID", 400, "getPublicQuiz");
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
      },
    });

    if (!quiz) {
      throw new QuizActionError("Quiz not found", 404, "getPublicQuiz");
    }

    return {
      quiz: quiz,
    };
  } catch (error) {
    console.error("Error in getPublicQuiz:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to fetch quiz. Please try again later.",
      statusCode: 500,
    };
  }
}

export const getQuizWithAnswers = async (
  quizId: number,
  userId?: string
): Promise<GetAdminQuizResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getQuizWithAnswers"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "getQuizWithAnswers"
      );
    }

    if (!quizId || isNaN(quizId)) {
      throw new QuizActionError("Invalid quiz ID", 400, "getQuizWithAnswers");
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
      throw new QuizActionError("Quiz not found", 404, "getQuizWithAnswers");
    }

    return {
      quiz: quiz,
    };
  } catch (error) {
    console.error("Error in getQuizWithAnswers:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to fetch quiz. Please try again later.",
      statusCode: 500,
    };
  }
};
