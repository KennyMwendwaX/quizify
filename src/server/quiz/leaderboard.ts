"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GetQuizLeaderboardResponse, QuizActionError } from "./types";
import db from "@/database/db";
import { eq, desc } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";

export const getQuizLeaderboard = async (
  quizId: number
): Promise<GetQuizLeaderboardResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "getQuizLeaderboard"
      );
    }

    if (!quizId) {
      throw new QuizActionError("Quiz ID missing", 400, "getQuizLeaderboard");
    }

    const leaderboard = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.quizId, quizId),
      orderBy: desc(quizAttempts.score),
      limit: 5,
      with: {
        user: {
          columns: {
            name: true,
          },
        },
      },
    });

    return { leaderboard: leaderboard };
  } catch (error) {
    console.error("Error in getQuizLeaderboard:", error);
    return {
      error: "Failed to fetch leaderboard stats. Please try again later.",
      statusCode: 500,
    };
  }
};
