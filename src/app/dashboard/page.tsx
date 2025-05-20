import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardContent from "./components/dashboard-content";
import { getUserStats } from "@/server/user/stats";
import { getRecentQuizzes } from "@/server/user/recent-quizzes";
import { getCategoryPerformance } from "@/server/user/category-performance";
import { getWeeklyProgress } from "@/server/user/weekly-progress";
import { tryCatch } from "@/lib/try-catch";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: userStats, error: userStatsError } = await tryCatch(
    getUserStats(session.user.id)
  );
  if (userStatsError) {
    throw new Error(userStatsError.message);
  }

  const { data: recentQuizzes, error: recentQuizzesError } = await tryCatch(
    getRecentQuizzes(session.user.id)
  );
  if (recentQuizzesError) {
    throw new Error(recentQuizzesError.message);
  }

  const { data: categoryPerformance, error: categoryPerformanceError } =
    await tryCatch(getCategoryPerformance(session.user.id));
  if (categoryPerformanceError) {
    throw new Error(categoryPerformanceError.message);
  }

  const { data: weeklyProgress, error: weeklyProgressError } = await tryCatch(
    getWeeklyProgress(session.user.id)
  );
  if (weeklyProgressError) {
    throw new Error(weeklyProgressError.message);
  }

  return (
    <DashboardContent
      session={session}
      stats={
        userStats ?? {
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
      recentQuizzes={recentQuizzes ?? []}
      categoryPerformance={categoryPerformance ?? []}
      weeklyProgress={weeklyProgress ?? []}
    />
  );
}
