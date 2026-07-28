const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function main() {
  try {
    await sql`ALTER TABLE "users" ALTER COLUMN "avatar_url" SET DATA TYPE text;`;
    console.log("Migration applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

main();
