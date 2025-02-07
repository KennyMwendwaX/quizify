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

export default function QuizzesContent({ quizzes }: Props) {
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

  console.log(quizzes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-6">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto mb-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Explore Quizzes
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Find your next challenge from our curated quiz collection
            </p>
          </motion.div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search quizzes..."
              className="pl-10 pr-4 h-10 text-sm rounded-xl border-border/50 focus:border-primary/40 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
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
                  className="h-8 px-3">
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quiz Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="group h-full flex flex-col bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="relative pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {quiz.questions.length} questions
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {quiz.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <p className="text-muted-foreground mb-6">
                    {quiz.description}
                  </p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4" />
                      {quiz.timeLimit} mins
                    </div>
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4" />
                      150
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-6">
                  <Button
                    asChild
                    className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl">
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="flex items-center justify-center gap-2">
                      Start Quiz
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results State */}
        {filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16 p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg">
            <p className="text-xl text-muted-foreground">
              No quizzes found. Try a different search term or category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
