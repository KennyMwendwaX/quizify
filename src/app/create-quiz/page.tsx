"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number;
}

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Math.random(),
        text: "",
        choices: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateChoice = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the quiz data to your backend
    console.log({ title, timeLimit, questions });
    alert("Quiz created successfully!");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Create a New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) =>
                    setTimeLimit(Number.parseInt(e.target.value))
                  }
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {questions.map((question, qIndex) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Question {qIndex + 1}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeQuestion(qIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={question.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                placeholder="Enter your question"
                required
              />
              {question.choices.map((choice, cIndex) => (
                <div key={cIndex} className="flex items-center space-x-2">
                  <Input
                    value={choice}
                    onChange={(e) =>
                      updateChoice(qIndex, cIndex, e.target.value)
                    }
                    placeholder={`Choice ${cIndex + 1}`}
                    required
                  />
                  <Select
                    value={
                      question.correctAnswer === cIndex
                        ? "correct"
                        : "incorrect"
                    } // Updated line
                    onValueChange={() =>
                      updateQuestion(qIndex, "correctAnswer", cIndex)
                    }>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Correct?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="correct">Correct</SelectItem>
                      <SelectItem value="incorrect">Incorrect</SelectItem>{" "}
                      {/* Updated line */}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button type="button" onClick={addQuestion} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>

        <Button type="submit" className="w-full">
          Create Quiz
        </Button>
      </form>
    </div>
  );
}
