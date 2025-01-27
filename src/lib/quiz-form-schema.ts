import * as z from "zod";

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  choices: z
    .array(z.string().min(1, "Option text is required"))
    .min(2, "At least two options are required"),
  correctAnswer: z.number().min(0, "A correct answer must be selected"),
});

export const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isTimeLimited: z.boolean(),
  timeLimit: z
    .number()
    .min(1, "Time limit must be at least 1 minute")
    .max(180, "Time limit cannot exceed 180 minutes")
    .optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
