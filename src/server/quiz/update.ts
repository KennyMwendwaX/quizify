"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { questions, quizzes } from "@/database/schema";
import { QuizFormValues } from "@/lib/quiz-form-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateUserStreak } from "../user/streak";
import { QuizActionError } from "@/lib/error";
import { tryCatch } from "@/lib/try-catch";

export const updateQuiz = async (
  quiz: QuizFormValues,
  quizId: number,
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
        "updateQuiz"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "updateQuiz"
      );
    }
    const { questions: quizQuestions, ...quizData } = quiz;

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
          "NOT_FOUND",
          "Quiz not found or unauthorized",
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
        throw new QuizActionError(
          "DATABASE_ERROR",
          "Failed to update quiz",
          "updateQuiz"
        );
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

      const { error: userStreakError } = await tryCatch(
        updateUserStreak(parseInt(userId))
      );
      if (userStreakError) {
        throw new QuizActionError(
          "DATABASE_ERROR",
          userStreakError.message,
          "updateQuiz"
        );
      }

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
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to update quiz. Please try again later.",
      "updateQuiz"
    );
  }
};
