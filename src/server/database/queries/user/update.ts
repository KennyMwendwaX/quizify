"use server";

import db from "@/server/database";
import { eq } from "drizzle-orm";
import { users } from "@/server/database/schema";

type StreakUpdateData = {
  lastActivityDate?: Date;
  currentStreak?: number;
  bestStreak?: number;
};

export const updateUserStreakData = async (
  userId: number,
  data: StreakUpdateData
): Promise<void> => {
  await db.update(users).set(data).where(eq(users.id, userId));
};

export const updateUserTotalXP = async (
  userId: number,
  totalXP: number
): Promise<void> => {
  await db.update(users).set({ totalXp: totalXP }).where(eq(users.id, userId));
};
