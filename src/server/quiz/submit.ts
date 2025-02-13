"use server";

import db from "@/database/db";
import { quizAttempts, quizzes, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuizActionError, QuizSubmissionResponse } from "./types";
import { calculateXP } from "@/lib/xp-utils";
import { updateUserXP } from "../user/xp";
import { updateUserStreak } from "../user/streak";

export const submitQuizAttempt = async (
  quizId: number,
  answers: number[],
  timeLeft: number,
  userId?: string
): Promise<QuizSubmissionResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError(
        "No active session found",
        401,
        "submitQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
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
      throw new QuizActionError("User not found", 404, "submitQuizAttempt");
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
      throw new QuizActionError("Quiz not found", 404, "submitQuizAttempt");
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
      percentage: scorePercentage,
      isCompleted: answers.length === quiz.questions.length,
      timeTaken: quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : 0,
      xpEarned: xpEarnedPoints,
    });

    const xpResult = await updateUserXP(parseInt(userId), xpEarnedPoints);
    if (xpResult.error) {
      throw new QuizActionError(
        xpResult.error,
        xpResult.statusCode || 500,
        "submitQuizAttempt"
      );
    }

    const userStreakResult = await updateUserStreak(parseInt(userId));
    if (userStreakResult.error) {
      throw new QuizActionError(
        userStreakResult.error,
        userStreakResult.statusCode || 500,
        "submitQuizAttempt"
      );
    }

    // Future: Check and update achievements
    // await checkAndUpdateAchievements(parseInt(userId));

    return {
      score,
      totalQuestions: quiz.questions.length,
      questionsAnswered: answers.length,
      isComplete: answers.length === quiz.questions.length,
    };
  } catch (error) {
    console.error("Error in submitQuizAttempt:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error:
        "Failed to validate quiz submission attempt. Please try again later.",
      statusCode: 500,
    };
  }
};
