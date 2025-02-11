"use client";

import {
  PlusCircle,
  PlayCircle,
  TrendingUp,
  BarChart2,
  Medal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Session } from "@/lib/auth";

// Define TypeScript interfaces for better type safety
interface Quiz {
  id: string;
  title: string;
  category: string;
  dateTaken: string;
  percentage: number;
  timeTaken: number;
}

interface DashboardStats {
  totalQuizzesTaken: number;
  averageScore: number;
  topCategory: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentQuizzes: Quiz[];
}

interface Props {
  dashboardData: DashboardData;
  session: Session;
}

// Separate components for better organization
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

const QuizCard = ({ quiz }: { quiz: Quiz }) => (
  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
    <div>
      <h3 className="font-medium text-sm">{quiz.title}</h3>
      <p className="text-xs text-muted-foreground">
        {quiz.category} • {quiz.dateTaken}
      </p>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold">{quiz.percentage}%</div>
      <div className="text-xs text-muted-foreground">{quiz.timeTaken} mins</div>
    </div>
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

export default function DashboardContent({ dashboardData, session }: Props) {
  const { stats, recentQuizzes } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12">
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

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
            title="Top Category"
            value={stats.topCategory}
            icon={BarChart2}
            subtitle="Your most played category"
          />
        </div>

        {/* Recent Actions Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Quizzes */}
          <Card>
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
                <Medal className="mr-2 h-5 w-5" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
