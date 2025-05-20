"use server";

import db from "@/database/db";
import { eq } from "drizzle-orm";
import { quizAttempts } from "@/database/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserActionError } from "@/lib/error";
import { CategoryPerformance } from "@/lib/types";

export async function getCategoryPerformance(
  userId?: string
): Promise<CategoryPerformance[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getCategoryPerformance"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getCategoryPerformance"
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

    const categoryPerformances = Array.from(categoryMap.entries()).map(
      ([name, stats]) => ({
        name,
        score: Math.round(stats.totalScore / stats.count),
        quizzes: stats.count,
      })
    );

    return categoryPerformances;
  } catch (error) {
    console.error("Error in getCategoryPerformance:", error);
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch category performance",
      "getCategoryPerformance"
    );
  }
}
