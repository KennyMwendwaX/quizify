import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  totalXp: integer("total_xp").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable("session", {
  id: serial("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("account", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verification", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const quizzes = pgTable("quiz", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty", {
    enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
  }).notNull(),
  isTimeLimited: boolean("is_time_limited").notNull(),
  timeLimit: integer("time_limit"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const questions = pgTable("question", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: text("title").notNull(),
  choices: text("choices").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const quizAttempts = pgTable("quiz_attempt", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  answers: integer("answers").array().notNull(),
  score: integer("score").notNull(),
  percentage: integer("percentage").notNull(),
  isCompleted: boolean("is_completed").notNull(),
  timeTaken: integer("time_taken").notNull(),
  xpEarned: integer("xp_earned").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const quizBookmarks = pgTable(
  "quiz_bookmark",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: unique().on(table.userId, table.quizId),
  })
);

export const quizRatings = pgTable(
  "quiz_rating",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: unique().on(table.userId, table.quizId),
  })
);

export const achievements = pgTable("achievement", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirement: text("requirement").notNull(),
  xpReward: integer("xp_reward").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userAchievements = pgTable(
  "user_achievement",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    achievementId: integer("achievement_id")
      .notNull()
      .references(() => achievements.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    progress: integer("progress").notNull().default(0),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: unique().on(table.userId, table.achievementId),
  })
);

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes),
  quizAttempts: many(quizAttempts),
  userAchievements: many(userAchievements),
  quizBookmarks: many(quizBookmarks),
  quizRatings: many(quizRatings), // Added relation to ratings
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  user: one(users, {
    fields: [quizzes.userId],
    references: [users.id],
  }),
  questions: many(questions),
  quizAttempts: many(quizAttempts),
  quizBookmarks: many(quizBookmarks),
  quizRatings: many(quizRatings), // Added relation to ratings
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const quizBookmarksRelations = relations(quizBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [quizBookmarks.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizBookmarks.quizId],
    references: [quizzes.id],
  }),
}));

export const quizRatingsRelations = relations(quizRatings, ({ one }) => ({
  user: one(users, {
    fields: [quizRatings.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizRatings.quizId],
    references: [quizzes.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    achievement: one(achievements, {
      fields: [userAchievements.achievementId],
      references: [achievements.id],
    }),
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
  })
);

// Type exports

export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type PublicQuestion = Pick<Question, "id" | "title" | "choices">;
export type AdminQuestion = Pick<
  Question,
  "id" | "title" | "choices" | "correctAnswer"
>;
export type PublicQuiz = Quiz & {
  questions: PublicQuestion[];
  user: {
    name: string;
    image: string | null;
  };
  isBookmarked: boolean;
  avgRating: number | null;
  ratingCount: number | null;
};
export type AdminQuiz = Quiz & {
  questions: AdminQuestion[];
  avgRating: number | null;
  ratingCount: number | null;
};
export type QuizWithAnswers = Quiz & {
  questions: AdminQuestion[];
};
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type QuizDifficulty = typeof quizzes.$inferSelect.difficulty;
export type QuizLeaderboard = (QuizAttempt & {
  user: {
    name: string;
    image: string | null;
  };
  rank: number;
})[];
export type QuizRating = typeof quizRatings.$inferSelect; // Added QuizRating type
