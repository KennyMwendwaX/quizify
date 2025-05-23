"use server";

import db from "@/database/db";
import { quizRatings, quizzes, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuizActionError } from "@/lib/error";
import { revalidatePath } from "next/cache";

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId)),
      columns: {
        id: true,
      },
    });

    if (!user) {
      throw new QuizActionError(
        "NOT_FOUND",
        "User not found",
        "submitQuizRating"
      );
    }

    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      columns: {
        id: true,
      },
    });

    if (!quiz) {
      throw new QuizActionError(
        "NOT_FOUND",
        "Quiz not found",
        "submitQuizRating"
      );
    }

    // Check if user has already rated this quiz
    const existingRating = await db.query.quizRatings.findFirst({
      where: and(
        eq(quizRatings.userId, parseInt(userId)),
        eq(quizRatings.quizId, quizId)
      ),
    });

    if (existingRating) {
      // Update existing rating
      await db
        .update(quizRatings)
        .set({
          rating: rating,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(quizRatings.userId, parseInt(userId)),
            eq(quizRatings.quizId, quizId)
          )
        );
    } else {
      // Create new rating
      await db.insert(quizRatings).values({
        userId: parseInt(userId),
        quizId: quizId,
        rating: rating,
      });
    }

    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath("/explore");

    return {
      success: true,
    };
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
