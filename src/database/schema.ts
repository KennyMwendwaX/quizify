import { Difficulty } from "@/lib/quiz-form-schema";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  bigserial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").$type<Difficulty>().notNull(),
  isTimeLimited: boolean("is_time_limited").notNull(),
  timeLimit: integer("time_limit"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  quizResponses: many(quizResponses),
}));

export const questions = pgTable("questions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  text: text("text").notNull(),
  choices: text("choices[]").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes),
}));

export const quizResponses = pgTable("quiz_responses", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id").notNull(),
  answers: integer("answers[]").array().notNull(),
  score: integer("score").notNull(),
  timeTaken: integer("time_taken").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  quiz: one(quizzes),
}));
