"use server";

import db from "@/database/db";
import { quizzes } from "@/database/schema";
import { QuizFormValues } from "@/lib/quiz-form-schema";
import { desc, eq } from "drizzle-orm";

export const createQuiz = async (quiz: QuizFormValues) => {
  try {
    const quizResult = await db
      .insert(quizzes)
      .values(quiz)
      .returning({ id: quizzes.id });

    if (quizResult.length === 0) {
      return {
        error: "Failed to create quiz",
      };
    }

    return {
      quizId: quizResult[0].id,
    };
  } catch (error) {
    return {
      error: `Error: ${error}`,
    };
  }
};

export const getQuizzesWithQuestions = async () => {
  try {
    const quizResults = await db.query.quizzes.findMany({
      with: {
        questions: true,
      },
      orderBy: [desc(quizzes.createdAt)],
    });

    return {
      quizzes: quizResults,
    };
  } catch (error) {
    return {
      error: `Error: ${error}`,
    };
  }
};

export const getQuiz = async (quizId: number) => {
  try {
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      with: {
        questions: true,
      },
    });

    if (!quiz) {
      return {
        error: "Quiz not found",
      };
    }

    return {
      quiz,
    };
  } catch (error) {
    return {
      error: `Error: ${error}`,
    };
  }
};
