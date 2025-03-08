"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
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
} from "recharts";

type Props = {
  weeklyProgress: WeeklyProgress;
};

export default function WeeklyProgressChart({ weeklyProgress }: Props) {
  const sortedProgress = [...weeklyProgress].sort(
    (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
  );

  const chartConfig = {
    score: {
      label: "Score %",
      color: "hsl(var(--chart-1))",
    },
    xp: {
      label: "XP Gained",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

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
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={sortedProgress}
                margin={{
                  left: 12,
                  right: 12,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  name="Score %"
                  dataKey="score"
                  type="monotone"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                  }}
                />
                <Line
                  name="XP Gained"
                  dataKey="xp"
                  type="monotone"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 5,
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
