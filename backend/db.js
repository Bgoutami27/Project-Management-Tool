const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // important for Render
  },
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = pool;
