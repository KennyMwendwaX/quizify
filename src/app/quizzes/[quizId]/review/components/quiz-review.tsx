"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  ArrowLeft,
  Eye,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { formatSecondsToMinutes } from "@/lib/format-time";

type AdminQuestion = {
  title: string;
  choices: string[];
  correctAnswer: number;
};

type AdminQuiz = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  title: string;
  description: string;
  category: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  isTimeLimited: boolean;
  timeLimit: number | null;
  questions: AdminQuestion[];
};

type QuizAttempt = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  quizId: number;
  answers: number[];
  score: number;
  percentage: number;
  isCompleted: boolean;
  timeTaken: number;
  xpEarned: number;
};

interface QuizReviewProps {
  quiz: AdminQuiz;
  quizAttempt: QuizAttempt;
}

export default function QuizReview({ quiz, quizAttempt }: QuizReviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const userAnswer = quizAttempt.answers[currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer;
  const isAnswered = userAnswer !== -1 && userAnswer !== undefined;
  const isCorrect = userAnswer === correctAnswer;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <Button variant="ghost" asChild className="h-10 gap-2">
              <Link href={`/quizzes/${quiz.id}/results`}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-10 gap-2 px-4">
                <Eye className="w-4 h-4" />
                Review Mode
              </Badge>
            </div>
          </div>

          {/* Quiz Info Card */}
          <Card className="bg-white/50 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
                <Badge variant="secondary" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  {quiz.category}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                {quiz.title}
              </CardTitle>
              <p className="text-muted-foreground">{quiz.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4" />
                  {formatSecondsToMinutes(quiz.timeLimit ?? 0)} allotted
                </div>
                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4" />
                  {formatSecondsToMinutes(quizAttempt.timeTaken)} taken
                </div>
                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4" />
                  {quiz.questions.length} questions
                </div>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  {quizAttempt.score}/{quiz.questions.length} (
                  {quizAttempt.percentage}%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="bg-white/50 backdrop-blur-xl shadow-lg">
            <CardHeader className="border-b border-border/40">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <Badge
                  variant={
                    isCorrect
                      ? "default"
                      : isAnswered
                      ? "destructive"
                      : "secondary"
                  }
                  className={isCorrect ? "bg-green-100 text-green-700" : ""}>
                  {isCorrect
                    ? "Correct"
                    : isAnswered
                    ? "Incorrect"
                    : "Not Answered"}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                <h3 className="text-xl font-semibold mb-6">
                  {currentQuestion.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.choices.map((choice, index) => {
                    const isUserAnswer = userAnswer === index;
                    const isCorrectAnswer = correctAnswer === index;

                    let buttonClass =
                      "h-auto min-h-[3.5rem] p-4 justify-start gap-4 relative ";
                    let iconComponent = null;

                    if (isUserAnswer && isCorrectAnswer) {
                      // User selected the correct answer
                      buttonClass += "border-green-500 bg-green-50";
                      iconComponent = (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      );
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      // User selected the wrong answer
                      buttonClass += "border-red-500 bg-red-50";
                      iconComponent = (
                        <XCircle className="w-5 h-5 text-red-500" />
                      );
                    } else if (!isUserAnswer && isCorrectAnswer) {
                      // This is the correct answer that the user didn't select
                      buttonClass += "border-green-500 bg-green-50";
                      iconComponent = (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      );
                    } else {
                      // Regular unselected answer
                      buttonClass += "border-border hover:border-primary/30";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        disabled>
                        <div className="flex items-center gap-4 w-full">
                          <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-grow text-left">{choice}</span>
                          <div className="absolute right-4">
                            {iconComponent}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="border-t border-border/40 mt-6">
              <div className="flex justify-between items-center w-full pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex((i) => Math.max(0, i - 1))
                  }
                  disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {!isAnswered ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        You did not answer this question
                      </span>
                    </div>
                  ) : !isCorrect ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Your answer: {String.fromCharCode(65 + userAnswer)}
                      </span>
                    </div>
                  ) : null}

                  {(!isAnswered || !isCorrect) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Correct: {String.fromCharCode(65 + correctAnswer)}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() =>
                    setCurrentQuestionIndex((i) =>
                      Math.min(quiz.questions.length - 1, i + 1)
                    )
                  }
                  disabled={currentQuestionIndex === quiz.questions.length - 1}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
