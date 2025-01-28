"use client";

import { useState, useEffect } from "react";
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
  Trophy,
  Rocket,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockQuiz = {
  title: "General Knowledge Quiz",
  description: "Test your knowledge across various topics",
  questions: [
    {
      id: "1",
      text: "What is the capital of France?",
      choices: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
    },
    {
      id: "2",
      text: "Which planet is known as the Red Planet?",
      choices: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
    },
  ],
  timeLimit: 1 * 60,
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(mockQuiz.questions.length).fill(null)
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
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (selectedAnswer === mockQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < mockQuiz.questions.length - 1) {
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

  const QuizResults = () => {
    const percentage = (score / mockQuiz.questions.length) * 100;
    const timeSpent = mockQuiz.timeLimit - timeLeft;

    return (
      <Card className="text-card-foreground">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative p-6 bg-primary/10 rounded-full">
              <Trophy className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">
              Quiz Completed!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Here&apos;s how you performed
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {percentage}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Score</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">
                {formatTime(timeSpent)}
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
              <span>
                Incorrect Answers: {mockQuiz.questions.length - score}
              </span>
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
  };

  const QuizQuestion = () => {
    const question = mockQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;
    const isTimeRunningLow = timeLeft <= 30;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl font-semibold">
                {mockQuiz.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Question {currentQuestion + 1} of {mockQuiz.questions.length}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
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
            <h2 className="text-lg font-medium">{question.text}</h2>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number(value))}
              className="space-y-3">
              {question.choices.map((choice, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
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
                          "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                          selectedAnswer === index
                            ? "border-primary text-primary"
                            : "border-muted"
                        )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{choice}</span>
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
            {currentQuestion < mockQuiz.questions.length - 1 ? (
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
    );
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      {quizCompleted ? <QuizResults /> : <QuizQuestion />}
    </div>
  );
}
