"use server";

import { auth } from "@/lib/auth";
import { QuizActionError } from "@/server/utils/error";
import { QuizBookmark } from "@/lib/types";
import { headers } from "next/headers";
import { selectBookmarkedQuizzes } from "@/server/database/queries/bookmarks/select";
import { toggleQuizBookmarkQuery } from "@/server/database/queries/bookmarks/update";

export async function getUserBookmarkedQuizzes(
  userId?: string
): Promise<QuizBookmark[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserBookmarkedQuizzes"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserBookmarkedQuizzes"
      );
    }

    // Get bookmarks with quiz and user data
    const bookmarks = await selectBookmarkedQuizzes(parseInt(userId));

    return bookmarks;
  } catch (error) {
    if (error instanceof QuizActionError) {
      throw error;
    }
    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to fetch user quiz bookmarks",
      "getUserBookmarkedQuizzes"
    );
  }
}

export async function toggleQuizBookmark(
  quizId: number
): Promise<{ isBookmarked: boolean }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new QuizActionError(
        "UNAUTHORIZED",
        "No active session found",
        "toggleQuizBookmark"
      );
    }

    const userId = session.user.id;
    const userIdNum = parseInt(userId, 10);

    return await toggleQuizBookmarkQuery(quizId, userIdNum);
  } catch (error) {
    if (error instanceof QuizActionError) {
      throw error;
    }
    throw new QuizActionError(
      "DATABASE_ERROR",
      "Failed to toggle quiz bookmark",
      "toggleQuizBookmark"
    );
  }
}
