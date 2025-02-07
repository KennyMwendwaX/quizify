import { auth } from "@/lib/auth";
import QuizzesContentPage from "./components/quizzes-content";
import { getPublicQuizzes } from "@/server/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuizzesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const result = await getPublicQuizzes(session.user.id);
  if (result.error) {
    throw new Error(result.error);
  }

  const quizzes = result.quizzes ?? [];

  return <QuizzesContentPage quizzes={quizzes} />;
}
