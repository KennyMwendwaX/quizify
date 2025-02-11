"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import {
  AdminQuiz,
  PublicQuiz,
  questions,
  quizAttempts,
  quizzes,
} from "@/database/schema";
import { quizFormSchema, QuizFormValues } from "@/lib/quiz-form-schema";
import { desc, eq, and, count, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { formatDistanceToNow } from "date-fns";

class QuizActionError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public action?: string
  ) {
    super(message);
    this.name = "QuizActionError";
  }
}

export type GetAdminQuizResponse = {
  quiz?: AdminQuiz;
  error?: string;
  statusCode?: number;
};

export type GetPublicQuizResponse = {
  quiz?: PublicQuiz;
  error?: string;
  statusCode?: number;
};
export type GetAdminQuizzesResponse = {
  quizzes?: AdminQuiz[];
  error?: string;
  statusCode?: number;
};

export type GetPublicQuizzesResponse = {
  quizzes?: PublicQuiz[];
  error?: string;
  statusCode?: number;
};

export type CreateQuizResponse = {
  quizId?: number;
  error?: string;
  statusCode?: number;
};

type QuizSubmissionResponse = {
  score?: number;
  totalQuestions?: number;
  questionsAnswered?: number;
  isComplete?: boolean;
  error?: string;
  statusCode?: number;
};

export const createQuiz = async (
  quiz: QuizFormValues,
  userId?: string
): Promise<CreateQuizResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError("No active session found", 401, "createQuiz");
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "createQuiz"
      );
    }

    const validatedData = quizFormSchema.parse(quiz);

    const { questions: quizQuestions, ...quizData } = validatedData;

    const result = await db.transaction(async (tx) => {
      const [createdQuiz] = await tx
        .insert(quizzes)
        .values({
          userId: parseInt(userId),
          title: quizData.title,
          description: quizData.description,
          category: quizData.category,
          difficulty: quizData.difficulty,
          isTimeLimited: quizData.isTimeLimited,
          timeLimit: quizData.isTimeLimited ? quizData.timeLimit : null,
        })
        .returning({
          id: quizzes.id,
        });

      if (!createdQuiz) {
        throw new QuizActionError("Failed to create quiz", 500, "createQuiz");
      }

      // Create questions
      await tx.insert(questions).values(
        quizQuestions.map((question) => ({
          quizId: createdQuiz.id,
          title: question.title,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
        }))
      );

      return createdQuiz;
    });

    // Revalidate the quizzes page and the new quiz page
    revalidatePath("/quizzes");
    revalidatePath(`/quiz/${result.id}`);

    return {
      quizId: result.id,
    };
  } catch (error) {
    console.error("Error in createQuiz:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to create quiz. Please try again later.",
      statusCode: 500,
    };
  }
};

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

export const submitQuizAttempt = async (
  quizId: number,
  answers: number[],
  timeLeft: number,
  userId?: string
): Promise<QuizSubmissionResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "submitQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "submitQuizAttempt"
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
      throw new QuizActionError("Quiz not found", 404, "submitQuizAttempt");
    }

    const score = quiz.questions.reduce((total, question, index) => {
      if (
        answers[index] !== undefined &&
        answers[index] === question.correctAnswer
      ) {
        return total + 1;
      }
      return total;
    }, 0);

    // Create quiz attempt record
    await db.insert(quizAttempts).values({
      quizId,
      userId: parseInt(userId),
      answers,
      score,
      isCompleted: answers.length === quiz.questions.length,
      timeTaken: quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : 0,
    });

    return {
      score,
      totalQuestions: quiz.questions.length,
      questionsAnswered: answers.length,
      isComplete: answers.length === quiz.questions.length,
    };
  } catch (error) {
    console.error("Error in submitQuizAttempt:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error:
        "Failed to validate quiz submission attempt. Please try again later.",
      statusCode: 500,
    };
  }
};

