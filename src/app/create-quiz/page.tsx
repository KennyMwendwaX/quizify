"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { quizFormSchema, QuizFormValues } from "@/lib/quiz-form-schema";
import { useTransition } from "react";
import { toast } from "sonner";
import { createQuiz } from "@/server/actions";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function CreateQuizPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isTimeLimited: false,
      timeLimit: 30,
      questions: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      text: "",
      choices: ["", ""],
      correctAnswer: -1,
    });
  };

  const addChoice = (questionIndex: number) => {
    const currentValues = form.getValues(`questions.${questionIndex}`);
    update(questionIndex, {
      ...currentValues,
      choices: [...currentValues.choices, ""],
    });
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const currentValues = form.getValues(`questions.${questionIndex}`);
    const newChoices = currentValues.choices.filter(
      (_, index) => index !== choiceIndex
    );
    update(questionIndex, {
      ...currentValues,
      choices: newChoices,
      correctAnswer:
        currentValues.correctAnswer === choiceIndex
          ? -1
          : currentValues.correctAnswer,
    });
  };

  const setCorrectAnswer = (questionIndex: number, choiceIndex: number) => {
    const currentValues = form.getValues(`questions.${questionIndex}`);
    update(questionIndex, {
      ...currentValues,
      correctAnswer: choiceIndex,
    });
  };

  function onSubmit(data: QuizFormValues) {
    startTransition(async () => {
      const result = await createQuiz(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.quizId) {
        form.reset();
        toast.success("Quiz created successfully!");
        router.push(`/quiz/${result.quizId}`);
      }
    });
  }

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-lg bg-white/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings2 className="w-6 h-6 text-primary" />
                  <CardTitle>Quiz Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Quiz Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter an engaging title for your quiz"
                          className="h-12 text-lg border-primary/20 focus:border-primary/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Provide a brief description of your quiz"
                          className="min-h-[100px] text-base border-primary/20 focus:border-primary/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t border-border/30 pt-6">
                  <Label className="text-base font-medium mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Time Settings
                  </Label>
                  <div className="flex items-center gap-6">
                    <FormField
                      control={form.control}
                      name="isTimeLimited"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Timed Quiz</FormLabel>
                        </FormItem>
                      )}
                    />
                    {form.watch("isTimeLimited") && (
                      <FormField
                        control={form.control}
                        name="timeLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  {...field}
                                  className="w-24 h-10"
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  value={field.value || ""}
                                />
                                <span className="text-sm text-muted-foreground">
                                  minutes
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Accordion type="multiple" className="space-y-4">
                {fields.map((question, qIndex) => (
                  <AccordionItem
                    key={question.id}
                    value={`question-${qIndex}`}
                    className="border bg-white/50 backdrop-blur-xl rounded-xl shadow-sm overflow-hidden group">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <GripVertical className="w-5 h-5 text-muted-foreground/40 group-hover:text-muted-foreground/60" />
                          <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-medium">
                            {qIndex + 1}
                          </div>
                          <span className="text-lg font-medium">
                            {question.text || `Question ${qIndex + 1}`}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(qIndex)}
                          className="text-destructive hover:text-destructive/90">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Question
                        </Button>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t">
                      <div className="p-6 space-y-6">
                        <FormField
                          control={form.control}
                          name={`questions.${qIndex}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Type your question here..."
                                  className="min-h-[100px] text-lg border-primary/20 focus:border-primary/40"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <Label className="text-base font-medium">
                            Options
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.choices.map((choice, cIndex) => (
                              <div
                                key={cIndex}
                                className={`relative p-4 rounded-xl border transition-all ${
                                  question.correctAnswer === cIndex
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border/40 hover:border-primary/30"
                                }`}>
                                <FormField
                                  control={form.control}
                                  name={`questions.${qIndex}.choices.${cIndex}`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder={`Option ${cIndex + 1}`}
                                          className="border-0 p-0 h-9 text-base shadow-none focus-visible:ring-0 bg-transparent"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeChoice(qIndex, cIndex)}
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
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
              <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    {form.formState.isSubmitted && fields.length === 0 ? (
                      <div className="text-sm font-medium text-destructive">
                        At least one question is required
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {fields.length} questions created
                      </div>
                    )}
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
                        className="h-11 px-6 bg-primary hover:bg-primary/90"
                        disabled={isPending}>
                        {isPending ? (
                          <>
                            <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          "Publish Quiz"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
