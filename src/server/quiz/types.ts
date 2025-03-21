import { AdminQuiz, PublicQuiz, QuizAttempt } from "@/database/schema";

export class QuizActionError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public action?: string
  ) {
    super(message);
    this.name = "QuizActionError";
  }
}

export type GetAdminQuizResponse = {
  quiz?: AdminQuiz;
  error?: string;
  statusCode?: number;
};

export type GetPublicQuizResponse = {
  quiz?: PublicQuiz;
  error?: string;
  statusCode?: number;
};

export type GetAdminQuizzesResponse = {
  quizzes?: AdminQuiz[];
  error?: string;
  statusCode?: number;
};

export type GetPublicQuizzesResponse = {
  quizzes?: PublicQuiz[];
  error?: string;
  statusCode?: number;
};

export type GetQuizWithAnswersResponse = {
  quiz?: AdminQuiz;
  error?: string;
  statusCode?: number;
};

export type GetUserQuizAttemptResponse = {
  quizAttempt?: QuizAttempt;
  error?: string;
  statusCode?: number;
};

export type CreateQuizResponse = {
  quizId?: number;
  error?: string;
  statusCode?: number;
};

export type QuizSubmissionResponse = {
  success?: boolean;
  error?: string;
  statusCode?: number;
};
