require('dotenv').config();
const { google } = require('googleapis');
const pool = require('./src/config/db');

async function testCal() {
  try {
    // Get user 1
    const { rows } = await pool.query('SELECT refresh_token FROM users LIMIT 1');
    const refresh_token = rows[0].refresh_token;

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    client.setCredentials({ refresh_token });

    const calendar = google.calendar({ version: 'v3', auth: client });
    console.log('Fetching calendar list...');
    const result = await calendar.calendarList.list({ showHidden: true });
    
    console.log("Calendars:");
    for (const cal of result.data.items) {
      console.log(`- ${cal.summary} (${cal.id})`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
testCal();
