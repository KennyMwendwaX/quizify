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
import { desc, eq } from "drizzle-orm";

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
  quiz: QuizFormValues
): Promise<CreateQuizResponse> => {
  try {
    const validatedData = quizFormSchema.parse(quiz);

    const { questions: quizQuestions, ...quizData } = validatedData;

    const result = await db.transaction(async (tx) => {
      const [createdQuiz] = await tx
        .insert(quizzes)
        .values({
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

export const getAdminQuizzes = async (): Promise<GetAdminQuizzesResponse> => {
  try {
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

export const getPublicQuizzes = async (): Promise<GetPublicQuizzesResponse> => {
  try {
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
  quizId: number
): Promise<GetAdminQuizResponse> => {
  try {
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
  quizId: number
): Promise<GetPublicQuizResponse> {
  try {
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
  timeLeft: number
): Promise<QuizSubmissionResponse> => {
  try {
    const { quiz } = await getAdminQuiz(quizId);

    if (!quiz) {
      throw new QuizActionError(
        "Quiz not found",
        404,
        "validateQuizSubmission"
      );
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
      userId: 1, // Replace with actual user ID when auth is implemented
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
    console.error("Error in validateQuizSubmission:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to validate quiz submission. Please try again later.",
      statusCode: 500,
    };
  }
};