export const updateQuiz = async (
  quiz: QuizFormValues,
  quizId: number,
  userId?: string
): Promise<CreateQuizResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError("No active session found", 401, "updateQuiz");
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "updateQuiz"
      );
    }

    const validatedData = quizFormSchema.parse(quiz);
    const { questions: quizQuestions, ...quizData } = validatedData;

    const result = await db.transaction(async (tx) => {
      const existingQuiz = await tx
        .select({ id: quizzes.id })
        .from(quizzes)
        .where(
          and(eq(quizzes.id, quizId), eq(quizzes.userId, parseInt(userId)))
        )
        .limit(1);

      if (!existingQuiz || existingQuiz.length === 0) {
        throw new QuizActionError(
          "Quiz not found or unauthorized",
          404,
          "updateQuiz"
        );
      }

      const [updatedQuiz] = await tx
        .update(quizzes)
        .set({
          title: quizData.title,
          description: quizData.description,
          category: quizData.category,
          difficulty: quizData.difficulty,
          isTimeLimited: quizData.isTimeLimited,
          timeLimit: quizData.isTimeLimited ? quizData.timeLimit : null,
        })
        .where(eq(quizzes.id, quizId))
        .returning({
          id: quizzes.id,
        });

      if (!updatedQuiz) {
        throw new QuizActionError("Failed to update quiz", 500, "updateQuiz");
      }

      await tx.delete(questions).where(eq(questions.quizId, quizId));

      await tx.insert(questions).values(
        quizQuestions.map((question) => ({
          quizId: quizId,
          title: question.title,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
        }))
      );

      return updatedQuiz;
    });

    revalidatePath("/quizzes");
    revalidatePath("/my-quizzes");
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}/edit`);

    return {
      quizId: result.id,
    };
  } catch (error) {
    console.error("Error in updateQuiz:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to update quiz. Please try again later.",
      statusCode: 500,
    };
  }
};

// types/dashboard.ts
export interface DashboardStats {
  totalQuizzesTaken: number; // Changed from totalQuizzes to match UI
  averageScore: number;
  topCategory: string;
}

export interface RecentQuiz {
  id: string;
  title: string;
  category: string;
  dateTaken: string;
  percentage: number;
  timeTaken: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentQuizzes: RecentQuiz[];
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || userId !== session.user.id) {
    throw new Error("Unauthorized access");
  }

  const userIdNum = parseInt(userId);

  // First, get quiz attempts with their question counts
  const quizAttemptsWithCounts = await db
    .select({
      quizId: quizAttempts.quizId,
      score: quizAttempts.score,
      questionCount: count(questions.id),
    })
    .from(quizAttempts)
    .innerJoin(questions, eq(questions.quizId, quizAttempts.quizId))
    .where(eq(quizAttempts.userId, userIdNum))
    .groupBy(quizAttempts.quizId, quizAttempts.score);

  // Calculate average score
  const totalScorePercentage = quizAttemptsWithCounts.reduce((acc, curr) => {
    return acc + (curr.score / curr.questionCount) * 100;
  }, 0);

  const averageScore = quizAttemptsWithCounts.length
    ? Math.round(totalScorePercentage / quizAttemptsWithCounts.length)
    : 0;

  // Get total quizzes taken
  const [quizCount] = await db
    .select({
      count: count(),
    })
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userIdNum));

  // Get top category
  const [topCategory] = await db
    .select({
      category: quizzes.category,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .where(eq(quizAttempts.userId, userIdNum))
    .groupBy(quizzes.category)
    .orderBy(desc(count(quizAttempts.id)))
    .limit(1);

  // Get recent quizzes
  const recentQuizzesRaw = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      category: quizzes.category,
      score: quizAttempts.score,
      timeTaken: quizAttempts.timeTaken,
      createdAt: quizAttempts.createdAt,
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .where(eq(quizAttempts.userId, userIdNum))
    .orderBy(desc(quizAttempts.createdAt))
    .limit(5);

  // Get question counts for recent quizzes
  const recentQuizzesQuestionCounts = await db
    .select({
      quizId: questions.quizId,
      count: count(),
    })
    .from(questions)
    .where(
      inArray(
        questions.quizId,
        recentQuizzesRaw.map((q) => q.id)
      )
    )
    .groupBy(questions.quizId);

  // Create a map of quiz ID to question count
  const questionCountMap = new Map(
    recentQuizzesQuestionCounts.map(({ quizId, count }) => [quizId, count])
  );

  return {
    stats: {
      totalQuizzesTaken: quizCount?.count ?? 0,
      averageScore,
      topCategory: topCategory?.category ?? "None",
    },
    recentQuizzes: recentQuizzesRaw.map((quiz) => ({
      id: String(quiz.id),
      title: quiz.title,
      category: quiz.category,
      dateTaken: formatDistanceToNow(quiz.createdAt, { addSuffix: true }),
      percentage: Math.round(
        (quiz.score / (questionCountMap.get(quiz.id) || 1)) * 100
      ),
      timeTaken: Math.round(quiz.timeTaken / 60), // Convert to minutes
    })),
  };
}
