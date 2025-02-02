import QuizzesContentPage from "./components/quizzes-content";
import { getPublicQuizzes } from "@/server/actions";

// const quizzes = [
//   {
//     id: 1,
//     title: "World History Masterclass",
//     description: "Journey through pivotal moments that shaped our world",
//     questionCount: 20,
//     timeLimit: 30,
//     participants: 1500,
//     difficulty: "Medium",
//     category: "history",
//   },
//   {
//     id: 2,
//     title: "Earth's Geography",
//     description: "Explore continents, oceans, and natural wonders",
//     questionCount: 15,
//     timeLimit: 25,
//     participants: 1200,
//     difficulty: "Hard",
//     category: "geography",
//   },
//   {
//     id: 3,
//     title: "Ancient Civilizations",
//     description: "Discover the mysteries of ancient cultures",
//     questionCount: 18,
//     timeLimit: 28,
//     participants: 980,
//     difficulty: "Easy",
//     category: "history",
//   },
//   {
//     id: 4,
//     title: "General Knowledge Challenge",
//     description: "Test your knowledge across various topics",
//     questionCount: 25,
//     timeLimit: 35,
//     participants: 2200,
//     difficulty: "Medium",
//     category: "general",
//   },
//   {
//     id: 5,
//     title: "Physics & Universe",
//     description: "Unravel the mysteries of the cosmos",
//     questionCount: 22,
//     timeLimit: 32,
//     participants: 1800,
//     difficulty: "Hard",
//     category: "science",
//   },
//   {
//     id: 6,
//     title: "World Capitals",
//     description: "Test your knowledge of global capitals",
//     questionCount: 20,
//     timeLimit: 30,
//     participants: 1650,
//     difficulty: "Easy",
//     category: "geography",
//   },
// ];

export default async function QuizzesPage() {
  const result = await getPublicQuizzes();
  if (result.error) {
    throw new Error(result.error);
  }

  const quizzes = result.quizzes ?? [];

  return <QuizzesContentPage quizzes={quizzes} />;
}
