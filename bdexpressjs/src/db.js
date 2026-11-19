require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err);
});

(async () => {
    try {
        const { rows } = await pool.query('SELECT 1 AS ok');
        if (rows[0].ok === 1) {
            console.log('Connected to PostgreSQL (Neon) successfully!');
        }
    } catch (err) {
        console.error('PostgreSQL connection error:', err.message);
    }
})();

module.exports = pool;
