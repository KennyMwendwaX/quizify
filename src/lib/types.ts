import { QuizDifficulty } from "@/server/database/schema";

export type UserRecentAttempt = {
  id: number;
  title: string;
  category: string;
  dateTaken: string;
  percentage: number;
  timeTaken: number;
  difficulty: QuizDifficulty;
};

export type QuizBookmark = {
  id: number;
  quizId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  quiz: {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    rating: number;
    createdAt: Date;
    user: {
      name: string;
      image: string | null;
    };
  };
};

export type UserStats = {
  totalQuizzesTaken: number;
  averageScore: number;
  topCategory: string;
  completionRate: number;
  bestStreak: number;
  averageTimePerQuiz: number;
  totalXP: number;
  currentStreak: number;
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
