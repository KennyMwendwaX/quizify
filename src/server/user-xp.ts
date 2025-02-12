import db from "@/database/db";
import {
  quizAttempts,
  QuizDifficulty,
  userAchievements,
  users,
} from "@/database/schema";
import { eq } from "drizzle-orm";

// constants.ts
export const XP_CONFIG = {
  BASE_XP: {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300,
  },
  SCORE_MULTIPLIERS: {
    PERFECT: 1.5, // 100%
    EXCELLENT: 1.25, // 90-99%
    GOOD: 1.0, // 70-89%
    PASS: 0.75, // 50-69%
    FAIL: 0.25, // Below 50%
  },
  TIME_BONUS: {
    FAST: 1.25, // < 50% of time limit
    NORMAL: 1.0, // 50-80% of time limit
    SLOW: 0.75, // > 80% of time limit
  },
  STREAK_BONUS: {
    MULTIPLIER: 0.1, // 10% bonus per day of streak
    MAX_BONUS: 0.5, // Maximum 50% bonus
  },
  PERFECT_SCORE_BONUS: 50,
  MIN_XP: 25,

  // Achievement thresholds
  ACHIEVEMENTS: {
    QUIZ_MASTER: {
      BRONZE: 10, // Complete 10 quizzes
      SILVER: 50, // Complete 50 quizzes
      GOLD: 100, // Complete 100 quizzes
    },
    PERFECT_SCORER: {
      BRONZE: 5, // Get 5 perfect scores
      SILVER: 25, // Get 25 perfect scores
      GOLD: 50, // Get 50 perfect scores
    },
    SPEED_DEMON: {
      BRONZE: 5, // Complete 5 quizzes under 50% time
      SILVER: 25, // Complete 25 quizzes under 50% time
      GOLD: 50, // Complete 50 quizzes under 50% time
    },
  },
};

// xpUtils.ts

export function getScoreMultiplier(scorePercentage: number): number {
  if (scorePercentage === 100) return XP_CONFIG.SCORE_MULTIPLIERS.PERFECT;
  if (scorePercentage >= 90) return XP_CONFIG.SCORE_MULTIPLIERS.EXCELLENT;
  if (scorePercentage >= 70) return XP_CONFIG.SCORE_MULTIPLIERS.GOOD;
  if (scorePercentage >= 50) return XP_CONFIG.SCORE_MULTIPLIERS.PASS;
  return XP_CONFIG.SCORE_MULTIPLIERS.FAIL;
}

export function getTimeMultiplier(
  timeLimit: number,
  timeTaken: number
): number {
  const timeRatio = timeTaken / timeLimit;
  if (timeRatio < 0.5) return XP_CONFIG.TIME_BONUS.FAST;
  if (timeRatio < 0.8) return XP_CONFIG.TIME_BONUS.NORMAL;
  return XP_CONFIG.TIME_BONUS.SLOW;
}

export async function calculateXP({
  difficulty,
  scorePercentage,
  timeLimit,
  timeTaken,
  currentStreak,
  questionCount,
}: {
  difficulty: QuizDifficulty;
  scorePercentage: number;
  timeLimit: number;
  timeTaken: number;
  currentStreak: number;
  questionCount: number;
}): Promise<number> {
  // 1. Base XP
  let xp = XP_CONFIG.BASE_XP[difficulty];

  // 2. Score multiplier
  xp *= getScoreMultiplier(scorePercentage);

  // 3. Time bonus
  if (timeLimit > 0) {
    xp *= getTimeMultiplier(timeLimit, timeTaken);
  }

  // 4. Streak bonus
  const streakBonus = Math.min(
    currentStreak * XP_CONFIG.STREAK_BONUS.MULTIPLIER,
    XP_CONFIG.STREAK_BONUS.MAX_BONUS
  );
  xp *= 1 + streakBonus;

  // 5. Perfect score bonus
  if (scorePercentage === 100) {
    xp += XP_CONFIG.PERFECT_SCORE_BONUS;
  }

  // 6. Scale based on question count
  xp = Math.round(xp * (questionCount / 10));

  // 7. Ensure minimum XP
  return Math.max(Math.round(xp), XP_CONFIG.MIN_XP);
}

export async function updateUserXP(userId: number, xpEarned: number) {
  // First get the current user's XP
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      totalXp: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Then update with the new total
  await db
    .update(users)
    .set({
      totalXp: user.totalXp + xpEarned,
    })
    .where(eq(users.id, userId));
}

export async function checkAndUpdateAchievements(userId: number) {
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

    await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId: achievement.id,
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [userAchievements.userId, userAchievements.achievementId],
        set: {
          progress,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });
  }
}

// Main function to handle quiz completion
// export async function completeQuizAttempt(
//   quizId: number,
//   userId: number,
//   answers: number[],
//   timeTaken: number
// ) {
//   return await db.transaction(async (tx) => {
//     // Get quiz and user data
//     const quiz = await db.query.quizzes.findFirst({
//       where: eq(quizzes.id, quizId),
//       with: {
//         questions: true,
//       },
//     });

//     const user = await db.query.users.findFirst({
//       where: eq(users.id, userId),
//     });

//     if (!quiz || !user) {
//       throw new Error("Quiz or user not found");
//     }

//     // Calculate score
//     const correctAnswers = quiz.questions.filter(
//       (q, idx) => q.correctAnswer === answers[idx]
//     ).length;
//     const scorePercentage = (correctAnswers / quiz.questions.length) * 100;

//     // Calculate XP
//     const xpEarned = await calculateXP({
//       difficulty: quiz.difficulty as QuizDifficulty,
//       scorePercentage,
//       timeLimit: quiz.timeLimit || 0,
//       timeTaken,
//       currentStreak: user.currentStreak,
//       questionCount: quiz.questions.length,
//     });

//     // Update user's XP
//     await updateUserXP(userId, xpEarned);

//     // Create quiz attempt record
//     const attempt = await tx.insert(quizAttempts).values({
//       quizId,
//       userId,
//       answers,
//       score: correctAnswers,
//       percentage: scorePercentage,
//       isCompleted: true,
//       timeTaken,
//       xpEarned,
//     });

//     // Update user streak
//     await updateUserStreak(userId);

//     // Check and update achievements
//     await checkAndUpdateAchievements(userId, attempt);

//     return attempt;
//   });
// }
