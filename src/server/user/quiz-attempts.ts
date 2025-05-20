"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { and, desc, eq } from "drizzle-orm";
import { QuizAttempt, quizAttempts } from "@/database/schema";
import { UserActionError } from "@/lib/error";

export const getUserQuizAttempt = async (
  userId?: string,
  quizId?: number
): Promise<QuizAttempt> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserQuizAttempt"
      );
    }

    if (!quizId) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "Quiz ID missing",
        "getUserQuizAttempt"
      );
    }

    const attempt = await db.query.quizAttempts.findFirst({
      where: and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, parseInt(userId))
      ),
      orderBy: desc(quizAttempts.createdAt),
    });

    if (!attempt) {
      throw new UserActionError(
        "NOT_FOUND",
        "Quiz attempt not found",
        "getUserQuizAttempt"
      );
    }

    return attempt;
  } catch (error) {
    console.error("Error in getUserQuizAttempt:", error);
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz attempt",
      "getUserQuizAttempt"
    );
  }
};

export const getUserQuizAttempts = async (
  userId?: string,
  quizId?: number
): Promise<QuizAttempt[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserQuizAttempts"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserQuizAttempts"
      );
    }

    if (!quizId) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "Quiz ID missing",
        "getUserQuizAttempts"
      );
    }

    const attempts = await db.query.quizAttempts.findMany({
      where: and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, parseInt(userId))
      ),
      orderBy: desc(quizAttempts.score),
    });

    return attempts;
  } catch (error) {
    console.error("Error in getUserQuizAttempts:", error);
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch quiz attempts",
      "getUserQuizAttempts"
    );
  }
};
