require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const logger = require('./utils/logger');
const startReminderJob = require('./jobs/reminderJob');

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, async () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // 1. Test Database Connection on startup
  try {
    const res = await pool.query('SELECT NOW()');
    logger.db(`✅ Connected to PostgreSQL. Server Time: ${res.rows[0].now}`);
  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
    process.exit(1); 
  }

  // 2. Start Background Jobs
  startReminderJob();
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});