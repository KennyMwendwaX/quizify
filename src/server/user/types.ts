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
  stats?: {
    totalQuizzesTaken: number;
    averageScore: number;
    topCategory: string;
    completionRate: number;
    bestStreak: number;
    currentStreak: number;
    averageTimePerQuiz: number;
    totalXP: number;
  };
  error?: string;
  statusCode?: number;
};

export type RecentQuizzesResponse = {
  quizzes?: {
    id: number;
    title: string;
    category: string;
    dateTaken: string;
    percentage: number;
    timeTaken: number;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  }[];
  error?: string;
  statusCode?: number;
};

export type CategoryPerformanceResponse = {
  performances?: {
    name: string;
    score: number;
    quizzes: number;
  }[];
  error?: string;
  statusCode?: number;
};

export type WeeklyProgressResponse = {
  progress?: {
    day: string;
    quizzes: number;
    score: number;
    xp: number;
  }[];
  error?: string;
  statusCode?: number;
};
