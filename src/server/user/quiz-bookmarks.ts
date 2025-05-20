"use server";

import db from "@/database/db";
import { quizBookmarks } from "@/database/schema";
import { auth } from "@/lib/auth";
import { UserActionError } from "@/lib/error";
import { QuizBookmark } from "@/lib/types";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUserQuizBookmarks(
  userId?: string
): Promise<QuizBookmark[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserQuizBookmarks"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserQuizBookmarks"
      );
    }

    const bookmarks = await db.query.quizBookmarks.findMany({
      where: eq(quizBookmarks.userId, parseInt(userId)),
      with: {
        quiz: {
          columns: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            rating: true,
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

    return bookmarks;
  } catch (error) {
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch user quiz bookmarks",
      "getUserQuizBookmarks"
    );
  }
}
