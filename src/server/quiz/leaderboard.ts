"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { eq, desc } from "drizzle-orm";
import { quizAttempts, QuizLeaderboard } from "@/database/schema";
import { QuizActionError } from "@/lib/error";

export const getQuizLeaderboard = async (
  quizId: number
): Promise<QuizLeaderboard> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getQuizLeaderboard"
      );
    }

    if (!quizId) {
      throw new QuizActionError(
        "NOT_FOUND",
        "Quiz ID missing",
        "getQuizLeaderboard"
      );
    }

    const leaderboardData = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.quizId, quizId),
      orderBy: desc(quizAttempts.score),
      limit: 5,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
    });

    const leaderboard = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return leaderboard;
  } catch (error) {
    console.error("Error in getQuizLeaderboard:", error);
    if (error instanceof QuizActionError) {
      throw error;
    }
    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch leaderboard",
      "getQuizLeaderboard"
    );
  }
};
