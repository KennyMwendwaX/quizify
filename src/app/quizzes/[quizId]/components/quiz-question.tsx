"use client";

import React, { useEffect, useReducer, useTransition } from "react";
import { PublicQuiz } from "@/database/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Trophy,
  Rocket,
  TrendingUp,
  Target,
  LayoutDashboard,
  FileText,
  Award,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitQuizAttempt } from "@/server/quiz/submit";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Session } from "@/lib/auth";

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  timeLeft: number;
  isCompleted: boolean;
  showTimeWarning: boolean;
  score?: number;
  totalQuestions?: number;
  questionsAnswered?: number;
  timeTaken?: number;
}

type QuizAction =
  | { type: "SELECT_ANSWER"; questionIndex: number; answer: number }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "TICK_TIMER" }
  | {
      type: "COMPLETE_QUIZ";
      payload: {
        score: number;
        totalQuestions: number;
        questionsAnswered: number;
      };
    }
  | { type: "SET_TIME_WARNING" };

const createQuizReducer =
  (quiz: PublicQuiz) =>
  (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
      case "SELECT_ANSWER":
        const newAnswers = [...state.answers];
        newAnswers[action.questionIndex] = action.answer;
        return { ...state, answers: newAnswers };
      case "NEXT_QUESTION":
        return {
          ...state,
          currentQuestion: Math.min(
            state.currentQuestion + 1,
            state.answers.length - 1
          ),
        };
      case "PREVIOUS_QUESTION":
        return {
          ...state,
          currentQuestion: Math.max(state.currentQuestion - 1, 0),
        };
      case "TICK_TIMER":
        return {
          ...state,
          timeLeft: Math.max(0, state.timeLeft - 1),
        };
      case "COMPLETE_QUIZ":
        return {
          ...state,
          isCompleted: true,
          score: action.payload.score,
          totalQuestions: action.payload.totalQuestions,
          questionsAnswered: action.payload.questionsAnswered,
          timeTaken: (quiz.timeLimit ?? 0) * 60 - state.timeLeft,
        };
      case "SET_TIME_WARNING":
        return {
          ...state,
          showTimeWarning: true,
        };
      default:
        return state;
    }
  };

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
}

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

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  timeTaken,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

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
            You scored {score} out of {totalQuestions} questions
          </p>

          {percentage < 70 && (
            <div className="flex items-center gap-2 text-amber-600 text-sm p-2 bg-amber-50 rounded-lg">
              <span className="inline-block w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
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
            value={`${score}/${totalQuestions}`}
            label="Questions"
            color={performanceData.color}
          />

          <StatCard
            icon={<Clock className="w-5 h-5" />}
            value={formatTime(timeTaken)}
            label="Time Taken"
            color="text-emerald-600"
          />

          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={`${Math.round(timeTaken / totalQuestions)}s`}
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
};

interface QuizQuestionProps {
  quiz: PublicQuiz;
  session: Session;
}

export default function QuizQuestion({ quiz, session }: QuizQuestionProps) {
  const [isPending, startTransition] = useTransition();

  const initialState: QuizState = {
    currentQuestion: 0,
    answers: new Array(quiz.questions.length).fill(null),
    timeLeft: (quiz.timeLimit ?? 0) * 60,
    isCompleted: false,
    showTimeWarning: false,
  };

  const [state, dispatch] = useReducer(createQuizReducer(quiz), initialState);

  const handleFinish = () => {
    const validAnswers = state.answers.filter(
      (answer): answer is number => answer !== null
    );

    startTransition(async () => {
      const result = await submitQuizAttempt(
        quiz.id,
        validAnswers,
        state.timeLeft,
        session.user.id
      );
      console.log(
        `quizId: ${quiz.id}, validAnswers: ${validAnswers}, timeLeft: ${state.timeLeft}, id: ${session.user.id}`
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.score !== undefined && result.totalQuestions !== undefined) {
        dispatch({
          type: "COMPLETE_QUIZ",
          payload: {
            score: result.score,
            totalQuestions: result.totalQuestions,
            questionsAnswered: result.questionsAnswered ?? validAnswers.length,
          },
        });
      }
    });
  };
  useEffect(() => {
    if (state.timeLeft > 0 && !state.isCompleted) {
      const timer = setTimeout(() => dispatch({ type: "TICK_TIMER" }), 1000);
      if (state.timeLeft <= 30 && !state.showTimeWarning) {
        dispatch({ type: "SET_TIME_WARNING" });
      }
      return () => clearTimeout(timer);
    } else if (state.timeLeft === 0) {
      handleFinish();
    }
  }, [state.timeLeft, state.isCompleted, state.showTimeWarning]);

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({
      type: "SELECT_ANSWER",
      questionIndex: state.currentQuestion,
      answer: answerIndex,
    });
  };

  const handleNext = () => {
    if (state.currentQuestion < quiz.questions.length - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_QUESTION" });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (
    state.isCompleted &&
    state.score !== undefined &&
    state.timeTaken !== undefined
  ) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="w-full max-w-3xl mx-auto p-4">
          <QuizResults
            score={state.score}
            totalQuestions={state.totalQuestions ?? quiz.questions.length}
            timeTaken={state.timeTaken}
          />
        </div>
      </div>
    );
  }

  const question = quiz.questions[state.currentQuestion];
  const progress = ((state.currentQuestion + 1) / quiz.questions.length) * 100;
  const isTimeRunningLow = state.timeLeft <= 30;

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="w-full max-w-3xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold line-clamp-1">
                  {quiz.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Question {state.currentQuestion + 1} of{" "}
                  {quiz.questions.length}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors w-fit",
                  isTimeRunningLow
                    ? "bg-red-500/10 animate-pulse"
                    : "bg-primary/10"
                )}>
                <Clock
                  className={cn(
                    "w-4 h-4",
                    isTimeRunningLow ? "text-red-500" : "text-primary"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    isTimeRunningLow ? "text-red-500" : "text-primary"
                  )}>
                  {formatTime(state.timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">{question.title}</h2>
              <RadioGroup
                value={state.answers[state.currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(Number(value))}
                className="space-y-3">
                {question.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg border p-3 transition-colors",
                      state.answers[state.currentQuestion] === index
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    )}>
                    <RadioGroupItem
                      value={index.toString()}
                      id={`answer-${index}`}
                      className="peer hidden"
                    />
                    <Label
                      htmlFor={`answer-${index}`}
                      className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border text-sm font-medium",
                            state.answers[state.currentQuestion] === index
                              ? "border-primary text-primary"
                              : "border-muted"
                          )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm">{choice}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6">
            <Button
              onClick={handlePrevious}
              disabled={state.currentQuestion === 0 || isPending}
              variant="outline"
              className="flex-1">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                state.answers[state.currentQuestion] === null || isPending
              }
              className={cn(
                "flex-1",
                isPending && "opacity-80 cursor-not-allowed"
              )}>
              {state.currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {isPending ? (
                    <span className="inline-flex items-center">
                      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <>
                      Finish
                      <Flag className="ml-2 h-4 w-4" />
                    </>
                  )}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
