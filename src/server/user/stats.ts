"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserActionError } from "./types";
import db from "@/database/db";
import { eq, count, desc } from "drizzle-orm";
import { users, quizAttempts } from "@/database/schema";

export async function getUserStats(userId?: string) {
  try {
    // Validate session
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

    // Get user data for streaks and XP
    const user = await db.query.users.findFirst({
      where: eq(users.id, userIdNum),
      columns: {
        bestStreak: true,
        currentStreak: true,
        totalXp: true,
      },
    });

    if (!user) {
      throw new UserActionError("User not found", 404, "getUserStats");
    }

    // Get quiz attempts statistics
    const attemptsStats = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userIdNum),
      columns: {
        percentage: true,
        isCompleted: true,
        timeTaken: true,
      },
    });

    // Calculate statistics from the attempts
    const totalQuizzesTaken = attemptsStats.length;
    const averageScore =
      attemptsStats.length > 0
        ? Math.round(
            attemptsStats.reduce(
              (sum, attempt) => sum + attempt.percentage,
              0
            ) / attemptsStats.length
          )
        : 0;
    const completedQuizzes = attemptsStats.filter(
      (attempt) => attempt.isCompleted
    ).length;
    const completionRate =
      totalQuizzesTaken > 0
        ? Math.round((completedQuizzes / totalQuizzesTaken) * 100)
        : 0;
    const averageTimePerQuiz =
      attemptsStats.length > 0
        ? Math.round(
            attemptsStats.reduce((sum, attempt) => sum + attempt.timeTaken, 0) /
              attemptsStats.length
          )
        : 0;

    // Get top category using query builder
    const topCategory = await db.query.quizzes.findFirst({
      where: eq(quizAttempts.userId, userIdNum),
      columns: {
        category: true,
      },
      with: {
        quizAttempts: {
          columns: {
            id: true,
          },
        },
      },
      orderBy: (quiz) => desc(count(quiz.id)),
    });

    const stats = {
      totalQuizzesTaken,
      averageScore,
      topCategory: topCategory?.category ?? "None",
      completionRate,
      bestStreak: user.bestStreak,
      currentStreak: user.currentStreak,
      averageTimePerQuiz,
      totalXP: user.totalXp,
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    if (error instanceof UserActionError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      success: false,
      error: "Failed to fetch user statistics",
      statusCode: 500,
    };
  }
}
