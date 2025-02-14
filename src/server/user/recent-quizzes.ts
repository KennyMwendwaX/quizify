"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { RecentQuizzesResponse, UserActionError } from "./types";
import db from "@/database/db";
import { eq, desc } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";

export async function getRecentQuizzes(
  userId?: string
): Promise<RecentQuizzesResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new UserActionError(
        "No active session found",
        401,
        "getRecentQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "User ID mismatch or missing",
        401,
        "getRecentQuizzes"
      );
    }

    const userIdNum = parseInt(userId);

    const recentAttempts = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userIdNum),
      limit: 3,
      orderBy: desc(quizAttempts.createdAt),
      with: {
        quiz: {
          columns: {
            title: true,
            category: true,
            difficulty: true,
          },
        },
      },
    });

    return {
      quizzes: recentAttempts.map((attempt) => ({
        id: attempt.id,
        title: attempt.quiz.title,
        category: attempt.quiz.category,
        dateTaken: attempt.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        difficulty: attempt.quiz.difficulty,
      })),
    };
  } catch (error) {
    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      error: "Failed to fetch recent quizzes",
      statusCode: 500,
    };
  }
}
