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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CategoryPerformance } from "@/lib/types";
import EmptyState from "./empty-state";

type Props = {
  categoryPerformance: CategoryPerformance;
};

export default function CategoryPerformanceChart({
  categoryPerformance,
}: Props) {
  // Calculate max scores and quizzes separately for better axis control
  const maxScore = Math.max(
    ...categoryPerformance.map((item) => item.score),
    10
  );
  const maxQuizzes = Math.max(
    ...categoryPerformance.map((item) => item.quizzes),
    1
  );

  // Add padding to max values for more spacious charts
  const paddedMaxScore = Math.ceil((maxScore * 1.15) / 10) * 10; // 15% padding, rounded to nearest 10
  const paddedMaxQuizzes = Math.ceil(maxQuizzes * 1.2); // 20% padding for quizzes

  // Sort categories by performance score (optional)
  const sortedData = [...categoryPerformance].sort((a, b) => b.score - a.score);

  const chartConfig = {
    score: {
      label: "Avg. Score %",
      color: "hsl(215, 100%, 50%)", // Using blue for scores
    },
    quizzes: {
      label: "Quizzes Taken",
      color: "hsl(280, 75%, 60%)", // Using purple for quizzes
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                accessibilityLayer
                data={sortedData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}>
                <CartesianGrid vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  yAxisId="score"
                  orientation="left"
                  stroke={chartConfig.score.color}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, paddedMaxScore]}
                  allowDecimals={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  yAxisId="quizzes"
                  orientation="right"
                  stroke={chartConfig.quizzes.color}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, paddedMaxQuizzes]}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />

                <Bar
                  dataKey="score"
                  yAxisId="score"
                  fill={chartConfig.score.color}
                  radius={[4, 4, 0, 0]}
                  name="Avg. Score %"
                  barSize={32}
                />
                <Bar
                  dataKey="quizzes"
                  yAxisId="quizzes"
                  fill={chartConfig.quizzes.color}
                  radius={[4, 4, 0, 0]}
                  name="Quizzes Taken"
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
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
