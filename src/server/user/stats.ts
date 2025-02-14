"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserActionError } from "./types";
import db from "@/database/db";
import { eq, count, desc } from "drizzle-orm";
import { users, quizAttempts } from "@/database/schema";

export async function getUserStats(userId?: string) {
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

    const attemptsStats = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userIdNum),
      columns: {
        percentage: true,
        isCompleted: true,
        timeTaken: true,
      },
    });

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
      stats,
    };
  } catch (error) {
    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      error: "Failed to fetch user statistics",
      statusCode: 500,
    };
  }
}
