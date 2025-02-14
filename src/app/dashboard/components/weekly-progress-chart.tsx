"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Calendar } from "lucide-react";
import { WeeklyProgress } from "@/lib/types";
import EmptyState from "./empty-state";

type Props = {
  weeklyProgress: WeeklyProgress;
};

export default function WeeklyProgressChart({ weeklyProgress }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weeklyProgress.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  name="Score %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="xp"
                  stroke="#10b981"
                  name="XP Gained"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            message="Complete some quizzes to see your weekly progress!"
          />
        )}
      </CardContent>
    </Card>
  );
}
