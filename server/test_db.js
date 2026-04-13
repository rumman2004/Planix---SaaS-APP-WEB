require('dotenv').config();
const pool = require('./src/config/db');

async function test() {
  try {
    const res = await pool.query('SELECT id, title, event_type, status, google_event_id FROM events ORDER BY created_at DESC LIMIT 15');
    console.log("Recent DB events statuses:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
test();
