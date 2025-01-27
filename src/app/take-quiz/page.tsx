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
  Timer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  timeLimit: 5 * 60,
};

export default function TakeQuizPage() {
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

  if (quizCompleted) {
    const percentage = (score / mockQuiz.questions.length) * 100;
    const timeSpent = mockQuiz.timeLimit - timeLeft;

    return (
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        <Card className="border-0 shadow-xl bg-gradient-to-b from-background to-background/95">
          <CardHeader className="text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/15">
                <Trophy className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold mb-2">
                Quiz Completed!
              </CardTitle>
              <p className="text-muted-foreground">
                Great job on finishing the quiz
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="bg-muted/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Performance Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Correct Answers: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span>
                    Incorrect Answers: {mockQuiz.questions.length - score}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button
              onClick={() => window.location.reload()}
              className="px-8 h-12 rounded-full bg-primary hover:bg-primary/90"
              size="lg">
              <Rocket className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const question = mockQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto py-10 px-4 max-w-2xl">
        {showTimeWarning && timeLeft <= 30 && (
          <Alert variant="destructive" className="mb-6">
            <Timer className="h-4 w-4" />
            <AlertDescription>
              Less than {timeLeft} seconds remaining!
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  {mockQuiz.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Question {currentQuestion + 1} of {mockQuiz.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2.5 bg-muted" />
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold leading-relaxed">
                {question.text}
              </h2>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) =>
                  handleAnswerSelect(Number.parseInt(value))
                }
                className="grid gap-3">
                {question.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 rounded-xl p-4 border transition-all cursor-pointer hover:border-primary/30 ${
                      selectedAnswer === index
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-muted/50"
                    }`}>
                    <RadioGroupItem
                      value={index.toString()}
                      id={`answer-${index}`}
                      className="peer hidden"
                    />
                    <Label
                      htmlFor={`answer-${index}`}
                      className="w-full flex items-center space-x-4 cursor-pointer">
                      <div
                        className={`flex items-center justify-center h-8 w-8 rounded-full border text-sm font-medium transition-colors ${
                          selectedAnswer === index
                            ? "border-primary text-primary bg-primary/5"
                            : "border-muted/50 bg-background"
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base flex-1">{choice}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="border-t pt-6">
            <div className="flex w-full gap-4">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex-1 h-12">
                ← Previous
              </Button>
              <Button
                onClick={goToNextQuestion}
                disabled={selectedAnswer === null}
                className="flex-1 h-12 bg-primary hover:bg-primary/90">
                {currentQuestion < mockQuiz.questions.length - 1 ? (
                  <>Next →</>
                ) : (
                  "Finish Quiz"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
