"use client";

import { RecentQuiz } from "@/lib/types";

export default function QuizCard({ quiz }: { quiz: RecentQuiz }) {
  function formatSecondsToMinutes(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes}min ${remainingSeconds.toString().padStart(2, "0")}sec`;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
      <div>
        <h3 className="font-medium text-sm">{quiz.title}</h3>
        <p className="text-xs text-muted-foreground">
          {quiz.category} • {quiz.dateTaken} • {quiz.difficulty}
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold">{quiz.percentage}%</div>
        <div className="text-xs text-muted-foreground">
          {formatSecondsToMinutes(quiz.timeTaken)}
        </div>
      </div>
    </div>
  );
}
