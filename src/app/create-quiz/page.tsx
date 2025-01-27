"use client";

import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Settings2,
  PencilLine,
  Clock,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Question {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number;
}

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [isTimeLimited, setIsTimeLimited] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Math.random(),
        text: "",
        choices: ["", "", ""],
        correctAnswer: -1,
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push("");
    setQuestions(updatedQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.splice(choiceIndex, 1);
    setQuestions(updatedQuestions);
  };

  const setCorrectAnswer = (questionIndex: number, choiceIndex: number) => {
    updateQuestion(questionIndex, "correctAnswer", choiceIndex);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, timeLimit, isTimeLimited, questions });
    alert("Quiz created successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <PencilLine className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-3">
            Create New Quiz
          </h1>
          <p className="text-muted-foreground text-lg">
            Design an engaging quiz experience for your audience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings2 className="w-6 h-6 text-primary" />
                <CardTitle>Quiz Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Quiz Title
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title for your quiz"
                    className="h-12 text-lg border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief description of your quiz"
                    className="min-h-[100px] text-base border-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="border-t border-border/30 pt-6">
                <Label className="text-base font-medium mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Settings
                </Label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="timed-quiz"
                      checked={isTimeLimited}
                      onCheckedChange={setIsTimeLimited}
                    />
                    <Label htmlFor="timed-quiz" className="text-sm">
                      Enable Time Limit
                    </Label>
                  </div>
                  {isTimeLimited && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="w-24 h-10"
                      />
                      <span className="text-sm text-muted-foreground">
                        minutes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Accordion type="multiple" className="space-y-4">
              {questions.map((question, qIndex) => (
                <AccordionItem
                  key={question.id}
                  value={`question-${qIndex}`}
                  className="border bg-white/50 backdrop-blur-xl rounded-xl shadow-sm overflow-hidden group">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground/40 group-hover:text-muted-foreground/60" />
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-medium">
                        {qIndex + 1}
                      </div>
                      <span className="text-lg font-medium">
                        {question.text || `Question ${qIndex + 1}`}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t">
                    <div className="p-6 space-y-6">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-destructive hover:text-destructive/90">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Question
                        </Button>
                      </div>

                      <Textarea
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(qIndex, "text", e.target.value)
                        }
                        placeholder="Type your question here..."
                        className="min-h-[100px] text-lg border-primary/20 focus:border-primary/40"
                      />

                      <div className="space-y-3">
                        <Label className="text-base font-medium">Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {question.choices.map((choice, cIndex) => (
                            <div
                              key={cIndex}
                              className={`relative p-4 rounded-xl border transition-all ${
                                question.correctAnswer === cIndex
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border/40 hover:border-primary/30"
                              }`}>
                              <Input
                                value={choice}
                                onChange={(e) => {
                                  const newChoices = [...question.choices];
                                  newChoices[cIndex] = e.target.value;
                                  updateQuestion(qIndex, "choices", newChoices);
                                }}
                                placeholder={`Option ${cIndex + 1}`}
                                className="border-0 p-0 h-9 text-base shadow-none focus-visible:ring-0 bg-transparent"
                              />
                              <div className="absolute top-3 right-3 flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeChoice(qIndex, cIndex)}
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setCorrectAnswer(qIndex, cIndex)
                                  }
                                  className={`h-7 w-7 ${
                                    question.correctAnswer === cIndex
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addChoice(qIndex)}
                          className="w-full mt-2">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="sticky bottom-6 pt-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {questions.length} questions created
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={addQuestion}
                      variant="outline"
                      className="h-11">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                    <Button
                      type="submit"
                      className="h-11 px-6 bg-primary hover:bg-primary/90">
                      Publish Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
