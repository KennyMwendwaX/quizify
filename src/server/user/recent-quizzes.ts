"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { eq, desc } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";
import { UserActionError } from "@/lib/error";
import { RecentQuiz } from "@/lib/types";

export async function getRecentQuizzes(userId?: string): Promise<RecentQuiz[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getRecentQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
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

    return recentAttempts.map((attempt) => ({
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
    }));
  } catch (error) {
    console.error("Error in getRecentQuizzes:", error);
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch recent quizzes",
      "getRecentQuizzes"
    );
  }
}
