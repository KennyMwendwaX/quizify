import { getPublicQuiz } from "@/server/actions";
import QuizQuestion from "./components/quiz-question";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizQuestionPage({ params }: Props) {
  const { quizId } = await params;

  const result = await getPublicQuiz(parseInt(quizId, 10));
  if (!result.quiz || result.error) {
    throw new Error(result.error || "Quiz not found");
  }

  return <QuizQuestion quiz={result.quiz} />;
}
