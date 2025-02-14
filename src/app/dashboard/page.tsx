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

// const mockDashboardData = {
//   stats: {
//     totalQuizzesTaken: 47,
//     averageScore: 78,
//     topCategory: "Computer Science",
//     completionRate: 92,
//     bestStreak: 15,
//     currentStreak: 6,
//     averageTimePerQuiz: 13,
//     totalXP: 12500,
//   },
//   recentQuizzes: [
//     {
//       id: "1",
//       title: "JavaScript Fundamentals",
//       category: "Programming",
//       dateTaken: "Feb 10, 2025",
//       percentage: 85,
//       timeTaken: 12,
//       difficulty: "MEDIUM" as const,
//     },
//     {
//       id: "2",
//       title: "Data Structures",
//       category: "Computer Science",
//       dateTaken: "Feb 9, 2025",
//       percentage: 92,
//       timeTaken: 15,
//       difficulty: "HARD" as const,
//     },
//     {
//       id: "3",
//       title: "Web Development Basics",
//       category: "Programming",
//       dateTaken: "Feb 8, 2025",
//       percentage: 75,
//       timeTaken: 18,
//       difficulty: "EASY" as const,
//     },
//   ],
//   categoryPerformance: [
//     { name: "Programming", score: 82, quizzes: 20 },
//     { name: "Computer Science", score: 78, quizzes: 15 },
//     { name: "Web Development", score: 85, quizzes: 12 },
//     { name: "Data Science", score: 76, quizzes: 8 },
//     { name: "Cybersecurity", score: 80, quizzes: 5 },
//   ],
//   achievements: [
//     {
//       id: 1,
//       title: "Quick Learner",
//       description: "Complete 5 quizzes in one day",
//       progress: 80,
//     },
//     {
//       id: 2,
//       title: "Perfect Score",
//       description: "Get 100% on any quiz",
//       progress: 100,
//     },
//     {
//       id: 3,
//       title: "Knowledge Seeker",
//       description: "Take quizzes in 5 different categories",
//       progress: 60,
//     },
//   ],
//   weeklyProgress: [
//     { day: "Mon", quizzes: 4, score: 85, xp: 450 },
//     { day: "Tue", quizzes: 3, score: 78, xp: 350 },
//     { day: "Wed", quizzes: 5, score: 92, xp: 600 },
//     { day: "Thu", quizzes: 2, score: 88, xp: 300 },
//     { day: "Fri", quizzes: 4, score: 76, xp: 400 },
//     { day: "Sat", quizzes: 6, score: 82, xp: 550 },
//     { day: "Sun", quizzes: 3, score: 90, xp: 425 },
//   ],
// };
