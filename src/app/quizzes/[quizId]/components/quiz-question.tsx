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

function QuizResults({
  score,
  totalQuestions,
  timeTaken,
}: {
  score: number;
  totalQuestions: number;
  timeTaken: number;
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Excellent Performance!";
    if (percentage >= 75) return "Great Job!";
    if (percentage >= 60) return "Good Effort!";
    return "Keep Practicing!";
  };

  return (
    <Card className="max-w-xl mx-auto bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 transform rotate-6 scale-150 origin-top-right"></div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative p-5 bg-primary/10 rounded-full">
              <Trophy className="w-16 h-16 text-primary" />
            </div>
          </div>

          <div>
            <CardTitle className="text-3xl font-bold text-primary">
              {getPerformanceMessage()}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Quiz Completed Successfully
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-primary mr-2" />
              <span className="text-2xl font-bold text-primary">
                {percentage}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-emerald-500 mr-2" />
              <span className="text-2xl font-bold text-emerald-600">
                {formatTime(timeTaken)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-indigo-500 mr-2" />
              <span className="text-2xl font-bold text-indigo-600">
                {score}/{totalQuestions}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          size="lg"
          variant="outline">
          <Rocket className="mr-2 h-5 w-5" />
          Retry Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}

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
