import { redirect } from "next/navigation";
import EditQuizForm from "./components/edit-quiz-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAdminQuiz } from "@/server/quiz/get";
import { tryCatch } from "@/lib/try-catch";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function EditQuizPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { quizId } = await params;

  const { data: quiz, error: quizError } = await tryCatch(
    getAdminQuiz(parseInt(quizId), session.user.id)
  );
  if (quizError) {
    throw new Error(quizError.message);
  }

  return <EditQuizForm quizId={quizId} quiz={quiz} session={session} />;
}
