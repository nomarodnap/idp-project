import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function runMigrate() {
  console.log("Running migrations...");
  try {
    await sql`ALTER TABLE "idp_plans" ADD COLUMN IF NOT EXISTS "plan_code" varchar(50) DEFAULT '' NOT NULL;`;
    await sql`ALTER TABLE "idp_plans" ADD CONSTRAINT "idp_plans_plan_code_unique" UNIQUE("plan_code");`;
  } catch (e: any) {
    if (e.message && e.message.includes("already exists")) {
       console.log("Column or constraint already exists.");
    } else {
       throw e;
    }
  }
  console.log("Migrations completed!");
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error("Migration failed!", err);
  process.exit(1);
});
