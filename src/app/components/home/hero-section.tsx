"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart,
  BookOpen,
  ChevronRight,
  Clock,
  PlusCircle,
  Target,
  Flame,
  Zap,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [currentTab, setCurrentTab] = useState("Overview");

  const tabs = ["Overview", "Progress", "Achievements"];

  const recentQuizzes = [
    {
      title: "African capital cities quiz",
      category: "Geography",
      date: "Mar 26, 2025",
      difficulty: "BEGINNER",
      score: "100%",
      time: "0min 48sec",
    },
    {
      title: "Ultimate Physics Quiz: Test Your Knowledge!",
      category: "Physics",
      date: "Mar 23, 2025",
      difficulty: "INTERMEDIATE",
      score: "73%",
      time: "4min 34sec",
    },
    {
      title: "The Ultimate World War I & II Quiz",
      category: "World Wars",
      date: "Mar 21, 2025",
      difficulty: "ADVANCED",
      score: "73%",
      time: "1min 43sec",
    },
  ];

  const quickActions = [
    { icon: Clock, text: "Start a Quiz" },
    { icon: PlusCircle, text: "Create New Quiz" },
    { icon: BookOpen, text: "My Quizzes" },
    { icon: Target, text: "Set Goals" },
  ];

  return (
    <section
      id="#hero"
      ref={heroRef}
      className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-600 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
            </span>
            <span>The ultimate quiz platform for curious minds</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
            Challenge Your Mind with Quizify
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create, compete, and learn with our interactive quiz platform. Join
            thousands of users expanding their knowledge every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all duration-300 rounded-full shadow-lg w-full sm:w-auto group"
              onClick={() => router.push("/dashboard")}>
              Get Started
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  repeatType: "loop",
                }}>
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-primary/20 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto"
              onClick={() => router.push("/learn-more")}>
              Learn More
            </Button>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mt-8 mx-auto max-w-4xl">
            {/* Browser window */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
              {/* Browser header */}
              <div className="h-10 bg-primary-foreground flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                    quizify.app/dashboard
                  </div>
                </div>
              </div>

              {/* App header */}
              <div className="bg-primary-foreground text-primary p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">Quizify</span>
                  </div>
                  <div className="flex items-center space-x-8">
                    <span className="font-medium">Dashboard</span>
                    <span className="text-gray-400">My Quizzes</span>
                    <span className="text-gray-400">Explore</span>
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
                      N
                    </div>
                  </div>
                </div>

                {/* Welcome message */}
                <div className="mt-12 text-center">
                  <h1 className="text-3xl font-bold">Welcome, Don Demarco</h1>
                  <p className="text-gray-400 mt-2">
                    Ready to test your knowledge and grow your skills?
                  </p>
                </div>
              </div>

              {/* Main content */}
              <div className="bg-primary-foreground p-6">
                {/* Tabs */}
                <div className="flex space-x-6 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentTab === tab
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      onClick={() => setCurrentTab(tab)}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {/* Quizzes Taken */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quizzes Taken
                      </h3>
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Total quizzes completed
                    </p>
                  </div>

                  {/* Average Score */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Average Score
                      </h3>
                      <BarChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold">88%</p>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: "88%" }}></div>
                    </div>
                  </div>

                  {/* Current Streak */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Streak
                      </h3>
                      <Flame className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold">4</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Consecutive days of activity
                    </p>
                  </div>

                  {/* Total XP */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total XP
                      </h3>
                      <Zap className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold">1,273</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Experience Points
                    </p>
                  </div>
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recent Quizzes - Takes up 2/3 of space */}
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Recent Quizzes
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {recentQuizzes.map((quiz, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div>
                            <h3 className="font-medium text-sm">
                              {quiz.title}
                            </h3>
                            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{quiz.category}</span>
                              <span className="mx-1">•</span>
                              <span>{quiz.date}</span>
                              <span className="mx-1">•</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">
                                {quiz.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">
                              {quiz.score}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {quiz.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions - Takes up 1/3 of space */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Quick Actions
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <div className="flex items-center space-x-3">
                            <action.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            <span className="font-medium text-sm">
                              {action.text}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
