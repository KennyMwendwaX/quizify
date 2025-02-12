"use server";

import { revalidatePath } from "next/cache";
import db from "@/database/db";
import { questions, quizzes } from "@/database/schema";
import { quizFormSchema, QuizFormValues } from "@/lib/quiz-form-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateQuizResponse, QuizActionError } from "./types";
import { updateUserStreak } from "../user/streak";

export const createQuiz = async (
  quiz: QuizFormValues,
  userId?: string
): Promise<CreateQuizResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new QuizActionError("No active session found", 401, "createQuiz");
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "User ID mismatch or missing",
        401,
        "createQuiz"
      );
    }

    const validatedData = quizFormSchema.parse(quiz);

    const { questions: quizQuestions, ...quizData } = validatedData;

    const result = await db.transaction(async (tx) => {
      const [createdQuiz] = await tx
        .insert(quizzes)
        .values({
          userId: parseInt(userId),
          title: quizData.title,
          description: quizData.description,
          category: quizData.category,
          difficulty: quizData.difficulty,
          isTimeLimited: quizData.isTimeLimited,
          timeLimit: quizData.isTimeLimited ? quizData.timeLimit : 0,
        })
        .returning({
          id: quizzes.id,
        });

      if (!createdQuiz) {
        throw new QuizActionError("Failed to create quiz", 500, "createQuiz");
      }

      // Create questions
      await tx.insert(questions).values(
        quizQuestions.map((question) => ({
          quizId: createdQuiz.id,
          title: question.title,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
        }))
      );

      await updateUserStreak(parseInt(userId));

      return createdQuiz;
    });

    // Revalidate the quizzes page and the new quiz page
    revalidatePath("/quizzes");
    revalidatePath(`/quiz/${result.id}`);

    return {
      quizId: result.id,
    };
  } catch (error) {
    console.error("Error in createQuiz:", error);

    if (error instanceof QuizActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to create quiz. Please try again later.",
      statusCode: 500,
    };
  }
};
