type UserError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type QuizError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export class UserActionError extends Error {
  constructor(
    public type: UserError["type"],
    message: UserError["message"],
    public action?: string
  ) {
    super(message);
    this.name = "UserActionError";
  }
}

export class QuizActionError extends Error {
  constructor(
    public type: QuizError["type"],
    message: QuizError["message"],
    public action?: string
  ) {
    super(message);
    this.name = "QuizActionError";
  }
}
