import { auth } from "@/lib/auth";
import MyQuizzesContent from "./components/quizzes-content";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminQuizzes } from "@/server/quiz/get";

export default async function QuizzesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const result = await getAdminQuizzes(session.user.id);
  if (result.error) {
    throw new Error(result.error);
  }

  const quizzes = result.quizzes ?? [];

  return <MyQuizzesContent quizzes={quizzes} />;
}
