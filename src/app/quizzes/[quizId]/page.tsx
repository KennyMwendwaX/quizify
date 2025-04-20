import { auth } from "@/lib/auth";
// import { getPublicQuiz } from "@/server/quiz/get";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuizDetails from "./components/quiz-details";
import { getPublicQuiz } from "@/server/quiz/get";
import { getUserQuizAttempts } from "@/server/user/quiz-attempts";
import { getQuizLeaderboard } from "@/server/quiz/leaderboard";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizQuestionPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { quizId } = await params;

  const quizResult = await getPublicQuiz(parseInt(quizId, 10), session.user.id);
  if (!quizResult.quiz || quizResult.error) {
    throw new Error(quizResult.error || "Quiz not found");
  }

  const userAttemptsResults = await getUserQuizAttempts(
    session.user.id,
    parseInt(quizId, 10)
  );
  if (!userAttemptsResults.quizAttempts || userAttemptsResults.error) {
    throw new Error(userAttemptsResults.error || "Quiz not found");
  }

  const leaderboardResult = await getQuizLeaderboard(parseInt(quizId, 10));
  if (!leaderboardResult.leaderboard || leaderboardResult.error) {
    throw new Error(leaderboardResult.error || "Leaderboard not found");
  }

  return (
    <QuizDetails
      quiz={quizResult.quiz}
      userAttempts={userAttemptsResults.quizAttempts}
      leaderboard={leaderboardResult.leaderboard}
      session={session}
    />
  );
}
