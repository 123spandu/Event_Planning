import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: ['DATE'], // keep event_date as 'YYYY-MM-DD'
  decimalNumbers: true,
});

export async function checkConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}
