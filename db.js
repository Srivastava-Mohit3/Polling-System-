const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'polluser',
    password: process.env.DB_PASSWORD || 'pollpassword',
    database: process.env.DB_NAME || 'polldb',
    max: 20,
    idleTimeoutMillis: 30000
});

const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
}

const createPoll = async (title, options) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const pollResult = await client.query('INSERT INTO polls (title) VALUES ($1) RETURNING id', [title]);
        const pollId = pollResult.rows[0].id;

        for (const option of options) {
            await client.query('INSERT INTO options (poll_id, option_text) VALUES ($1, $2)', [pollId, option]);
        }

        await client.query('COMMIT');
        return pollId;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

const getPollResults = async (id) => {
    const pollResult = await pool.query('SELECT * FROM polls WHERE id = $1', [id]);
    const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [id]);

    if (pollResult.rows.length === 0) {
        return null;
    }

    return {
        poll: pollResult.rows[0],
        options: optionsResult.rows
    };
}

const updateVote = async (optionId) => {
    await pool.query('UPDATE options SET votes = votes + 1 WHERE id = $1', [optionId]);
}

const getLeaderboard = async () => {
    const result = await pool.query(`
    SELECT o.id, o.option_text, o.votes, p.title as poll_title
    FROM options o
    JOIN polls p ON o.poll_id = p.id
    ORDER BY o.votes DESC
    LIMIT 10
  `);
    return result.rows;
}

module.exports = { connectToDatabase, createPoll, getPollResults, updateVote, getLeaderboard };

