"use client";

import {
  Trophy,
  PlusCircle,
  PlayCircle,
  TrendingUp,
  Clock,
  BarChart2,
  Medal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data - replace with actual data fetching
const userStats = {
  totalQuizzesTaken: 42,
  averageScore: 78.5,
  averageTimePerQuiz: 12.3,
  topCategory: "Technology",
  recentBadges: [
    { name: "Quiz Master", icon: Trophy, color: "text-yellow-500" },
    { name: "Speed Runner", icon: Clock, color: "text-green-500" },
  ],
};

const recentQuizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Technology",
    dateTaken: "2 days ago",
    score: 85,
    percentage: 85,
    timeTaken: 10,
  },
  {
    id: 2,
    title: "World History Challenge",
    category: "History",
    dateTaken: "5 days ago",
    score: 72,
    percentage: 72,
    timeTaken: 15,
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Welcome, Helmeted Chief
            </h1>
            <p className="text-muted-foreground">
              Ready to test your knowledge and grow your skills?
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Quizzes Taken */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quizzes Taken
                </CardTitle>
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.totalQuizzesTaken}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total quizzes completed
                </p>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.averageScore}%
                </div>
                <Progress value={userStats.averageScore} className="h-2 mt-2" />
              </CardContent>
            </Card>

            {/* Top Category */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Category
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats.topCategory}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your strongest quiz category
                </p>
              </CardContent>
            </Card>
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
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">{quiz.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {quiz.category} • {quiz.dateTaken}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {quiz.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quiz.timeTaken} mins
                      </div>
                    </div>
                  </div>
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
                <Link href="/quizzes/create" className="block">
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Quiz
                  </Button>
                </Link>
                <Link href="/quizzes" className="block">
                  <Button variant="outline" className="w-full">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start a Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
