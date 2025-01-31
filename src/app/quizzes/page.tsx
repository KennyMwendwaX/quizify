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

const categories = [
  { id: "all", name: "All Quizzes", icon: Hash },
  { id: "history", name: "History", icon: BookOpen },
  { id: "geography", name: "Geography", icon: Globe2 },
  { id: "general", name: "General Knowledge", icon: Lightbulb },
  { id: "science", name: "Science", icon: Atom },
];

const quizzes = [
  {
    id: 1,
    title: "World History Masterclass",
    description: "Journey through pivotal moments that shaped our world",
    questionCount: 20,
    timeLimit: 30,
    participants: 1500,
    difficulty: "Medium",
    category: "history",
  },
  {
    id: 2,
    title: "Earth's Geography",
    description: "Explore continents, oceans, and natural wonders",
    questionCount: 15,
    timeLimit: 25,
    participants: 1200,
    difficulty: "Hard",
    category: "geography",
  },
  {
    id: 3,
    title: "Ancient Civilizations",
    description: "Discover the mysteries of ancient cultures",
    questionCount: 18,
    timeLimit: 28,
    participants: 980,
    difficulty: "Easy",
    category: "history",
  },
  {
    id: 4,
    title: "General Knowledge Challenge",
    description: "Test your knowledge across various topics",
    questionCount: 25,
    timeLimit: 35,
    participants: 2200,
    difficulty: "Medium",
    category: "general",
  },
  {
    id: 5,
    title: "Physics & Universe",
    description: "Unravel the mysteries of the cosmos",
    questionCount: 22,
    timeLimit: 32,
    participants: 1800,
    difficulty: "Hard",
    category: "science",
  },
  {
    id: 6,
    title: "World Capitals",
    description: "Test your knowledge of global capitals",
    questionCount: 20,
    timeLimit: 30,
    participants: 1650,
    difficulty: "Easy",
    category: "geography",
  },
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

export default function QuizzesPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Discover Quizzes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with our curated collection of engaging quizzes
          </p>
        </motion.div>

        <div className="mb-12 space-y-8">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search quizzes..."
                className="pl-12 pr-4 h-14 text-lg rounded-2xl border-primary/20 focus:border-primary/40 transition-all shadow-lg focus:shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  className={`h-11 px-6 rounded-xl transition-all ${
                    activeCategory === category.id
                      ? "shadow-lg"
                      : "hover:shadow-md"
                  }`}>
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

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
              <Card className="group h-full flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="relative pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {quiz.questionCount} questions
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
                      {quiz.participants.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-6">
                  <Button
                    asChild
                    className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl">
                    <Link
                      href={`/take-quiz/${quiz.id}`}
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
