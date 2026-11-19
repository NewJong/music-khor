require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function runFile(label, filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`>>> Applying ${label}: ${path.basename(filePath)}`);
    await pool.query(sql);
    console.log(`<<< ${label} done`);
}

(async () => {
    try {
        await runFile('schema', path.join(__dirname, 'schema.sql'));
        await runFile('seed',   path.join(__dirname, 'seed.sql'));
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration error:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
})();
