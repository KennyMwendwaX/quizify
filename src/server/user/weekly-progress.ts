"use server";

import db from "@/database/db";
import { quizAttempts } from "@/database/schema";
import { auth } from "@/lib/auth";
import { WeeklyProgress } from "@/lib/types";
import { UserActionError, WeeklyProgressResponse } from "@/server/user/types";
import { and, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";

export async function getWeeklyProgress(
  userId?: string
): Promise<WeeklyProgressResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new UserActionError(
        "No active session found",
        401,
        "getWeeklyProgress"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "User ID mismatch or missing",
        401,
        "getWeeklyProgress"
      );
    }

    const userIdNum = parseInt(userId);

    // Get today and 7 days ago (exactly one week)
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    // Set time to beginning of day for weekAgo to ensure full 7 days
    weekAgo.setHours(0, 0, 0, 0);

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

    // Create an array of the last 7 days in chronological order
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Format to YYYY-MM-DD without timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      last7Days.push({
        day: dayName,
        date: dateString,
      });
    }

    // Initialize statistics for each day
    const dailyStats = new Map(
      last7Days.map(({ date }) => [
        date,
        {
          quizzes: 0,
          totalScore: 0,
          totalXp: 0,
        },
      ])
    );

    // Process attempts with better date formatting
    attempts.forEach((attempt) => {
      const attemptDate = new Date(attempt.createdAt);
      const year = attemptDate.getFullYear();
      const month = String(attemptDate.getMonth() + 1).padStart(2, "0");
      const day = String(attemptDate.getDate()).padStart(2, "0");
      const attemptDateString = `${year}-${month}-${day}`;

      // Only process if the attempt falls within our 7-day window
      if (dailyStats.has(attemptDateString)) {
        const current = dailyStats.get(attemptDateString)!;

        dailyStats.set(attemptDateString, {
          ...current,
          quizzes: current.quizzes + 1,
          totalScore: current.totalScore + attempt.percentage,
          totalXp: current.totalXp + attempt.xpEarned,
        });
      }
    });

    // Convert to array in chronological order with consistent types
    const weeklyProgress: WeeklyProgress[] = last7Days.map(({ date, day }) => {
      const stats = dailyStats.get(date)!;
      return {
        day: day,
        fullDate: date, // YYYY-MM-DD format string
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
    console.error("Error in getWeeklyProgress:", error);

    if (error instanceof UserActionError) {
      return {
        progress: [],
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      progress: [],
      error: "Failed to fetch weekly progress",
      statusCode: 500,
    };
  }
}
