import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuizResultsCard from "./components/quiz-results-card";
import { getUserQuizAttempt } from "@/server/user/quiz-attempts";
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

  if (!session) {
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
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 pt-4">
      <QuizResultsCard
        quiz={quizResult.quiz}
        quizAttempt={userAttemptResult.quizAttempt}
      />
    </div>
  );
}
