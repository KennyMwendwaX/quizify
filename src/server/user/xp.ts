"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { UserActionError } from "@/lib/error";

export async function updateUserXP(
  userId: number,
  xpEarned: number
): Promise<number> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        totalXp: true,
      },
    });

    if (!user) {
      throw new UserActionError("NOT_FOUND", "User not found", "updateUserXP");
    }

    const newTotalXp = user.totalXp + xpEarned;

    await db
      .update(users)
      .set({
        totalXp: newTotalXp,
      })
      .where(eq(users.id, userId));

    return newTotalXp;
  } catch (error) {
    console.error("Error in updateUserXP:", error);

    if (error instanceof UserActionError) {
      throw error;
    }

    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to update user XP. Please try again later.",
      "updateUserXP"
    );
  }
}
