import { pool } from '../config/db.js';

const parseJson = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  try { return JSON.parse(v); } catch { return []; }
};
const toApi = (r) => ({ ...r, included: parseJson(r.included), customizations: parseJson(r.customizations), is_active: Boolean(r.is_active) });

export const ServiceModel = {
  async list({ activeOnly = true } = {}) {
    const [rows] = await pool.query(
      `SELECT * FROM services ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY sort_order, id`
    );
    return rows.map(toApi);
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0] ? toApi(rows[0]) : null;
  },
  async create(s) {
    const [r] = await pool.query(
      `INSERT INTO services (slug, title, icon, image, tagline, description, included, customizations, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.slug, s.title, s.icon, s.image, s.tagline, s.description, JSON.stringify(s.included),
        JSON.stringify(s.customizations), s.sort_order, s.is_active ? 1 : 0]
    );
    return this.findById(r.insertId);
  },
  async update(id, s) {
    await pool.query(
      `UPDATE services SET slug=?, title=?, icon=?, image=?, tagline=?, description=?, included=?, customizations=?, sort_order=?, is_active=?
       WHERE id = ?`,
      [s.slug, s.title, s.icon, s.image, s.tagline, s.description, JSON.stringify(s.included),
        JSON.stringify(s.customizations), s.sort_order, s.is_active ? 1 : 0, id]
    );
    return this.findById(id);
  },
  async remove(id) {
    const [r] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
    return r.affectedRows > 0;
  },
  async count() {
    const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM services');
    return c;
  },
};
