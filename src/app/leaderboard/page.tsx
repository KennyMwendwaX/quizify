import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: "Alice Johnson", score: 95, timeTaken: "4:32", avatar: "/avatars/alice.jpg" },
  { rank: 2, name: "Bob Smith", score: 92, timeTaken: "4:45", avatar: "/avatars/bob.jpg" },
  { rank: 3, name: "Charlie Brown", score: 88, timeTaken: "5:01", avatar: "/avatars/charlie.jpg" },
  { rank: 4, name: "Diana Ross", score: 85, timeTaken: "5:15", avatar: "/avatars/diana.jpg" },
  { rank: 5, name: "Ethan Hunt", score: 82, timeTaken: "5:30", avatar: "/avatars/ethan.jpg" },
  // Add more entries as needed
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Quiz Leaderboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell>
                    {entry.rank === 1 && <Badge className="bg-yellow-400 text-black">🥇</Badge>}
                    {entry.rank === 2 && <Badge className="bg-gray-400">🥈</Badge>}
                    {entry.rank === 3 && <Badge className="bg-orange-400">🥉</Badge>}
                    {entry.rank > 3 && entry.rank}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>
                          {entry.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{entry.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>{entry.timeTaken}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

