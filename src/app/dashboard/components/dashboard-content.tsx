"use client";

import { useState } from "react";
import {
  PlusCircle,
  PlayCircle,
  TrendingUp,
  Medal,
  Book,
  Target,
  Trophy,
  Calendar,
  Clock,
  ActivitySquare,
  Zap,
  Brain,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Session } from "@/lib/auth";

const mockDashboardData = {
  stats: {
    totalQuizzesTaken: 47,
    averageScore: 78,
    topCategory: "Computer Science",
    completionRate: 92,
    bestStreak: 15,
    averageTimePerQuiz: 13,
    totalXP: 12500,
  },
  recentQuizzes: [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      category: "Programming",
      dateTaken: "Feb 10, 2025",
      percentage: 85,
      timeTaken: 12,
      difficulty: "MEDIUM" as const,
    },
    {
      id: "2",
      title: "Data Structures",
      category: "Computer Science",
      dateTaken: "Feb 9, 2025",
      percentage: 92,
      timeTaken: 15,
      difficulty: "HARD" as const,
    },
    {
      id: "3",
      title: "Web Development Basics",
      category: "Programming",
      dateTaken: "Feb 8, 2025",
      percentage: 75,
      timeTaken: 18,
      difficulty: "EASY" as const,
    },
  ],
  categoryPerformance: [
    { name: "Programming", score: 82, quizzes: 20 },
    { name: "Computer Science", score: 78, quizzes: 15 },
    { name: "Web Development", score: 85, quizzes: 12 },
    { name: "Data Science", score: 76, quizzes: 8 },
    { name: "Cybersecurity", score: 80, quizzes: 5 },
  ],
  achievements: [
    {
      id: 1,
      title: "Quick Learner",
      description: "Complete 5 quizzes in one day",
      progress: 80,
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      progress: 100,
    },
    {
      id: 3,
      title: "Knowledge Seeker",
      description: "Take quizzes in 5 different categories",
      progress: 60,
    },
  ],
  weeklyProgress: [
    { day: "Mon", quizzes: 4, score: 85, xp: 450 },
    { day: "Tue", quizzes: 3, score: 78, xp: 350 },
    { day: "Wed", quizzes: 5, score: 92, xp: 600 },
    { day: "Thu", quizzes: 2, score: 88, xp: 300 },
    { day: "Fri", quizzes: 4, score: 76, xp: 400 },
    { day: "Sat", quizzes: 6, score: 82, xp: 550 },
    { day: "Sun", quizzes: 3, score: 90, xp: 425 },
  ],
};

// Component definitions
const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  progress,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
  progress?: number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {progress !== undefined && (
        <Progress value={progress} className="h-2 mt-2" />
      )}
    </CardContent>
  </Card>
);

interface Quiz {
  id: string;
  title: string;
  category: string;
  dateTaken: string;
  percentage: number;
  timeTaken: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

const QuizCard = ({ quiz }: { quiz: Quiz }) => (
  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
    <div>
      <h3 className="font-medium text-sm">{quiz.title}</h3>

      <p className="text-xs text-muted-foreground">
        {quiz.category}• {quiz.dateTaken} • {quiz.difficulty}
      </p>
    </div>

    <div className="text-right">
      <div className="text-sm font-bold">{quiz.percentage}%</div>

      <div className="text-xs text-muted-foreground">{quiz.timeTaken} mins</div>
    </div>
  </div>
);
interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
}

const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
  <div className="p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
    <h3 className="font-medium mb-1">{achievement.title}</h3>
    <p className="text-sm text-muted-foreground mb-2">
      {achievement.description}
    </p>
    <Progress value={achievement.progress} className="h-2" />
    <p className="text-xs text-muted-foreground mt-1">
      {achievement.progress}% Complete
    </p>
  </div>
);

const ActionButton = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Link href={href} className="block">
    <Button
      variant="outline"
      className="w-full hover:bg-primary/5 transition-colors">
      <Icon className="mr-2 h-5 w-5" />
      {children}
    </Button>
  </Link>
);

type Props = {
  session: Session;
};

export default function DashboardContent({ session }: Props) {
  const {
    stats,
    recentQuizzes,
    achievements,
    weeklyProgress,
    categoryPerformance,
  } = mockDashboardData;
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome, {session.user.name}
          </h1>
          <p className="text-muted-foreground">
            Ready to test your knowledge and grow your skills?
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6">
                <StatCard
                  title="Quizzes Taken"
                  value={stats.totalQuizzesTaken}
                  icon={PlayCircle}
                  subtitle="Total quizzes completed"
                />
                <StatCard
                  title="Average Score"
                  value={`${stats.averageScore}%`}
                  icon={TrendingUp}
                  progress={stats.averageScore}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionRate}%`}
                  icon={ActivitySquare}
                  progress={stats.completionRate}
                  subtitle="Finished vs Started Quizzes"
                />
                <StatCard
                  title="Total XP"
                  value={stats.totalXP.toLocaleString()}
                  icon={Zap}
                  subtitle="Experience Points"
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Quizzes */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Recent Quizzes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ActionButton href="/quizzes/create" icon={PlusCircle}>
                      Create New Quiz
                    </ActionButton>
                    <ActionButton href="/quizzes" icon={PlayCircle}>
                      Start a Quiz
                    </ActionButton>
                    <ActionButton href="/learn" icon={Book}>
                      Learning Path
                    </ActionButton>
                    <ActionButton href="/goals" icon={Target}>
                      Set Goals
                    </ActionButton>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          name="Score %"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="xp"
                          stroke="#10b981"
                          name="XP Gained"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Category Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar
                          yAxisId="left"
                          dataKey="score"
                          fill="#3b82f6"
                          name="Avg. Score %"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="quizzes"
                          fill="#10b981"
                          name="Quizzes Taken"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-8">
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Learning Stats */}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Learning Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <StatCard
                    title="Avg. Time per Quiz"
                    value={`${stats.averageTimePerQuiz} min`}
                    icon={Clock}
                    subtitle="Time management score"
                  />
                  <StatCard
                    title="Top Category"
                    value={stats.topCategory}
                    icon={Medal}
                    subtitle="Your strongest subject"
                  />
                  <StatCard
                    title="Best Streak"
                    value={`${stats.bestStreak} days`}
                    icon={Zap}
                    subtitle="Longest learning streak"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
