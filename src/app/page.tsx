"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Trophy,
  PenTool,
  Users,
  ArrowRight,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-8 w-8 mb-3" />,
    title: "Take a Quiz",
    description: "Challenge yourself with our diverse range of quizzes.",
    link: "/take-quiz",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <PenTool className="h-8 w-8 mb-3" />,
    title: "Create a Quiz",
    description: "Design your own quiz and share it with others.",
    link: "/create-quiz",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: <Trophy className="h-8 w-8 mb-3" />,
    title: "Leaderboard",
    description: "See how you rank against other quiz takers.",
    link: "/leaderboard",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: <Users className="h-8 w-8 mb-3" />,
    title: "Community",
    description: "Join our community of quiz enthusiasts.",
    link: "/community",
    color: "from-emerald-500 to-teal-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-light opacity-75 blur-xl"
            />
            <h1 className="relative text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
              Quizify
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Challenge your mind, create quizzes, and compete in our interactive
            learning platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}>
              <Card className="h-full bg-white/5 backdrop-blur-xl border-transparent hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${feature.color} p-4 shadow-lg`}
                    animate={{
                      rotate: hoveredIndex === index ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.4 }}>
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center text-lg">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                  <Button
                    asChild
                    variant="ghost"
                    className="group hover:bg-white/10"
                    size="lg">
                    <Link href={feature.link} className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to challenge your mind?
          </h2>
          <Button
            asChild
            size="lg"
            className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300">
            <Link href="/take-quiz" className="flex items-center">
              <Brain className="mr-2 h-6 w-6" />
              Start Quizzing Now
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
