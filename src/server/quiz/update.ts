"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { questions, quizzes } from "@/database/schema";
import { quizFormSchema, QuizFormValues } from "@/lib/quiz-form-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateQuizResponse, QuizActionError } from "./types";
import { updateUserStreak } from "../user/streak";

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

      const userStreakResult = await updateUserStreak(parseInt(userId));
      if (userStreakResult.error) {
        throw new QuizActionError(
          userStreakResult.error,
          userStreakResult.statusCode || 500,
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
