import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getQuizWithAnswers } from "@/server/quiz/get";
import { getUserQuizAttempt } from "@/server/user/quiz-attempts";
import QuizReview from "./components/quiz-review";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizPreviewPage({ params }: Props) {
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
    <QuizReview
      quiz={quizResult.quiz}
      quizAttempt={userAttemptResult.quizAttempt}
    />
  );
}
