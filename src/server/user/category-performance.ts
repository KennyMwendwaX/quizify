"use server";

import { UserActionError } from "./types";
import db from "@/database/db";
import { eq } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCategoryPerformance(userId?: string) {
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

    const attempts = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userIdNum),
      with: {
        quiz: {
          columns: {
            category: true,
          },
        },
      },
      columns: {
        percentage: true,
      },
    });

    // Process the attempts to calculate category performance
    const categoryMap = new Map<
      string,
      { totalScore: number; count: number }
    >();

    attempts.forEach((attempt) => {
      const category = attempt.quiz.category;
      const current = categoryMap.get(category) || { totalScore: 0, count: 0 };
      categoryMap.set(category, {
        totalScore: current.totalScore + attempt.percentage,
        count: current.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([name, stats]) => ({
      name,
      score: Math.round(stats.totalScore / stats.count),
      quizzes: stats.count,
    }));
  } catch (error) {
    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }
    return {
      error: "Failed to fetch category performance",
      statusCode: 500,
    };
  }
}
