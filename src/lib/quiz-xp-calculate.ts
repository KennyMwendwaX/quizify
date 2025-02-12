// types.ts
export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

interface XPFactors {
  baseXP: number;
  difficultyMultiplier: number;
  timeBonus: number;
  streakBonus: number;
  perfectScoreBonus: number;
}

// constants.ts
export const XP_CONFIG = {
  // Base XP for different difficulty levels
  BASE_XP: {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300,
  },

  // Multipliers for different score ranges
  SCORE_MULTIPLIERS: {
    PERFECT: 1.5, // 100%
    EXCELLENT: 1.25, // 90-99%
    GOOD: 1.0, // 70-89%
    PASS: 0.75, // 50-69%
    FAIL: 0.25, // Below 50%
  },

  // Time bonus factors
  TIME_BONUS: {
    FAST: 1.25, // Completed in < 50% of time limit
    NORMAL: 1.0, // Completed in 50-80% of time limit
    SLOW: 0.75, // Completed in > 80% of time limit
  },

  // Streak bonuses
  STREAK_BONUS: {
    MULTIPLIER: 0.1, // 10% bonus per day of streak
    MAX_BONUS: 0.5, // Maximum 50% bonus from streaks
  },

  // Perfect score bonus (additional flat XP)
  PERFECT_SCORE_BONUS: 50,

  // Minimum XP that can be earned from a quiz
  MIN_XP: 25,
};

// xpCalculator.ts
export function calculateQuizXP({
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
}): number {
  // 1. Calculate base XP based on difficulty
  let baseXP = XP_CONFIG.BASE_XP[difficulty];

  // 2. Apply score multiplier
  let scoreMultiplier = getScoreMultiplier(scorePercentage);
  let xp = baseXP * scoreMultiplier;

  // 3. Apply time bonus if quiz is time-limited
  if (timeLimit > 0) {
    const timeMultiplier = getTimeMultiplier(timeLimit, timeTaken);
    xp *= timeMultiplier;
  }

  // 4. Apply streak bonus
  const streakMultiplier =
    1 +
    Math.min(
      currentStreak * XP_CONFIG.STREAK_BONUS.MULTIPLIER,
      XP_CONFIG.STREAK_BONUS.MAX_BONUS
    );
  xp *= streakMultiplier;

  // 5. Add perfect score bonus if applicable
  if (scorePercentage === 100) {
    xp += XP_CONFIG.PERFECT_SCORE_BONUS;
  }

  // 6. Scale XP based on quiz length
  xp = Math.round(xp * (questionCount / 10)); // Normalize to 10 questions

  // 7. Ensure minimum XP
  return Math.max(Math.round(xp), XP_CONFIG.MIN_XP);
}

function getScoreMultiplier(scorePercentage: number): number {
  if (scorePercentage === 100) return XP_CONFIG.SCORE_MULTIPLIERS.PERFECT;
  if (scorePercentage >= 90) return XP_CONFIG.SCORE_MULTIPLIERS.EXCELLENT;
  if (scorePercentage >= 70) return XP_CONFIG.SCORE_MULTIPLIERS.GOOD;
  if (scorePercentage >= 50) return XP_CONFIG.SCORE_MULTIPLIERS.PASS;
  return XP_CONFIG.SCORE_MULTIPLIERS.FAIL;
}

function getTimeMultiplier(timeLimit: number, timeTaken: number): number {
  const timeRatio = timeTaken / timeLimit;
  if (timeRatio < 0.5) return XP_CONFIG.TIME_BONUS.FAST;
  if (timeRatio < 0.8) return XP_CONFIG.TIME_BONUS.NORMAL;
  return XP_CONFIG.TIME_BONUS.SLOW;
}

// Example usage:
const exampleXP = calculateQuizXP({
  difficulty: "MEDIUM",
  scorePercentage: 95,
  timeLimit: 20,
  timeTaken: 15,
  currentStreak: 3,
  questionCount: 15,
});
