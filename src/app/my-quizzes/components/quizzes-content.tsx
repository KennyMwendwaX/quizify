"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  ArrowRight,
  ChevronDown,
  CalendarDays,
  ArrowUpDown,
  Users,
  Plus,
  Settings,
  MoreVertical,
  BookOpen,
  Target,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PublicQuiz, QuizDifficulty } from "@/database/schema";
import { motion } from "motion/react";

const getDifficultyConfig = (
  difficulty: QuizDifficulty
): { color: string; icon: string; bgColor: string } => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return {
        color: "text-emerald-700 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900",
        icon: "🌱",
      };
    case "medium":
      return {
        color: "text-amber-700 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900",
        icon: "🌟",
      };
    case "hard":
      return {
        color: "text-rose-700 dark:text-rose-400",
        bgColor: "bg-rose-100 dark:bg-rose-900",
        icon: "⚡",
      };
    default:
      return {
        color: "text-slate-700 dark:text-slate-400",
        bgColor: "bg-slate-100 dark:bg-slate-900",
        icon: "✨",
      };
  }
};

export default function MyQuizzesContent({
  quizzes,
}: {
  quizzes: PublicQuiz[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const updateUrlParams = useCallback(
    (newSearch: string, newDifficulty: string, newSort: string) => {
      const params = new URLSearchParams(searchParams);
      if (newSearch !== undefined) params.set("search", newSearch);
      if (newDifficulty !== undefined) params.set("difficulty", newDifficulty);
      if (newSort !== undefined) params.set("sort", newSort);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const filteredAndSortedQuizzes = useMemo(() => {
    return quizzes
      .filter((quiz) => {
        const matchesSearch = quiz.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDifficulty =
          difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date_desc":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "date_asc":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "name_asc":
            return a.title.localeCompare(b.title);
          case "name_desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [quizzes, searchTerm, difficultyFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                My Quizzes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and organize your quiz collection
              </p>
            </div>
            <Button className="h-10" asChild>
              <Link href="/quizzes/create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background shadow-lg border rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search your quizzes..."
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateUrlParams(e.target.value, difficultyFilter, sortBy);
                  }}
                />
              </div>

              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 px-4">
                      <Target className="mr-2 h-4 w-4" />
                      {difficultyFilter === "all"
                        ? "All Levels"
                        : difficultyFilter}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by difficulty</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => setDifficultyFilter("all")}>
                        ✨ All Levels
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDifficultyFilter("EASY")}>
                        🌱 Easy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDifficultyFilter("MEDIUM")}>
                        🌟 Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDifficultyFilter("HARD")}>
                        ⚡ Hard
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 px-4">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Sort quizzes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setSortBy("date_desc")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Newest first
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("date_asc")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Oldest first
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Name (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Name (Z-A)
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedQuizzes.map((quiz) => {
              const diffConfig = getDifficultyConfig(quiz.difficulty);
              return (
                <Card
                  key={quiz.id}
                  className="group relative overflow-hidden border border-border/50 dark:border-border/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 h-full flex flex-col transition-all duration-300 hover:shadow-lg"
                  onMouseEnter={() => setHoveredCard(quiz.id.toString())}
                  onMouseLeave={() => setHoveredCard(null)}>
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="secondary"
                        className={`${diffConfig.color} ${diffConfig.bgColor} px-2 py-0.5`}>
                        {diffConfig.icon} {quiz.difficulty}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-2xl leading-tight">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-grow">
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{quiz.timeLimit} mins</p>
                          <p className="text-xs text-muted-foreground">
                            Time limit
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{quiz.questions.length}</p>
                          <p className="text-xs text-muted-foreground">
                            Questions
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>150 attempts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>85% avg. score</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full h-11" asChild>
                      <Link href={`/my-quizzes/${quiz.id}/edit`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      className="w-full h-11"
                      variant={
                        hoveredCard === quiz.id.toString()
                          ? "default"
                          : "secondary"
                      }
                      asChild>
                      <Link href={`/my-quizzes/${quiz.id}`}>
                        Preview
                        <ArrowRight
                          className={`ml-2 h-4 w-4 transition-all duration-300 ${
                            hoveredCard === quiz.id.toString()
                              ? "translate-x-1"
                              : ""
                          }`}
                        />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </motion.div>

          {filteredAndSortedQuizzes.length === 0 && (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground/40" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No quizzes found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchTerm || difficultyFilter !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "Create your first quiz to get started."}
                  </p>
                  {!searchTerm && difficultyFilter === "all" && (
                    <Button size="lg" className="mt-4" asChild>
                      <Link
                        href="/quizzes/create"
                        className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Create New Quiz
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
