"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Award,
  Brain,
  BarChart3,
  Trophy,
  ChevronRight,
  PlayCircle,
  Calendar,
  User,
  Info,
  Medal,
  Timer,
  Star,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PublicQuiz, QuizAttempt } from "@/database/schema";

// Mock data - in a real app, this would come from props or a data fetching hook
const quizData = {
  id: 1,
  title: "JavaScript Fundamentals",
  description:
    "Test your knowledge of JavaScript basics including variables, functions, and objects.",
  category: "Programming",
  difficulty: "MEDIUM",
  isTimeLimited: true,
  timeLimit: 600, // 10 minutes in seconds
  questionCount: 10,
  createdBy: "John Doe",
  createdAt: new Date("2025-02-15T10:30:00"),
};

const myAttempts = [
  {
    id: 101,
    date: new Date("2025-03-20T14:22:00"),
    score: 8,
    percentage: 80,
    timeTaken: 483, // in seconds
    xpEarned: 120,
  },
  {
    id: 82,
    date: new Date("2025-03-10T09:15:00"),
    score: 6,
    percentage: 60,
    timeTaken: 542, // in seconds
    xpEarned: 90,
  },
];

const leaderboardData = [
  {
    rank: 1,
    user: "AliceCode",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 10,
    percentage: 100,
    timeTaken: 420,
    xpEarned: 150,
  },
  {
    rank: 2,
    user: "BobDev",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 9,
    percentage: 90,
    timeTaken: 450,
    xpEarned: 135,
  },
  {
    rank: 3,
    user: "CodeMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 9,
    percentage: 90,
    timeTaken: 480,
    xpEarned: 135,
  },
  {
    rank: 4,
    user: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 8,
    percentage: 80,
    timeTaken: 483,
    xpEarned: 120,
  },
  {
    rank: 5,
    user: "DevGuru",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 8,
    percentage: 80,
    timeTaken: 510,
    xpEarned: 120,
  },
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
};

type QuizDetailsProps = {
  quiz: PublicQuiz;
  userQuizAttempts: (QuizAttempt & {
    user: {
      name: string;
    };
  })[];
};

