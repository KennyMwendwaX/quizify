import { auth } from "@/lib/auth";
import MyQuizzesContent from "./components/quizzes-content";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminQuizzes } from "@/server/quiz/get";
import { tryCatch } from "@/lib/try-catch";

export default async function QuizzesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: quizzes, error: quizzesError } = await tryCatch(
    getAdminQuizzes(session.user.id)
  );
  if (quizzesError) {
    throw new Error(quizzesError.message);
  }

  return <MyQuizzesContent quizzes={quizzes} />;
}
