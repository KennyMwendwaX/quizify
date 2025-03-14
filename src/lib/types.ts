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
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

export type CategoryPerformance = {
  name: string;
  score: number;
  quizzes: number;
}[];

export type WeeklyProgress = {
  fullDate: string;
  quizzes: number;
  score: number;
  xp: number;
};