export default function QuizDetails() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push(`/quizzes/${quizData.id}/play`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-500 text-emerald-50";
      case "MEDIUM":
        return "bg-amber-500 text-amber-50";
      case "HARD":
        return "bg-rose-500 text-rose-50";
      default:
        return "bg-slate-500 text-slate-50";
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return 1;
      case "MEDIUM":
        return 2;
      case "HARD":
        return 3;
      default:
        return 0;
    }
  };

  // Find the user's best attempt
  const bestAttempt =
    myAttempts.length > 0
      ? myAttempts.reduce(
          (best, current) =>
            current.percentage > best.percentage ||
            (current.percentage === best.percentage &&
              current.timeTaken < best.timeTaken)
              ? current
              : best,
          myAttempts[0]
        )
      : null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={cn(
                    "px-3 py-1",
                    getDifficultyColor(quizData.difficulty)
                  )}>
                  {quizData.difficulty}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {quizData.category}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {quizData.title}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {quizData.description}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md">
                <PlayCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Play Quiz
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {myAttempts.length} previous attempts
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                <div className="flex">
                  {Array.from({
                    length: getDifficultyStars(quizData.difficulty),
                  }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-primary fill-primary"
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm font-medium">Difficulty</span>
              <span className="text-xs text-muted-foreground mt-1">
                {quizData.difficulty}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Time Limit</span>
              <span className="text-xs text-muted-foreground mt-1">
                {quizData.isTimeLimited
                  ? formatTime(quizData.timeLimit)
                  : "No limit"}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Questions</span>
              <span className="text-xs text-muted-foreground mt-1">
                {quizData.questionCount} total
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-xl transition-all duration-300 hover:bg-muted hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">XP Reward</span>
              <span className="text-xs text-muted-foreground mt-1">
                Up to 150 XP
              </span>
            </div>
          </div>

          {bestAttempt && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" /> Your Best
                Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center mb-1">
                    <Medal className="h-4 w-4 mr-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {bestAttempt.score}/{quizData.questionCount}
                  </p>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${bestAttempt.percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {bestAttempt.percentage}%
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Time Taken</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatTime(bestAttempt.timeTaken)}
                  </p>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (bestAttempt.timeTaken / quizData.timeLimit) * 100
                        )}%`,
                      }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {quizData.isTimeLimited
                      ? `${Math.round(
                          (bestAttempt.timeTaken / quizData.timeLimit) * 100
                        )}% of limit`
                      : "No limit"}
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center mb-1">
                    <Award className="h-4 w-4 mr-1 text-primary" />
                    <p className="text-xs text-muted-foreground">XP Earned</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {bestAttempt.xpEarned} XP
                  </p>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (bestAttempt.xpEarned / 150) * 100
                        )}%`,
                      }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {Math.round((bestAttempt.xpEarned / 150) * 100)}% of max
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-background">
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="attempts"
            className="rounded-lg data-[state=active]:bg-background">
            <User className="h-4 w-4 mr-2" />
            My Attempts
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="rounded-lg data-[state=active]:bg-background">
            <BarChart3 className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Quiz Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </h3>
                    <p className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {quizData.category}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Created By
                    </h3>
                    <p className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src="/placeholder.svg?height=30&width=30"
                          alt={quizData.createdBy}
                        />
                        <AvatarFallback>
                          {quizData.createdBy.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {quizData.createdBy}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Created On
                    </h3>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(quizData.createdAt, "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Scoring
                    </h3>
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Each correct answer is worth 1 point</li>
                        <li>Time bonus applied for fast completion</li>
                        <li>
                          Difficulty bonus:{" "}
                          {quizData.difficulty === "EASY"
                            ? "0"
                            : quizData.difficulty === "MEDIUM"
                            ? "25"
                            : "50"}{" "}
                          XP
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button onClick={handleStartQuiz} className="w-full sm:w-auto">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Quiz Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                My Quiz Attempts
              </CardTitle>
              <CardDescription>
                Your history of attempts for this quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myAttempts.length > 0 ? (
                <div className="rounded-xl border overflow-hidden">
                  <ScrollArea className="w-full" type="always">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Time Taken</TableHead>
                          <TableHead>XP Earned</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myAttempts.map((attempt, index) => (
                          <TableRow
                            key={attempt.id}
                            className={
                              index === 0
                                ? "bg-blue-50/50 dark:bg-blue-950/20"
                                : ""
                            }>
                            <TableCell>
                              <div className="font-medium">
                                {format(attempt.date, "MMM d, yyyy")}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(attempt.date, "h:mm a")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="mr-2 font-medium">
                                  {attempt.score}/{quizData.questionCount}
                                </div>
                                <Badge
                                  variant={
                                    attempt.percentage >= 70
                                      ? "default"
                                      : "outline"
                                  }
                                  className="text-xs">
                                  {attempt.percentage}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {formatTime(attempt.timeTaken)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Award className="h-3 w-3 mr-1 text-amber-500" />
                                <span className="font-medium">
                                  {attempt.xpEarned}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  XP
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted/50 p-3">
                      <PlayCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t attempted this quiz yet.
                  </p>
                  <Button
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-primary to-primary/80">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Take Quiz Now
                  </Button>
                </div>
              )}
            </CardContent>
            {myAttempts.length > 0 && (
              <CardFooter className="flex justify-center border-t pt-6">
                <Button
                  onClick={handleStartQuiz}
                  variant="outline"
                  className="w-full sm:w-auto">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top performers on this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <ScrollArea className="w-full" type="always">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>XP Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((entry) => (
                        <TableRow
                          key={entry.rank}
                          className={cn(
                            entry.user === "John Doe"
                              ? "bg-blue-50/50 dark:bg-blue-950/20"
                              : "",
                            entry.rank <= 3
                              ? "bg-amber-50/30 dark:bg-amber-950/10"
                              : ""
                          )}>
                          <TableCell>
                            {entry.rank <= 3 ? (
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 text-amber-900 font-bold shadow-sm">
                                {entry.rank}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground font-medium">
                                {entry.rank}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={entry.avatar}
                                  alt={entry.user}
                                />
                                <AvatarFallback>
                                  {entry.user.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className={cn(
                                  "font-medium",
                                  entry.rank === 1
                                    ? "text-amber-700 dark:text-amber-400"
                                    : "",
                                  entry.user === "John Doe"
                                    ? "text-primary"
                                    : ""
                                )}>
                                {entry.user}
                                {entry.user === "John Doe" && " (You)"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 font-medium">
                                {entry.score}/{quizData.questionCount}
                              </div>
                              <Badge
                                variant={
                                  entry.percentage >= 90 ? "default" : "outline"
                                }
                                className="text-xs">
                                {entry.percentage}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              {formatTime(entry.timeTaken)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Award className="h-3 w-3 mr-1 text-amber-500" />
                              <span className="font-medium">
                                {entry.xpEarned}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                XP
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button onClick={handleStartQuiz} className="w-full sm:w-auto">
                <PlayCircle className="mr-2 h-5 w-5" />
                Beat the High Score
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
