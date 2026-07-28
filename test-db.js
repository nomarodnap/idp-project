const postgres = require('postgres');
require('dotenv').config();
const sql = postgres(process.env.DATABASE_URL);
async function run() {
  console.log('users', await sql`SELECT id, name, position, department, "employeeType" FROM users`);
  process.exit(0);
}
run().catch(console.error);
