"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  GetUserQuizAttemptResponse,
  GetUserQuizAttemptsResponse,
  UserActionError,
} from "./types";
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
      throw new UserActionError(
        "No active session found",
        401,
        "getUserQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "User ID mismatch or missing",
        401,
        "getUserQuizAttempt"
      );
    }

    if (!quizId) {
      throw new UserActionError("Quiz ID missing", 401, "getUserQuizAttempt");
    }

    const attempt = await db.query.quizAttempts.findFirst({
      where: and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, parseInt(userId))
      ),
      orderBy: desc(quizAttempts.createdAt),
    });

    return {
      quizAttempt: attempt,
    };
  } catch (error) {
    console.error("Error in getUserQuizAttempt:", error);
    return {
      error: "Failed to fetch quizzes. Please try again later.",
      statusCode: 500,
    };
  }
};

export const getUserQuizAttempts = async (
  userId?: string,
  quizId?: number
): Promise<GetUserQuizAttemptsResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new UserActionError(
        "No active session found",
        401,
        "getUserQuizAttempts"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "User ID mismatch or missing",
        401,
        "getUserQuizAttempts"
      );
    }

    if (!quizId) {
      throw new UserActionError("Quiz ID missing", 401, "getUserQuizAttempts");
    }

    const attempts = await db.query.quizAttempts.findMany({
      where: and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, parseInt(userId))
      ),
      orderBy: desc(quizAttempts.score),
    });

    return {
      quizAttempts: attempts,
    };
  } catch (error) {
    console.error("Error in getUserQuizAttempts:", error);
    return {
      error: "Failed to fetch quizzes. Please try again later.",
      statusCode: 500,
    };
  }
};
