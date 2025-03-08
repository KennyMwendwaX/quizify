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

    // Create an array of the last 7 days in chronological order
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate a consistent date string format for comparison
      const dateString = date.toISOString().split("T")[0];

      // Get short day name (Mon, Tue, etc.)
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .substring(0, 3);

      last7Days.push({
        date: dateString,
        dayName: dayName,
        fullDate: new Date(date),
      });
    }

    // Initialize statistics for each day
    const dailyStats = new Map(
      last7Days.map(({ date, dayName }) => [
        date,
        {
          dayName,
          quizzes: 0,
          totalScore: 0,
          totalXp: 0,
        },
      ])
    );

    // Process attempts and organize by actual date (not just day of week)
    attempts.forEach((attempt) => {
      const attemptDate = attempt.createdAt.toISOString().split("T")[0];

      // Only process if the attempt falls within our 7-day window
      if (dailyStats.has(attemptDate)) {
        const current = dailyStats.get(attemptDate)!;

        dailyStats.set(attemptDate, {
          ...current,
          quizzes: current.quizzes + 1,
          totalScore: current.totalScore + attempt.percentage,
          totalXp: current.totalXp + attempt.xpEarned,
        });
      }
    });

    // Convert to array in chronological order (past to present)
    const weeklyProgress = last7Days.map(({ date }) => {
      const stats = dailyStats.get(date)!;
      return {
        day: stats.dayName,
        fullDate: date, // Include the full date for reference
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
