"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Clock, Target, Search, Medal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock leaderboard data
const leaderboardData = [
  {
    rank: 1,
    name: "Alice Johnson",
    score: 95,
    timeTaken: "4:32",
    avatar: "/avatars/alice.jpg",
    quizzesTaken: 12,
    accuracy: "95%",
  },
  {
    rank: 2,
    name: "Bob Smith",
    score: 92,
    timeTaken: "4:45",
    avatar: "/avatars/bob.jpg",
    quizzesTaken: 10,
    accuracy: "92%",
  },
  {
    rank: 3,
    name: "Charlie Brown",
    score: 88,
    timeTaken: "5:01",
    avatar: "/avatars/charlie.jpg",
    quizzesTaken: 8,
    accuracy: "88%",
  },
  {
    rank: 4,
    name: "Diana Ross",
    score: 85,
    timeTaken: "5:15",
    avatar: "/avatars/diana.jpg",
    quizzesTaken: 15,
    accuracy: "85%",
  },
  {
    rank: 5,
    name: "Ethan Hunt",
    score: 82,
    timeTaken: "5:30",
    avatar: "/avatars/ethan.jpg",
    quizzesTaken: 9,
    accuracy: "82%",
  },
];

const LeaderboardTable = ({ data }: { data: typeof leaderboardData }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow key={entry.rank} className="group">
            <TableCell>
              {entry.rank === 1 && (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700">
                  🥇
                </div>
              )}
              {entry.rank === 2 && (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700">
                  🥈
                </div>
              )}
              {entry.rank === 3 && (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700">
                  🥉
                </div>
              )}
              {entry.rank > 3 && (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                  {entry.rank}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-muted transition-all group-hover:border-primary/20">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback className="font-medium">
                    {entry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{entry.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.quizzesTaken} quizzes taken
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-semibold">
                  {entry.score}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {entry.timeTaken}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{entry.accuracy}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = leaderboardData.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topPerformers = leaderboardData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-3">
            Quiz Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Top performers and their achievements
          </p>
        </div>

        {/* Top 3 Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {topPerformers.map((performer, index) => (
            <Card
              key={performer.rank}
              className="relative overflow-hidden border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <div className="absolute top-2 right-2">
                <Medal
                  className={`w-6 h-6 ${
                    index === 0
                      ? "text-yellow-500"
                      : index === 1
                      ? "text-gray-400"
                      : "text-orange-500"
                  }`}
                />
              </div>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-16 h-16 border-4 border-primary/10 mx-auto mb-4">
                    <AvatarImage src={performer.avatar} alt={performer.name} />
                    <AvatarFallback className="text-xl font-semibold">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">
                    {performer.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {performer.quizzesTaken} quizzes completed
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-primary">
                        {performer.score}
                      </div>
                      <div className="text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-primary">
                        {performer.accuracy}
                      </div>
                      <div className="text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>All Participants</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search participants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <LeaderboardTable data={filteredData} />
              </TabsContent>
              <TabsContent value="monthly">
                <LeaderboardTable data={filteredData} />
              </TabsContent>
              <TabsContent value="weekly">
                <LeaderboardTable data={filteredData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
