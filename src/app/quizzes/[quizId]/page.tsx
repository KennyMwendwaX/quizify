import { auth } from "@/lib/auth";
// import { getPublicQuiz } from "@/server/quiz/get";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuizDetails from "./components/quiz-details";

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
  console.log(params);

  // const { quizId } = await params;

  // const result = await getPublicQuiz(parseInt(quizId, 10), session.user.id);
  // if (!result.quiz || result.error) {
  //   throw new Error(result.error || "Quiz not found");
  // }

  return <QuizDetails />;
}
