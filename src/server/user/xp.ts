"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { UpdateUserXPResponse, UserActionError } from "./types";

export async function updateUserXP(
  userId: number,
  xpEarned: number
): Promise<UpdateUserXPResponse> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        totalXp: true,
      },
    });

    if (!user) {
      throw new UserActionError("User not found", 404, "updateUserXP");
    }

    const newTotalXp = user.totalXp + xpEarned;

    await db
      .update(users)
      .set({
        totalXp: newTotalXp,
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      newTotalXp,
    };
  } catch (error) {
    console.error("Error in updateUserXP:", error);

    if (error instanceof UserActionError) {
      return {
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    return {
      error: "Failed to update user XP. Please try again later.",
      statusCode: 500,
    };
  }
}
