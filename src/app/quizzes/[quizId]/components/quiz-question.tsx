"use client";

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
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  quiz: PublicQuiz;
};

export default function QuizQuestion({ quiz }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>((quiz.timeLimit ?? 0) * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      if (timeLeft <= 30 && !showTimeWarning) {
        setShowTimeWarning(true);
      }
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, quizCompleted, showTimeWarning]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      finishQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isTimeRunningLow = timeLeft <= 30;

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
                  Question {currentQuestion + 1} of {quiz.questions.length}
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
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">{question.title}</h2>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(Number(value))}
                className="space-y-3">
                {question.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg border p-3 transition-colors",
                      selectedAnswer === index
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
                            selectedAnswer === index
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
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={goToNextQuestion}
              disabled={selectedAnswer === null}
              className="flex-1">
              {currentQuestion < quiz.questions.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Finish
                  <Flag className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
