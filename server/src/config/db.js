const { Pool } = require('pg');
require('dotenv').config();

// Initialize the connection pool using the Database URI
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Supabase requires SSL connections from external clients
    rejectUnauthorized: false,
  },
});

// Event listener for successful connections
pool.on('connect', () => {
  console.log('✅ Successfully connected to the PostgreSQL database (Supabase).');
});

// Event listener for unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('❌ Unexpected database error on idle client:', err);
  process.exit(-1);
});

module.exports = pool;