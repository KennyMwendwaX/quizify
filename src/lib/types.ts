import { QuizDifficulty } from "@/database/schema";

export type UserStats = {
  totalQuizzesTaken: number;
  averageScore: number;
  topCategory: string;
  completionRate: number;
  bestStreak: number;
  currentStreak: number;
  averageTimePerQuiz: number;
  totalXP: number;
};

export type RecentQuiz = {
  id: number;
  title: string;
  category: string;
  dateTaken: string;
  percentage: number;
  timeTaken: number;
  difficulty: QuizDifficulty;
};

export type CategoryPerformance = {
  name: string;
  score: number;
  quizzes: number;
};

export type WeeklyProgress = {
  day: string;
  fullDate: string;
  quizzes: number;
  score: number;
  xp: number;
};

export type UpdatedAchievement = {
  id: number;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date | null;
}[];
