import { pool } from '../config/db.js';

const parseJson = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  try { return JSON.parse(v); } catch { return []; }
};
const toApi = (r) => ({
  ...r,
  price: Number(r.price),
  features: parseJson(r.features),
  highlighted: Boolean(r.highlighted),
  is_active: Boolean(r.is_active),
});

export const PackageModel = {
  async list({ activeOnly = true } = {}) {
    const [rows] = await pool.query(
      `SELECT * FROM packages ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY sort_order, price, id`
    );
    return rows.map(toApi);
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);
    return rows[0] ? toApi(rows[0]) : null;
  },
  async create(p) {
    const [r] = await pool.query(
      `INSERT INTO packages (slug, name, price, subtitle, features, highlighted, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.slug, p.name, p.price, p.subtitle, JSON.stringify(p.features), p.highlighted ? 1 : 0, p.sort_order, p.is_active ? 1 : 0]
    );
    return this.findById(r.insertId);
  },
  async update(id, p) {
    await pool.query(
      `UPDATE packages SET slug=?, name=?, price=?, subtitle=?, features=?, highlighted=?, sort_order=?, is_active=? WHERE id = ?`,
      [p.slug, p.name, p.price, p.subtitle, JSON.stringify(p.features), p.highlighted ? 1 : 0, p.sort_order, p.is_active ? 1 : 0, id]
    );
    return this.findById(id);
  },
  async remove(id) {
    const [r] = await pool.query('DELETE FROM packages WHERE id = ?', [id]);
    return r.affectedRows > 0;
  },
  async count() {
    const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM packages');
    return c;
  },
};
