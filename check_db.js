require('dotenv').config();
const postgres = require('postgres');

async function main() {
  const sql = postgres(process.env.DATABASE_URL, { prepare: false });
  try {
    const res = await sql`SELECT id, user_id, course_title, created_at FROM idp_plans ORDER BY created_at DESC LIMIT 5`;
    console.log(res);
  } catch (error) {
    console.error(error);
  } finally {
    await sql.end();
  }
}
main();
