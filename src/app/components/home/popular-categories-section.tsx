"use client";

import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Clock,
  BarChart,
  BookOpen,
  Globe,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const categories = [
  { name: "Science", icon: <Lightbulb className="h-5 w-5" />, count: 1240 },
  { name: "History", icon: <Clock className="h-5 w-5" />, count: 980 },
  { name: "Mathematics", icon: <BarChart className="h-5 w-5" />, count: 750 },
  { name: "Literature", icon: <BookOpen className="h-5 w-5" />, count: 820 },
  { name: "Geography", icon: <Globe className="h-5 w-5" />, count: 690 },
  { name: "Sports", icon: <Trophy className="h-5 w-5" />, count: 1100 },
];

export default function PopularCategoriesSection() {
  return (
    <section id="popular-categories" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-primary/20 bg-primary/5 text-primary">
            Explore
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Popular Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover quizzes across a wide range of subjects
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Link href={`/categories/${category.name.toLowerCase()}`}>
                <div className="bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center h-full hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count} quizzes
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
