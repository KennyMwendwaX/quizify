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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Mock quiz data
const mockQuiz = {
  title: "General Knowledge Quiz",
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
    // Add more questions as needed
  ],
  timeLimit: 5 * 60, // 5 minutes
};

export default function TakeQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const goToNextQuestion = () => {
    if (selectedAnswer === mockQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
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

  if (quizCompleted) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl mb-4">
              Your score: {score} / {mockQuiz.questions.length}
            </p>
            <p className="text-xl">
              Time taken: {formatTime(mockQuiz.timeLimit - timeLeft)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()}>
              Take Another Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const question = mockQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{mockQuiz.title}</CardTitle>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm font-medium">
              Question {currentQuestion + 1} of {mockQuiz.questions.length}
            </p>
            <p className="text-sm font-medium">
              Time left: {formatTime(timeLeft)}
            </p>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">{question.text}</h2>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) =>
              handleAnswerSelect(Number.parseInt(value))
            }>
            {question.choices.map((choice, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`answer-${index}`}
                />
                <Label htmlFor={`answer-${index}`} className="text-base">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button
            onClick={goToNextQuestion}
            disabled={selectedAnswer === null}
            className="w-full">
            {currentQuestion < mockQuiz.questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
