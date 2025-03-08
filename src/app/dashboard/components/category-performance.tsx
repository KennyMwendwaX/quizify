"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { CategoryPerformance } from "@/lib/types";
import EmptyState from "./empty-state";

type Props = {
  categoryPerformance: CategoryPerformance;
};

export default function CategoryPerformanceChart({
  categoryPerformance,
}: Props) {
  const yAxisMax = Math.max(
    ...categoryPerformance.map((item) => Math.max(item.score, item.quizzes))
  );
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
    quizzes: {
      label: "Quizzes",
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <BarChart3 className="mr-2 h-5 w-5" />
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryPerformance.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={categoryPerformance}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, yAxisMax]}
                allowDecimals={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="score"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Avg. Score %"
              />
              <Bar
                dataKey="quizzes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Quizzes Taken"
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart3}
            message="Take quizzes in different categories to see your performance!"
          />
        )}
      </CardContent>
    </Card>
  );
}
