"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { UserActionError } from "@/lib/error";

type UpdateUserStreakResponse = {
  currentStreak?: number;
  bestStreak?: number;
};

export async function updateUserStreak(
  userId: number
): Promise<UpdateUserStreakResponse> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UserActionError(
        "NOT_FOUND",
        "User not found",
        "updateUserStreak"
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // If this is the first activity
    if (!user.lastActivityDate) {
      await db
        .update(users)
        .set({
          lastActivityDate: today,
          currentStreak: 1,
          bestStreak: 1,
        })
        .where(eq(users.id, userId));

      return {
        currentStreak: 1,
        bestStreak: 1,
      };
    }

    // Convert lastActivityDate to start of day for comparison
    const lastActivity = new Date(user.lastActivityDate);
    const lastActivityDay = new Date(
      lastActivity.getFullYear(),
      lastActivity.getMonth(),
      lastActivity.getDate()
    );

    // Calculate the difference in days
    const diffInDays = Math.floor(
      (today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newCurrentStreak = user.currentStreak;
    let newBestStreak = user.bestStreak;

    // If activity is on the same day, no streak update needed
    if (diffInDays === 0) {
      await db
        .update(users)
        .set({ lastActivityDate: today })
        .where(eq(users.id, userId));

      return {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
      };
    }

    // If activity is on the next day, increment streak
    if (diffInDays === 1) {
      newCurrentStreak += 1;
      if (newCurrentStreak > newBestStreak) {
        newBestStreak = newCurrentStreak;
      }
    }
    // If there was a gap in activity (more than 1 day), reset streak to 1
    else {
      newCurrentStreak = 1;
    }

    // Update user streak data
    await db
      .update(users)
      .set({
        lastActivityDate: today,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
      })
      .where(eq(users.id, userId));

    return {
      currentStreak: newCurrentStreak,
      bestStreak: newBestStreak,
    };
  } catch (error) {
    console.error("Error in updateUserStreak:", error);

    if (error instanceof UserActionError) {
      throw error;
    }

    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to update user streak. Please try again later.",
      "updateUserStreak"
    );
  }
}

type ResetStreakResponse = {
  statusCode?: number;
  wasReset?: boolean;
  currentStreak: number;
};

export async function resetStreak(
  userId: number
): Promise<ResetStreakResponse> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        currentStreak: true,
        lastActivityDate: true,
      },
    });

    if (!user) {
      throw new UserActionError("NOT_FOUND", "User not found", "resetStreak");
    }

    // If no streak or no last activity, nothing to reset
    if (!user.lastActivityDate || user.currentStreak === 0) {
      return {
        wasReset: false,
        currentStreak: user.currentStreak,
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Convert lastActivityDate to start of day for comparison
    const lastActivity = new Date(user.lastActivityDate);
    const lastActivityDay = new Date(
      lastActivity.getFullYear(),
      lastActivity.getMonth(),
      lastActivity.getDate()
    );

    // Calculate the difference in days
    const diffInDays = Math.floor(
      (today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Reset streak only if more than 1 day has passed
    if (diffInDays > 1) {
      await db
        .update(users)
        .set({ currentStreak: 0 })
        .where(eq(users.id, userId));

      return {
        wasReset: true,
        currentStreak: 0,
      };
    }

    // No reset needed
    return {
      wasReset: false,
      currentStreak: user.currentStreak,
    };
  } catch (error) {
    console.error("Error in resetStreak:", error);

    if (error instanceof UserActionError) {
      throw error;
    }

    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to reset user streak",
      "resetStreak"
    );
  }
}
