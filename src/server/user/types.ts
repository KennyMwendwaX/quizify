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
