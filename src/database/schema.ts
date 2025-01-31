import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isTimeLimited: boolean("is_time_limited").notNull(),
  timeLimit: integer("time_limit"),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  quizResponses: many(quizResponses),
}));

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  text: text("text").notNull(),
  choices: text("choices[]").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
});

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes),
}));

export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: integer("user_id").notNull(),
  answers: integer("answers[]").array().notNull(),
  score: integer("score").notNull(),
  timeTaken: integer("time_taken").notNull(),
});

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  quiz: one(quizzes),
}));
