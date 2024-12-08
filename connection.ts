import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

import { startQuery } from './index';

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});

const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database.');
    } catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
};

pool.connect(function (err) {
    if (err) throw err;
    console.log("**************************************");
    console.log("           EMPLOYEE TRACKER           ");
    console.log("**************************************");
    startQuery();
});

export { pool, connectToDb };
