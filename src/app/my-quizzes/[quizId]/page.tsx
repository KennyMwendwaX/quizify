import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import QuizPreviewContent from "./components/preview-content";
import { getAdminQuiz } from "@/server/quiz/get";

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

  const result = await getAdminQuiz(parseInt(quizId, 10), session.user.id);
  if (!result.quiz || result.error) {
    throw new Error(result.error || "Quiz not found");
  }

  return <QuizPreviewContent quiz={result.quiz} />;
}
