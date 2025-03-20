"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AdminQuiz, QuizAttempt } from "@/database/schema";
import { cn } from "@/lib/utils";
import {
  Award,
  Clock,
  FileText,
  LayoutDashboard,
  Medal,
  Rocket,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
  <div className="flex items-center gap-4 p-4 border rounded-lg">
    <div
      className={cn(
        "p-3 rounded-full",
        color.replace("text-", "bg-").replace("600", "100")
      )}>
      {icon}
    </div>
    <div>
      <span className={cn("text-xl font-bold", color)}>{value}</span>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  </div>
);

interface QuizResultsProps {
  quiz: AdminQuiz;
  quizAttempt: QuizAttempt;
}

export default function QuizResultsCard({
  quiz,
  quizAttempt,
}: QuizResultsProps) {
  const percentage = Math.round(
    (quizAttempt.score / quiz.questions.length) * 100
  );

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPerformanceData = (): {
    message: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
  } => {
    if (percentage >= 90)
      return {
        message: "Excellent!",
        icon: <Trophy className="w-8 h-8 text-amber-600" />,
        color: "text-amber-600",
        gradient: "from-amber-500/20 to-amber-300/5",
      };
    if (percentage >= 75)
      return {
        message: "Great Job!",
        icon: <Award className="w-8 h-8 text-indigo-600" />,
        color: "text-indigo-600",
        gradient: "from-indigo-500/20 to-indigo-300/5",
      };
    if (percentage >= 60)
      return {
        message: "Good Effort!",
        icon: <Medal className="w-8 h-8 text-emerald-600" />,
        color: "text-emerald-600",
        gradient: "from-emerald-500/20 to-emerald-300/5",
      };
    return {
      message: "Keep Practicing!",
      icon: <Target className="w-8 h-8 text-blue-600" />,
      color: "text-blue-600",
      gradient: "from-blue-500/20 to-blue-300/5",
    };
  };

  const performanceData = getPerformanceData();

  return (
    <Card
      className={cn(
        "max-w-xl mx-auto shadow-lg",
        "bg-gradient-to-br from-background via-background to-background",
        "border-t-4",
        percentage >= 90
          ? "border-t-amber-500"
          : percentage >= 75
          ? "border-t-indigo-500"
          : percentage >= 60
          ? "border-t-emerald-500"
          : "border-t-blue-500"
      )}>
      <div
        className={cn(
          "absolute inset-0 opacity-10 bg-gradient-to-br pointer-events-none",
          performanceData.gradient
        )}
      />

      <div className="flex flex-row p-6 gap-6 items-center relative z-10">
        {/* Score Circle */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-muted/10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${percentage * 2.83} 1000`}
              className={cn(
                percentage >= 90
                  ? "text-amber-500"
                  : percentage >= 75
                  ? "text-indigo-500"
                  : percentage >= 60
                  ? "text-emerald-500"
                  : "text-blue-500"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={cn("text-2xl font-bold", performanceData.color)}>
                {percentage}%
              </span>
              <p className="text-xs font-medium text-muted-foreground">Score</p>
            </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {performanceData.icon}
            <CardTitle
              className={cn("text-2xl font-bold", performanceData.color)}>
              {performanceData.message}
            </CardTitle>
          </div>
          <p className="text-base text-muted-foreground mb-3">
            You scored {quizAttempt.score} out of {quiz.questions.length}
            questions
          </p>

          {percentage < 70 && (
            <div className="flex items-center gap-2 text-amber-600 text-sm p-2 bg-amber-50 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                !
              </span>
              <span>Review your answers to improve your score next time</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="pt-0 pb-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Target className="w-5 h-5" />}
            value={`${quizAttempt.score}/${quiz.questions.length}`}
            label="Questions"
            color={performanceData.color}
          />

          <StatCard
            icon={<Clock className="w-5 h-5" />}
            value={formatTime(quizAttempt.timeTaken)}
            label="Time Taken"
            color="text-emerald-600"
          />

          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={`${Math.round(
              quizAttempt.timeTaken / quiz.questions.length
            )}s`}
            label="Per Question"
            color="text-indigo-600"
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-2 pb-6">
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="flex-1 bg-background hover:bg-slate-100 text-foreground border border-input"
          variant="outline">
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Dashboard
        </Button>

        <Button
          onClick={() => (window.location.href = "/quiz/review")}
          className="flex-1 bg-background hover:bg-slate-100 text-foreground border border-input"
          variant="outline">
          <FileText className="mr-2 h-5 w-5" />
          Review
        </Button>

        <Button
          onClick={() => window.location.reload()}
          className={cn(
            "flex-1",
            percentage >= 90
              ? "bg-amber-500 hover:bg-amber-600"
              : percentage >= 75
              ? "bg-indigo-500 hover:bg-indigo-600"
              : percentage >= 60
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-blue-500 hover:bg-blue-600"
          )}>
          <Rocket className="mr-2 h-5 w-5" />
          Retry Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
