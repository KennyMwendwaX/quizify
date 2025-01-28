import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

const db = drizzle(sql);

migrate(db, { migrationsFolder: "drizzle/migrations" });
