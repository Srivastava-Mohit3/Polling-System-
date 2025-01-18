const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'polluser',
  password: process.env.DB_PASSWORD || 'pollpassword',
  database: process.env.DB_NAME || 'polldb',
});

const createSchema = async () => {
  try {
    await pool.connect();

    // Create polls table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create options table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES polls(id),
        option_text VARCHAR(255) NOT NULL,
        votes INTEGER DEFAULT 0
      )
    `);

    console.log('Database schema created successfully');
  } catch (err) {
    console.error('Error creating schema:', err);
  } finally {
    await pool.end();
  }
}

createSchema();