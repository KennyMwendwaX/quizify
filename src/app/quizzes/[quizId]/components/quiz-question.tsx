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
  CheckCircle2,
  AlertCircle,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateQuizSubmission } from "@/server/actions";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

function quizReducer(state: QuizState, action: QuizAction): QuizState {
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
        timeTaken: state.timeLeft,
      };
    case "SET_TIME_WARNING":
      return {
        ...state,
        showTimeWarning: true,
      };
    default:
      return state;
  }
}

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
}

function QuizResults({ score, totalQuestions, timeTaken }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="text-card-foreground">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative p-6 bg-primary/10 rounded-full">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
        </div>
        <div>
          <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Here&apos;s how you performed
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">{percentage}%</div>
            <div className="text-sm text-muted-foreground mt-1">Score</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-3xl font-bold text-primary">
              {formatTime(timeTaken)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Time</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Correct Answers: {score}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Incorrect Answers: {totalQuestions - score}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          size="lg">
          <Rocket className="mr-2 h-5 w-5" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}

interface QuizQuestionProps {
  quiz: PublicQuiz;
}

export default function QuizQuestion({ quiz }: QuizQuestionProps) {
  const [isPending, startTransition] = useTransition();

  const initialState: QuizState = {
    currentQuestion: 0,
    answers: new Array(quiz.questions.length).fill(null),
    timeLeft: (quiz.timeLimit ?? 0) * 60,
    isCompleted: false,
    showTimeWarning: false,
  };

  const [state, dispatch] = useReducer(quizReducer, initialState);

  const handleFinish = () => {
    const validAnswers = state.answers.filter(
      (answer): answer is number => answer !== null
    );

    startTransition(async () => {
      const result = await validateQuizSubmission(
        quiz.id,
        validAnswers,
        state.timeLeft
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90">
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
