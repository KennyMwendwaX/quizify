"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function updateUserStreak(userId: number) {
  // Get current user data
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
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
    return;
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
    return;
  }

  // If activity is on the next day, increment streak
  if (diffInDays === 1) {
    newCurrentStreak += 1;
    if (newCurrentStreak > newBestStreak) {
      newBestStreak = newCurrentStreak;
    }
  }
  // If there was a gap in activity, reset streak to 1
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
}
