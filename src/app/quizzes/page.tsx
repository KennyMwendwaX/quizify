import QuizzesContentPage from "./components/quizzes-content";
import { getPublicQuizzes } from "@/server/actions";

export default async function QuizzesPage() {
  const result = await getPublicQuizzes();
  if (result.error) {
    throw new Error(result.error);
  }

  const quizzes = result.quizzes ?? [];

  return <QuizzesContentPage quizzes={quizzes} />;
}
