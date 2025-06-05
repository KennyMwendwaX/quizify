import { auth } from "@/lib/auth";
import QuizzesContent from "./components/quizzes-content";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPublicQuizzes } from "@/server/actions/quiz/read";
import { tryCatch } from "@/lib/try-catch";

export default async function QuizzesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: quizzes, error: quizzesError } = await tryCatch(
    getPublicQuizzes(session.user.id)
  );
  if (quizzesError) {
    throw new Error(quizzesError.message);
  }

  return <QuizzesContent quizzes={quizzes ?? []} />;
}
