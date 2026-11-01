import { pool } from '../config/db.js';

export const AdminModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM admins WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async upsert({ name, email, passwordHash }) {
    await pool.query(
      `INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)`,
      [name, email, passwordHash]
    );
  },
};
