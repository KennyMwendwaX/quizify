"use server";
import db from "@/server/database";
import { quizAttempts } from "@/server/database/schema";

export const insertQuizAttempt = async (attemptData: {
  quizId: number;
  userId: number;
  answers: number[];
  score: number;
  percentage: number;
  isCompleted: boolean;
  timeTaken: number;
  xpEarned: number;
}) => {
  return await db.insert(quizAttempts).values(attemptData);
};
