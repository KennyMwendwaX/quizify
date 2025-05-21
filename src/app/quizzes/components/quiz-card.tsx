"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Users,
  BookOpen,
  Trophy,
  Bookmark,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PublicQuiz } from "@/database/schema";
import { formatSecondsToMinutes } from "@/lib/format-time";
import { toast } from "sonner";
import { tryCatch } from "@/lib/try-catch";
import { toggleQuizBookmark } from "@/server/user/quiz-bookmarks";

type QuizCardProps = {
  quiz: PublicQuiz;
  diffConfig: {
    color: string;
    icon: string;
    bgColor: string;
  };
};

export default function QuizCard({ quiz, diffConfig }: QuizCardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(quiz.isBookmarked);
  const [isPending, startTransition] = useTransition();

  const toggleBookmark = () => {
    // Optimistic update
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleQuizBookmark(quiz.id)
      );

      if (error) {
        // Revert optimistic update
        setIsBookmarked(isBookmarked);
        toast.error("Failed to toggle bookmark");
        return;
      }

      // Sync with server state (in case of conflicts)
      setIsBookmarked(result.isBookmarked);
      toast.success(
        result.isBookmarked ? "Quiz bookmarked" : "Bookmark removed"
      );
    });
  };

  return (
    <Card
      className="group h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden"
      onMouseEnter={() => setHoveredCard(quiz.id.toString())}
      onMouseLeave={() => setHoveredCard(null)}>
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start">
          <Badge
            variant="secondary"
            className={`${diffConfig.color} ${diffConfig.bgColor} px-2 py-0.5 text-xs font-medium`}>
            {diffConfig.icon} {quiz.difficulty}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{quiz.category}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-muted rounded-full"
              onClick={toggleBookmark}
              title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              disabled={isPending}>
              <Bookmark
                className={`h-4 w-4 ${
                  isBookmarked
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span className="sr-only">
                {isBookmarked ? "Remove bookmark" : "Add bookmark"}
              </span>
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2 font-bold">
          {quiz.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {quiz.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3 pt-0 space-y-4 flex-grow">
        <Separator className="opacity-50" />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
            <Clock className="h-4 w-4 text-primary/70" />
            <div>
              <p className="text-sm font-medium">
                {formatSecondsToMinutes(quiz.timeLimit ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">Time limit</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
            <BookOpen className="h-4 w-4 text-primary/70" />
            <div>
              <p className="text-sm font-medium">{quiz.questions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>150 attempts</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>85% avg. score</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full h-9 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant={hoveredCard === quiz.id.toString() ? "default" : "secondary"}
          asChild>
          <Link
            href={`/quizzes/${quiz.id}`}
            className="flex items-center justify-center">
            Start Quiz
            <ArrowRight
              className={`ml-1.5 h-3.5 w-3.5 transition-all duration-300 ${
                hoveredCard === quiz.id.toString() ? "translate-x-1" : ""
              }`}
            />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
