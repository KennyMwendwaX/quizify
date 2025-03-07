"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  ArrowRight,
  ArrowUpDown,
  Users,
  Plus,
  Settings,
  MoreVertical,
  BookOpen,
  Trophy,
  Filter,
  Sparkles,
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PublicQuiz, QuizDifficulty } from "@/database/schema";
import { motion } from "motion/react";

const difficultyIcons = {
  EASY: "🌱",
  MEDIUM: "🌟",
  HARD: "⚡",
  DEFAULT: "✨",
};

const getDifficultyConfig = (
  difficulty: QuizDifficulty
): { color: string; icon: string; bgColor: string } => {
  const normalizedDifficulty =
    difficulty.toUpperCase() as keyof typeof difficultyIcons;

  switch (normalizedDifficulty) {
    case "EASY":
      return {
        color: "text-emerald-700 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/40",
        icon: difficultyIcons.EASY,
      };
    case "MEDIUM":
      return {
        color: "text-amber-700 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/40",
        icon: difficultyIcons.MEDIUM,
      };
    case "HARD":
      return {
        color: "text-rose-700 dark:text-rose-400",
        bgColor: "bg-rose-100 dark:bg-rose-900/40",
        icon: difficultyIcons.HARD,
      };
    default:
      return {
        color: "text-slate-700 dark:text-slate-400",
        bgColor: "bg-slate-100 dark:bg-slate-900/40",
        icon: difficultyIcons.DEFAULT,
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

  const handleDifficultyChange = useCallback(
    (newDifficulty: string) => {
      setDifficultyFilter(newDifficulty);
      updateUrlParams(searchTerm, newDifficulty, sortBy);
    },
    [setDifficultyFilter, updateUrlParams, searchTerm, sortBy]
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      setSortBy(newSort);
      updateUrlParams(searchTerm, difficultyFilter, newSort);
    },
    [setSortBy, updateUrlParams, searchTerm, difficultyFilter]
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
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    My Quizzes
                  </h1>
                  <Badge
                    variant="outline"
                    className="ml-2 px-2 py-0 h-6 text-xs">
                    {quizzes.length} total
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAndSortedQuizzes.length} of {quizzes.length} quizzes{" "}
                  {searchTerm || difficultyFilter !== "all"
                    ? "matching filters"
                    : ""}
                </p>
              </div>
              <Button className="h-9 px-3 shadow-sm" asChild>
                <Link
                  href="/quizzes/create"
                  className="flex items-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create Quiz
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-background/80 shadow-sm border rounded-lg p-3">
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search your quizzes..."
                    className="pl-9 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      updateUrlParams(e.target.value, difficultyFilter, sortBy);
                    }}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-sm">
                      <Filter className="mr-1.5 h-3.5 w-3.5" />
                      {difficultyFilter === "all" ? "All" : difficultyFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => handleDifficultyChange("all")}>
                      {difficultyIcons.DEFAULT} All Levels
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDifficultyChange("EASY")}>
                      {difficultyIcons.EASY} Easy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDifficultyChange("MEDIUM")}>
                      {difficultyIcons.MEDIUM} Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDifficultyChange("HARD")}>
                      {difficultyIcons.HARD} Hard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-sm">
                      <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => handleSortChange("date_desc")}>
                      Newest first
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("date_asc")}>
                      Oldest first
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleSortChange("name_asc")}>
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("name_desc")}>
                      Name (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedQuizzes.map((quiz, index) => {
              const diffConfig = getDifficultyConfig(quiz.difficulty);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  key={quiz.id}>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <span className="text-sm">Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <span className="text-sm">Archive</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <span className="text-sm">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                              {quiz.timeLimit} mins
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Time limit
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                          <BookOpen className="h-4 w-4 text-primary/70" />
                          <div>
                            <p className="text-sm font-medium">
                              {quiz.questions.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Questions
                            </p>
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

                    <CardFooter className="pt-0 gap-2 grid grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 text-sm"
                        asChild>
                        <Link href={`/my-quizzes/${quiz.id}/edit`}>
                          <Settings className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        className="w-full h-9 text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant={
                          hoveredCard === quiz.id.toString()
                            ? "default"
                            : "secondary"
                        }
                        asChild>
                        <Link
                          href={`/my-quizzes/${quiz.id}`}
                          className="flex items-center justify-center">
                          Preview
                          <ArrowRight
                            className={`ml-1.5 h-3.5 w-3.5 transition-all duration-300 ${
                              hoveredCard === quiz.id.toString()
                                ? "translate-x-1"
                                : ""
                            }`}
                          />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredAndSortedQuizzes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="p-8 border border-dashed bg-background/50">
                <div className="text-center space-y-4">
                  {searchTerm || difficultyFilter !== "all" ? (
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                  ) : (
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-primary/60" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {searchTerm || difficultyFilter !== "all"
                        ? "No matches found"
                        : "Create your first quiz"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm">
                      {searchTerm || difficultyFilter !== "all"
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Get started by creating your first quiz. It's easy to set up and share with others."}
                    </p>

                    {!searchTerm && difficultyFilter === "all" ? (
                      <Button size="lg" className="mt-6" asChild>
                        <Link
                          href="/quizzes/create"
                          className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create New Quiz
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-6"
                        onClick={() => {
                          setSearchTerm("");
                          setDifficultyFilter("all");
                          updateUrlParams("", "all", sortBy);
                        }}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
