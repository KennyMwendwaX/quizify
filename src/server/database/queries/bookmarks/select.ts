"use server";

import db from "@/server/database";
import { quizBookmarks, quizRatings } from "@/server/database/schema";
import { avg, eq, inArray } from "drizzle-orm";
import { QuizBookmark } from "@/lib/types";

export async function selectQuizBookmarksByUserId(
  userId: number
): Promise<QuizBookmark[]> {
  // Get bookmarks with quiz and user data
  const bookmarks = await db.query.quizBookmarks.findMany({
    where: eq(quizBookmarks.userId, userId),
    with: {
      quiz: {
        columns: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          createdAt: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: (bookmarks) => [bookmarks.createdAt],
  });

  if (bookmarks.length === 0) {
    return [];
  }

  // Get quiz IDs for rating calculation
  const quizIds = bookmarks.map((b) => b.quiz.id);

  // Get average ratings for all bookmarked quizzes in one query
  const ratingsData = await db
    .select({
      quizId: quizRatings.quizId,
      avgRating: avg(quizRatings.rating),
    })
    .from(quizRatings)
    .where(inArray(quizRatings.quizId, quizIds))
    .groupBy(quizRatings.quizId);

  // Create ratings map for efficient lookup
  const ratingsMap = new Map<number, number>();
  ratingsData.forEach((rating) => {
    if (rating.avgRating !== null) {
      ratingsMap.set(rating.quizId, Number(rating.avgRating));
    }
  });

  // Data transformation logic
  const transformedBookmarks: QuizBookmark[] = bookmarks.map((bookmark) => ({
    id: bookmark.id,
    createdAt: bookmark.createdAt,
    updatedAt: bookmark.updatedAt,
    userId: bookmark.userId,
    quizId: bookmark.quizId,
    quiz: {
      id: bookmark.quiz.id,
      title: bookmark.quiz.title,
      description: bookmark.quiz.description,
      category: bookmark.quiz.category,
      difficulty: bookmark.quiz.difficulty,
      rating: ratingsMap.get(bookmark.quiz.id) || 0,
      createdAt: bookmark.quiz.createdAt,
      user: {
        name: bookmark.quiz.user.name,
        image: bookmark.quiz.user.image,
      },
    },
  }));

  return transformedBookmarks;
}
