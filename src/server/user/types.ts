import { QuizAttempt } from "@/database/schema";
import {
  CategoryPerformance,
  RecentQuiz,
  UserStats,
  WeeklyProgress,
} from "@/lib/types";

export class UserActionError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public action?: string
  ) {
    super(message);
    this.name = "UserActionError";
  }
}

export type GetUserQuizAttemptResponse = {
  quizAttempt?: QuizAttempt;
  error?: string;
  statusCode?: number;
};

export type GetUserQuizAttemptsResponse = {
  quizAttempts?: QuizAttempt[];
  error?: string;
  statusCode?: number;
};

export type UpdateUserXPResponse = {
  success?: boolean;
  newTotalXp?: number;
  error?: string;
  statusCode?: number;
};

export type UpdateUserStreakResponse = {
  success?: boolean;
  currentStreak?: number;
  bestStreak?: number;
  error?: string;
  statusCode?: number;
};

export type UpdateAchievementsResponse = {
  success?: boolean;
  updatedAchievements?: {
    id: number;
    progress: number;
    isCompleted: boolean;
    completedAt?: Date | null;
  }[];
  error?: string;
  statusCode?: number;
};

export type StatsResponse = {
  stats?: UserStats;
  error?: string;
  statusCode?: number;
};

export type RecentQuizzesResponse = {
  quizzes?: RecentQuiz[];
  error?: string;
  statusCode?: number;
};

export type CategoryPerformanceResponse = {
  performances?: CategoryPerformance[];
  error?: string;
  statusCode?: number;
};

export type WeeklyProgressResponse = {
  progress: WeeklyProgress[];
  error?: string;
  statusCode?: number;
};
