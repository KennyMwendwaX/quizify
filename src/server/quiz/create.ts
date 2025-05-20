"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { questions, quizzes } from "@/database/schema";
import { QuizFormValues } from "@/lib/quiz-form-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateUserStreak } from "../user/streak";
import { QuizActionError } from "@/lib/error";
import { tryCatch } from "@/lib/try-catch";

export const createQuiz = async (
  quiz: QuizFormValues,
  userId?: string
): Promise<{ quizId: number }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "createQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "createQuiz"
      );
    }

    const { questions: quizQuestions, ...quizData } = quiz;

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
          timeLimit: quizData.isTimeLimited ? quizData.timeLimit : 0,
        })
        .returning({
          id: quizzes.id,
        });

      if (!createdQuiz) {
        throw new QuizActionError(
          "DATABASE_ERROR",
          "Failed to create quiz",
          "createQuiz"
        );
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

      const { error } = await tryCatch(updateUserStreak(parseInt(userId)));
      if (error) {
        throw new QuizActionError(
          "DATABASE_ERROR",
          error.message,
          "createQuiz"
        );
      }

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
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to create quiz. Please try again later.",
      "createQuiz"
    );
  }
};
