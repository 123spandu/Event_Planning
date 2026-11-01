import { pool } from '../config/db.js';

export const STATUSES = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Completed', 'Cancelled'];

export const EnquiryModel = {
  async create(e) {
    const [r] = await pool.query(
      `INSERT INTO enquiries (full_name, phone, email, event_type, package_name, event_date, location, guests, budget, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.fullName, e.phone, e.email, e.eventType, e.packageName, e.eventDate, e.location, e.guests, e.budget, e.requirements]
    );
    return r.insertId;
  },

  async list({ status, q, limit = 500 }) {
    const where = [];
    const params = [];
    if (status) { where.push('status = ?'); params.push(status); }
    if (q) {
      where.push('(full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR location LIKE ? OR event_type LIKE ?)');
      const like = `%${q}%`;
      params.push(like, like, like, like, like);
    }
    const sql = `SELECT * FROM enquiries ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
                 ORDER BY created_at DESC, id DESC LIMIT ?`;
    const [rows] = await pool.query(sql, [...params, limit]);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async update(id, fields) {
    const allowed = ['status', 'quoted_amount', 'final_amount', 'admin_notes'];
    const sets = [];
    const params = [];
    for (const k of allowed) {
      if (k in fields) { sets.push(`${k} = ?`); params.push(fields[k]); }
    }
    if (!sets.length) return this.findById(id);
    await pool.query(`UPDATE enquiries SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
    return this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
    return r.affectedRows > 0;
  },

  async stats() {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM enquiries');
    const [byStatus] = await pool.query('SELECT status, COUNT(*) AS count FROM enquiries GROUP BY status');
    const [[money]] = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN COALESCE(final_amount, quoted_amount, 0) END), 0) AS revenueCompleted,
        COALESCE(SUM(CASE WHEN status = 'Confirmed' THEN COALESCE(final_amount, quoted_amount, 0) END), 0) AS revenueConfirmed,
        COALESCE(SUM(CASE WHEN status = 'Quoted' THEN COALESCE(quoted_amount, 0) END), 0) AS quotedOpen
      FROM enquiries`);
    const [upcoming] = await pool.query(
      `SELECT id, full_name, event_type, event_date, location, final_amount
       FROM enquiries WHERE status = 'Confirmed' AND event_date >= CURDATE()
       ORDER BY event_date ASC LIMIT 20`
    );
    return {
      total,
      byStatus,
      revenueCompleted: Number(money.revenueCompleted),
      revenueConfirmed: Number(money.revenueConfirmed),
      quotedOpen: Number(money.quotedOpen),
      upcoming,
    };
  },
};
