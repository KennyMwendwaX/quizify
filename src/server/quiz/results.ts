"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GetUserQuizAttemptResponse, QuizActionError } from "./types";
import db from "@/database/db";
import { and, desc, eq } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";

export const getUserQuizAttempt = async (
  userId?: string,
  quizId?: number
): Promise<GetUserQuizAttemptResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getUserQuizResult"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "getUserQuizResult"
      );
    }

    if (!quizId) {
      throw new QuizActionError("Quiz ID missing", 401, "getUserQuizResult");
    }

    const latestAttempt = await db.query.quizAttempts.findFirst({
      where: and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, parseInt(userId))
      ),
      orderBy: desc(quizAttempts.createdAt),
    });

    return {
      quizAttempt: latestAttempt,
    };
  } catch (error) {
    console.error("Error in getUserQuizResult:", error);
    return {
      error: "Failed to fetch quizzes. Please try again later.",
      statusCode: 500,
    };
  }
};
