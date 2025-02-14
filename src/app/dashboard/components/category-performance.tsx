"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryPerformance.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="score"
                  fill="#3b82f6"
                  name="Avg. Score %"
                />
                <Bar
                  yAxisId="right"
                  dataKey="quizzes"
                  fill="#10b981"
                  name="Quizzes Taken"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
