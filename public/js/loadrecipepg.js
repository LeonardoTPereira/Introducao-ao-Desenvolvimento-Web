const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.NEON_URI,
    ssl: { rejectUnauthorized: false }
});

const connectToDatabase = async () => {
    try {
        // Test connection
        await pool.query('SELECT 1');
        console.log('Connected to the PostgreSQL database');
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
    }
};