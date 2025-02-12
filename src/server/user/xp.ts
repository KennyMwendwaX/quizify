"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function updateUserXP(userId: number, xpEarned: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      totalXp: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db
    .update(users)
    .set({
      totalXp: user.totalXp + xpEarned,
    })
    .where(eq(users.id, userId));
}
