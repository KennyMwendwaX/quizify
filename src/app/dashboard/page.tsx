import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardContent from "./components/dashboard-content";
import { getUserStats } from "@/server/user/stats";
import { getRecentQuizzes } from "@/server/user/recent-quizzes";
import { getCategoryPerformance } from "@/server/user/category-performance";
import { getWeeklyProgress } from "@/server/user/weekly-progress";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const statsResults = await getUserStats(session.user.id);
  if (statsResults.error) {
    throw new Error(statsResults.error);
  }

  const recentQuizzesResult = await getRecentQuizzes(session.user.id);
  if (recentQuizzesResult.error) {
    throw new Error(recentQuizzesResult.error);
  }

  const categoryPerformanceResult = await getCategoryPerformance(
    session.user.id
  );
  if (categoryPerformanceResult.error) {
    throw new Error(categoryPerformanceResult.error);
  }

  const weeklyProgressResult = await getWeeklyProgress(session.user.id);
  if (weeklyProgressResult.error) {
    throw new Error(weeklyProgressResult.error);
  }

  return (
    <DashboardContent
      session={session}
      stats={
        statsResults.stats ?? {
          totalQuizzesTaken: 0,
          averageScore: 0,
          topCategory: "",
          completionRate: 0,
          bestStreak: 0,
          currentStreak: 0,
          averageTimePerQuiz: 0,
          totalXP: 0,
        }
      }
      recentQuizzes={recentQuizzesResult.quizzes ?? []}
      categoryPerformance={categoryPerformanceResult.performances ?? []}
      weeklyProgress={weeklyProgressResult.progress ?? []}
    />
  );
}
