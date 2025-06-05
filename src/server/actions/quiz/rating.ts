"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuizActionError } from "@/server/utils/error";
import { checkUserExists } from "@/server/database/queries/user/select";
import { checkQuizExists } from "@/server/database/queries/quiz/select";
import { upsertQuizRating } from "@/server/database/queries/ratings/update";

export const submitQuizRating = async (
  quizId: number,
  rating: number,
  userId?: string
): Promise<{ success: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "submitQuizRating"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "submitQuizRating"
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new QuizActionError(
        "VALIDATION_ERROR",
        "Rating must be between 1 and 5",
        "submitQuizRating"
      );
    }

    const user = await checkUserExists(parseInt(userId));

    if (!user) {
      throw new QuizActionError(
        "NOT_FOUND",
        "User not found",
        "submitQuizRating"
      );
    }

    const quiz = await checkQuizExists(quizId);

    if (!quiz) {
      throw new QuizActionError(
        "NOT_FOUND",
        "Quiz not found",
        "submitQuizRating"
      );
    }

    await upsertQuizRating(quizId, parseInt(userId), rating);
    return { success: true };
  } catch (error) {
    console.error("Error in submitQuizRating:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to submit quiz rating. Please try again later.",
      "submitQuizRating"
    );
  }
};
