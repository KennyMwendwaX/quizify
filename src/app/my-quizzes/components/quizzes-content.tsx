"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Search,
  Clock,
  Users,
  ArrowRight,
  BookOpen,
  Globe2,
  Lightbulb,
  Atom,
  Hash,
  Plus,
  Settings,
  MoreVertical,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicQuiz } from "@/database/schema";

const categories = [
  { id: "all", name: "All Quizzes", icon: Hash },
  { id: "history", name: "History", icon: BookOpen },
  { id: "geography", name: "Geography", icon: Globe2 },
  { id: "general", name: "General Knowledge", icon: Lightbulb },
  { id: "science", name: "Science", icon: Atom },
];

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

type Props = {
  quizzes: PublicQuiz[];
};

export default function QuizzesContentPage({ quizzes }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || quiz.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-6">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto mb-8 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                My Quizzes
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and manage your collection of quizzes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}>
              <Button size="lg" className="h-12 px-6 rounded-xl">
                <Link
                  href="/quizzes/create"
                  className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Quiz
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search your quizzes..."
                className="pl-10 pr-4 h-12 text-sm rounded-xl border-border/50 focus:border-primary/40 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={
                      activeCategory === category.id ? "secondary" : "ghost"
                    }
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category.id ? "all" : category.id
                      )
                    }
                    className="h-12 px-4 whitespace-nowrap">
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="group h-full flex flex-col bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="relative pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {quiz.questions.length} questions
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {quiz.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <p className="text-muted-foreground mb-6">
                    {quiz.description}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4" />
                      {quiz.timeLimit} mins
                    </div>
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4" />
                      150 attempts
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-6">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl"
                      onClick={() =>
                        (window.location.href = `/quizzes/${quiz.id}/edit`)
                      }>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button className="flex-1 h-12 rounded-xl" asChild>
                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="flex items-center justify-center gap-2">
                        Preview
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16 p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="mb-4">
              <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No quizzes found</p>
              <p className="text-muted-foreground mb-6">
                {searchTerm || activeCategory !== "all"
                  ? "Try a different search term or category"
                  : "Create your first quiz to get started"}
              </p>
              {!searchTerm && activeCategory === "all" && (
                <Button size="lg" className="h-12 px-6 rounded-xl">
                  <Link
                    href="/quizzes/create"
                    className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Quiz
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
