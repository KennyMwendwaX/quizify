"use server";

import db from "@/database/db";
import { quizBookmarks, quizzes } from "@/database/schema";
import { auth } from "@/lib/auth";
import { UserActionError } from "@/lib/error";
import { QuizBookmark } from "@/lib/types";
import { and, eq } from "drizzle-orm";
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

export async function addQuizBookmark(quizId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "addQuizBookmark"
      );
    }

    const userId = session.user.id;
    const quizIdNum = parseInt(quizId, 10);
    const userIdNum = parseInt(userId, 10);

    const quizExists = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizIdNum),
    });

    if (!quizExists) {
      throw new UserActionError(
        "NOT_FOUND",
        "Quiz not found",
        "addQuizBookmark"
      );
    }

    const existingBookmark = await db.query.quizBookmarks.findFirst({
      where: and(
        eq(quizBookmarks.quizId, quizIdNum),
        eq(quizBookmarks.userId, userIdNum)
      ),
    });

    if (existingBookmark) {
      return existingBookmark;
    }

    await db
      .insert(quizBookmarks)
      .values({
        quizId: quizIdNum,
        userId: userIdNum,
      })
      .returning();

    return { success: true };
  } catch (error) {
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to add quiz bookmark",
      "addQuizBookmark"
    );
  }
}

export async function removeQuizBookmark(quizId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "removeQuizBookmark"
      );
    }

    const userId = session.user.id;
    const quizIdNum = parseInt(quizId, 10);
    const userIdNum = parseInt(userId, 10);

    await db
      .delete(quizBookmarks)
      .where(
        and(
          eq(quizBookmarks.quizId, quizIdNum),
          eq(quizBookmarks.userId, userIdNum)
        )
      );

    return { success: true };
  } catch (error) {
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to remove quiz bookmark",
      "removeQuizBookmark"
    );
  }
}
