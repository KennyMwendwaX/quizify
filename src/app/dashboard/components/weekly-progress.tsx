"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Calendar } from "lucide-react";
import EmptyState from "./empty-state";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { WeeklyProgress } from "@/lib/types";

type Props = {
  weeklyProgress: WeeklyProgress[];
};

export default function WeeklyProgressChart({ weeklyProgress }: Props) {
  console.log(weeklyProgress);
  // Extract the progress array
  const progressData = weeklyProgress || [];

  // Get today's date
  // Get today's date without time components (to avoid timezone issues)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the start date (7 days ago)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6); // Go back 6 days to get 7 days total

  // Create an array of the last 7 days (with zero values as defaults)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const fullDateStr = `${year}-${month}-${day}`;

    return {
      day: dayName,
      fullDate: fullDateStr,
      quizzes: 0,
      score: 0,
      xp: 0,
    };
  });

  // Merge actual progress data with our placeholder data using exact string comparison
  const mergedProgress = last7Days.map((placeholder) => {
    // Find matching data from progressData or use placeholder
    const matchingData = progressData.find(
      (item) => item.fullDate === placeholder.fullDate
    );

    return matchingData || placeholder;
  });

  const maxScore = Math.max(...mergedProgress.map((item) => item.score), 10);
  const maxXP = Math.max(...mergedProgress.map((item) => item.xp), 10);

  // Calculate padded maximums for more spacious charts
  const paddedMaxScore = Math.ceil((maxScore * 1.15) / 10) * 10; // 15% padding
  const paddedMaxXP = Math.ceil((maxXP * 1.15) / 100) * 100; // 15% padding

  // Modify the hasActivity check to be more explicit
  const hasActivity = mergedProgress.some((day) => day.quizzes > 0);

  const chartConfig = {
    score: {
      label: "Score %",
      color: "hsl(215, 100%, 50%)",
    },
    xp: {
      label: "XP Gained",
      color: "hsl(140, 100%, 40%)",
    },
    quizzes: {
      label: "Quizzes Completed",
      color: "hsl(350, 100%, 60%)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Calendar className="mr-2 h-5 w-5" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasActivity ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={mergedProgress}
                margin={{
                  left: 12,
                  right: 24,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="score"
                  orientation="left"
                  stroke={chartConfig.score.color}
                  domain={[0, paddedMaxScore]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  yAxisId="xp"
                  orientation="right"
                  stroke={chartConfig.xp.color}
                  domain={[0, paddedMaxXP]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="score"
                  name="Score %"
                  dataKey="score"
                  type="monotone"
                  stroke={chartConfig.score.color}
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: chartConfig.score.color,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.score.color,
                    strokeWidth: 0,
                  }}
                />
                <Line
                  yAxisId="xp"
                  name="XP Gained"
                  dataKey="xp"
                  type="monotone"
                  stroke={chartConfig.xp.color}
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: chartConfig.xp.color,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.xp.color,
                    strokeWidth: 0,
                  }}
                />
                <Line
                  yAxisId="xp"
                  name="Quizzes Completed"
                  dataKey="quizzes"
                  type="monotone"
                  stroke={chartConfig.quizzes.color}
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: chartConfig.quizzes.color,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartConfig.quizzes.color,
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
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
