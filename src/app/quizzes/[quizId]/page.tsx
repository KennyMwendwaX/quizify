import { getPublicQuiz } from "@/server/actions";
import QuizQuestion from "./components/quiz-question";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizQuestionPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { quizId } = await params;

  const result = await getPublicQuiz(parseInt(quizId, 10), session.user.id);
  if (!result.quiz || result.error) {
    throw new Error(result.error || "Quiz not found");
  }

  return <QuizQuestion quiz={result.quiz} session={session} />;
}
