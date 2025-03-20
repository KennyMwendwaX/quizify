import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuizResultsCard from "./components/quiz-results-card";
import { getUserQuizAttempt } from "@/server/quiz/results";

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

  const result = await getUserQuizAttempt(session.user.id, parseInt(quizId));
  if (!result.quizAttempt || result.error) {
    throw new Error(result.error || "Quiz not found");
  }

  return <QuizResultsCard quizAttempt={result.quizAttempt} />;
}
