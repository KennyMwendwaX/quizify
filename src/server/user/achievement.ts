"use server";

import db from "@/database/db";
import { quizAttempts, userAchievements } from "@/database/schema";
import { XP_CONFIG } from "@/lib/xp-utils";
import { eq } from "drizzle-orm";
import { UpdateAchievementsResponse, UserActionError } from "./types";

export async function checkAndUpdateAchievements(
  userId: number
): Promise<UpdateAchievementsResponse> {
  try {
    const userStats = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.userId, userId),
      with: {
        quiz: {
          columns: { timeLimit: true },
        },
      },
    });

    const perfectScores = userStats.filter(
      (attempt) => attempt.percentage === 100
    ).length;
    const fastAttempts = userStats.filter(
      (attempt) =>
        attempt.quiz?.timeLimit &&
        attempt.timeTaken / (attempt.quiz.timeLimit * 60) < 0.5
    ).length;
    const totalAttempts = userStats.length;

    const allAchievements = await db.query.achievements.findMany();
    const updatedAchievements = [];

    for (const achievement of allAchievements) {
      let progress = 0;
      let threshold = 0;

      switch (achievement.requirement) {
        case "QUIZ_MASTER":
          progress = totalAttempts;
          threshold = XP_CONFIG.ACHIEVEMENTS.QUIZ_MASTER.GOLD;
          break;
        case "PERFECT_SCORER":
          progress = perfectScores;
          threshold = XP_CONFIG.ACHIEVEMENTS.PERFECT_SCORER.GOLD;
          break;
        case "SPEED_DEMON":
          progress = fastAttempts;
          threshold = XP_CONFIG.ACHIEVEMENTS.SPEED_DEMON.GOLD;
          break;
        default:
          continue;
      }

      const isCompleted = progress >= threshold;
      const completedAt = isCompleted ? new Date() : null;

      const [updatedAchievement] = await db
        .insert(userAchievements)
        .values({
          userId,
          achievementId: achievement.id,
          progress,
          isCompleted,
          completedAt,
        })
        .onConflictDoUpdate({
          target: [userAchievements.userId, userAchievements.achievementId],
          set: {
            progress,
            isCompleted,
            completedAt,
          },
        })
        .returning();

      if (updatedAchievement) {
        updatedAchievements.push(updatedAchievement);
      }
    }

    return {
      success: true,
      updatedAchievements: updatedAchievements.map((achievement) => ({
        id: achievement.achievementId,
        progress: achievement.progress,
        isCompleted: achievement.isCompleted,
        completedAt: achievement.completedAt,
      })),
    };
  } catch (error) {
    console.error("Error in checkAndUpdateAchievements:", error);

    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to update user achievements. Please try again later.",
      statusCode: 500,
    };
  }
}
