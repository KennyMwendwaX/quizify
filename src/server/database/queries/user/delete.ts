"use server";

import db from "@/server/database";
import { users } from "@/server/database/schema";
import { eq } from "drizzle-orm";

export const deleteUserById = async (userId: number) => {
  await db.delete(users).where(eq(users.id, userId));
};
