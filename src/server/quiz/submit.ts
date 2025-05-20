"use server";

import db from "@/database/db";
import { quizAttempts, quizzes, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { calculateXP } from "@/lib/xp-utils";
import { updateUserXP } from "../user/xp";
import { updateUserStreak } from "../user/streak";
import { QuizActionError } from "@/lib/error";
import { tryCatch } from "@/lib/try-catch";

export const submitQuizAttempt = async (
  quizId: number,
  answers: number[],
  timeLeft: number,
  userId?: string
): Promise<{ success: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "submitQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "submitQuizAttempt"
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId)),
      columns: {
        currentStreak: true,
      },
    });

    if (!user) {
      throw new QuizActionError(
        "NOT_FOUND",
        "User not found",
        "submitQuizAttempt"
      );
    }

    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
      with: {
        questions: {
          columns: {
            id: true,
            title: true,
            choices: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new QuizActionError(
        "NOT_FOUND",
        "Quiz not found",
        "submitQuizAttempt"
      );
    }

    const score = quiz.questions.reduce((total, question, index) => {
      if (
        answers[index] !== undefined &&
        answers[index] === question.correctAnswer
      ) {
        return total + 1;
      }
      return total;
    }, 0);

    const correctAnswers = quiz.questions.filter(
      (q, idx) => q.correctAnswer === answers[idx]
    ).length;
    const scorePercentage = (correctAnswers / quiz.questions.length) * 100;
    const timeTaken = quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : 0;

    const xpEarnedPoints = await calculateXP({
      difficulty: quiz.difficulty,
      scorePercentage,
      timeLimit: quiz.timeLimit || 0,
      timeTaken: timeTaken,
      currentStreak: user.currentStreak,
      questionCount: quiz.questions.length,
    });

    await db.insert(quizAttempts).values({
      quizId,
      userId: parseInt(userId),
      answers,
      score,
      percentage: Math.round(scorePercentage),
      isCompleted: answers.length === quiz.questions.length,
      timeTaken: quiz.timeLimit ? quiz.timeLimit - timeLeft : 0,
      xpEarned: xpEarnedPoints,
    });

    const { error: xpError } = await tryCatch(
      updateUserXP(parseInt(userId), xpEarnedPoints)
    );
    if (xpError) {
      throw new QuizActionError(
        "DATABASE_ERROR",
        xpError.message,
        "submitQuizAttempt"
      );
    }

    const { error: userStreakError } = await tryCatch(
      updateUserStreak(parseInt(userId))
    );
    if (userStreakError) {
      throw new QuizActionError(
        "DATABASE_ERROR",
        userStreakError.message,
        "submitQuizAttempt"
      );
    }

    // Future: Check and update achievements
    // await checkAndUpdateAchievements(parseInt(userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in submitQuizAttempt:", error);

    if (error instanceof QuizActionError) {
      throw error;
    }

    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to validate quiz submission attempt. Please try again later.",
      "submitQuizAttempt"
    );
  }
};
