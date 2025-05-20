"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { eq, count, desc, sql } from "drizzle-orm";
import { users, quizAttempts, quizzes } from "@/database/schema";
import { resetStreak } from "./streak";
import { UserActionError } from "@/lib/error";
import { UserStats } from "@/lib/types";

export async function getUserStats(userId?: string): Promise<UserStats> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserStats"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserStats"
      );
    }

    const userIdNum = parseInt(userId);

    const streakResult = await resetStreak(userIdNum);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userIdNum),
      columns: {
        bestStreak: true,
        currentStreak: true,
        totalXp: true,
      },
    });

    if (!user) {
      throw new UserActionError("NOT_FOUND", "User not found", "getUserStats");
    }

    const attemptsStats = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userIdNum),
      columns: {
        percentage: true,
        isCompleted: true,
        timeTaken: true,
      },
    });

    // Get category with most attempts
    const topCategoryResult = await db
      .select({
        category: quizzes.category,
        attemptCount: count(quizAttempts.id),
      })
      .from(quizzes)
      .innerJoin(quizAttempts, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizAttempts.userId, userIdNum))
      .groupBy(quizzes.category)
      .orderBy(desc(sql`count(*)`))
      .limit(1);

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

    const stats = {
      totalQuizzesTaken,
      averageScore,
      topCategory: topCategoryResult[0]?.category ?? "None",
      completionRate,
      bestStreak: user.bestStreak,
      currentStreak: streakResult.currentStreak,
      averageTimePerQuiz,
      totalXP: user.totalXp,
    };

    return stats;
  } catch (error) {
    console.error(error);
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch user statistics",
      "getUserStats"
    );
  }
}
