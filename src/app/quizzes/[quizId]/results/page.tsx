import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuizResultsCard from "./components/quiz-results-card";
import { getUserQuizAttempt } from "@/server/quiz/results";
import { getQuizWithAnswers } from "@/server/quiz/get";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizResultsPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { quizId } = await params;

  const quizResult = await getQuizWithAnswers(
    parseInt(quizId),
    session.user.id
  );
  if (!quizResult.quiz || quizResult.error) {
    throw new Error(quizResult.error || "Quiz not found");
  }

  const userAttemptResult = await getUserQuizAttempt(
    session.user.id,
    parseInt(quizId)
  );
  if (!userAttemptResult.quizAttempt || userAttemptResult.error) {
    throw new Error(userAttemptResult.error || "Quiz not found");
  }

  return (
    <QuizResultsCard
      quiz={quizResult.quiz}
      quizAttempt={userAttemptResult.quizAttempt}
    />
  );
}
