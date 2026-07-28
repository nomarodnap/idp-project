import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function main() {
  try {
    console.log('Adding supervisor_position column to DB:', connectionString.split('@')[1]); // Log host for sanity check
    await db.execute(sql`ALTER TABLE idp_plans ADD COLUMN supervisor_position VARCHAR(255) NOT NULL DEFAULT '';`);
    console.log('Successfully added supervisor_position column');
  } catch (err: any) {
    if (err.message.includes('already exists') || err.message.includes('already exist')) {
      console.log('Column already exists');
    } else {
      console.error('Error running migration:', err);
    }
  }
  process.exit(0);
}

main();
