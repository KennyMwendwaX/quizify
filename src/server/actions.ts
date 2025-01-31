"use server";

import db from "@/database/db";
import { questions, quizzes } from "@/database/schema";
import { QuizFormValues } from "@/lib/quiz-form-schema";
import { desc, eq } from "drizzle-orm";

export const createQuiz = async (quiz: QuizFormValues) => {
  try {
    const { questions: quizQuestions, ...quizData } = quiz;

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
        throw new Error("Failed to create quiz");
      }

      if (quizQuestions.length > 0) {
        await tx.insert(questions).values(
          quizQuestions.map((question) => ({
            quizId: createdQuiz.id,
            title: question.title,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
          }))
        );
      }

      return createdQuiz;
    });

    return {
      quizId: result.id,
    };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return {
      error: `Error: ${error instanceof Error ? error.message : String(error)}`,
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
