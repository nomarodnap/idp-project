import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function main() {
  console.log("Running migration...");
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "competency_categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "code" varchar(50) NOT NULL,
      "name" varchar(255) NOT NULL,
      "employee_type" varchar(100),
      "created_at" timestamp DEFAULT now() NOT NULL,
      CONSTRAINT "competency_categories_code_unique" UNIQUE("code")
    );
  `);
  
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "training_courses" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" varchar(255) NOT NULL,
      "provider" varchar(255),
      "duration" varchar(100),
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `);

  await db.execute(`
    ALTER TABLE "users" 
    ADD COLUMN IF NOT EXISTS "system_role" varchar(50) NOT NULL DEFAULT 'User',
    ADD COLUMN IF NOT EXISTS "supervisor_id" uuid;
  `);

  console.log("Migration applied successfully!");
  process.exit(0);
}

main().catch(console.error);
