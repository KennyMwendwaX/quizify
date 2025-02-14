"use server";

import db from "@/database/db";
import { quizAttempts } from "@/database/schema";
import { auth } from "@/lib/auth";
import { and, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { UserActionError, WeeklyProgressResponse } from "./types";

export async function getWeeklyProgress(
  userId?: string
): Promise<WeeklyProgressResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new UserActionError("No active session found", 401, "getUserStats");
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "User ID mismatch or missing",
        401,
        "getUserStats"
      );
    }

    const userIdNum = parseInt(userId);
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const attempts = await db.query.quizAttempts.findMany({
      where: and(
        eq(quizAttempts.userId, userIdNum),
        gte(quizAttempts.createdAt, weekAgo)
      ),
      columns: {
        createdAt: true,
        percentage: true,
        xpEarned: true,
      },
    });

    const dailyStats = new Map<
      string,
      { quizzes: number; totalScore: number; totalXp: number }
    >();
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    attempts.forEach((attempt) => {
      const day = attempt.createdAt
        .toLocaleDateString("en-US", { weekday: "short" })
        .substring(0, 3);
      const current = dailyStats.get(day) || {
        quizzes: 0,
        totalScore: 0,
        totalXp: 0,
      };

      dailyStats.set(day, {
        quizzes: current.quizzes + 1,
        totalScore: current.totalScore + attempt.percentage,
        totalXp: current.totalXp + attempt.xpEarned,
      });
    });

    const weeklyProgress = daysOfWeek.map((day) => {
      const stats = dailyStats.get(day) || {
        quizzes: 0,
        totalScore: 0,
        totalXp: 0,
      };
      return {
        day,
        quizzes: stats.quizzes,
        score:
          stats.quizzes > 0 ? Math.round(stats.totalScore / stats.quizzes) : 0,
        xp: stats.totalXp,
      };
    });

    return {
      progress: weeklyProgress,
    };
  } catch (error) {
    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      error: "Failed to fetch weekly progress",
      statusCode: 500,
    };
  }
}
