import * as z from "zod";

const questionSchema = z.object({
  title: z
    .string({
      required_error: "Question title is required",
    })
    .min(1, "Question title cannot be empty"),
  choices: z
    .array(z.string())
    .min(2, "Each question must have at least 2 choices")
    .max(6, "Each question can have at most 6 choices")
    .refine(
      (choices) => choices.every((choice) => choice.trim().length > 0),
      "Choices cannot be empty"
    ),
  correctAnswer: z
    .number()
    .int()
    .refine(
      (val: number) => {
        if (val === -1) return false;
        return true;
      },
      { message: "Please select a correct answer for this question" }
    ),
});

export const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Difficulty is required",
    invalid_type_error: "Difficulty must be Beginner, Intermediate or Advanced",
  }),
  isTimeLimited: z.boolean(),
  timeLimit: z
    .number()
    .nullable()
    .refine(
      (val) => !val || (val >= 1 && val <= 180),
      "Time limit must be between 1 and 180 minutes"
    ),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required")
    .max(50, "Maximum of 50 questions allowed"),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
