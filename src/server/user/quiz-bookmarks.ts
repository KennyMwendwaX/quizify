"use server";

import { auth } from "@/lib/auth";
import { UserActionError } from "@/lib/error";
import { headers } from "next/headers";

export async function getUserQuizBookmarks(userId?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserQuizAttempt"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserQuizAttempt"
      );
    }
  } catch (error) {
    if (error instanceof UserActionError) {
      throw error;
    }
    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to fetch user quiz bookmarks",
      "getUserQuizAttempt"
    );
  }
}
