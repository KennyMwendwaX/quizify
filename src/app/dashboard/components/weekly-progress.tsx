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
import { WeeklyProgress } from "@/lib/types";
import EmptyState from "./empty-state";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  weeklyProgress: WeeklyProgress;
};

export default function WeeklyProgressChart({ weeklyProgress }: Props) {
  const sortedProgress = [...weeklyProgress].sort(
    (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
  );

  const maxScore = Math.max(...sortedProgress.map((item) => item.score), 10);
  const maxXP = Math.max(...sortedProgress.map((item) => item.xp), 10);

  // Calculate padded maximums for more spacious charts
  const paddedMaxScore = Math.ceil((maxScore * 1.15) / 10) * 10; // 15% padding
  const paddedMaxXP = Math.ceil((maxXP * 1.15) / 100) * 100; // 15% padding

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
        {weeklyProgress.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={sortedProgress}
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
                  domain={[0, paddedMaxScore]} // Using padded max for more space
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
                  domain={[0, paddedMaxXP]} // Using padded max for more space
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
