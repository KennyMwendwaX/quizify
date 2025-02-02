import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { Difficulty } from "@/lib/quiz-form-schema";

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").$type<Difficulty>().notNull(),
  isTimeLimited: boolean("is_time_limited").notNull(),
  timeLimit: integer("time_limit"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const questions = pgTable("questions", {
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

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id").notNull(),
  answers: integer("answers").array().notNull(),
  score: integer("score").notNull(),
  isCompleted: boolean("is_completed").notNull(),
  timeTaken: integer("time_taken").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  quizAttempts: many(quizAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizResponsesRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type PublicQuestion = Pick<Question, "id" | "title" | "choices">;
export type AdminQuestion = Pick<
  Question,
  "id" | "title" | "choices" | "correctAnswer"
>;
export type PublicQuiz = Quiz & { questions: PublicQuestion[] };
export type AdminQuiz = Quiz & { questions: AdminQuestion[] };
