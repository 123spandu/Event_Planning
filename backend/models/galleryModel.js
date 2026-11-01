import { pool } from '../config/db.js';

const toApi = (r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  src: r.src,
  isSample: Boolean(r.is_sample),
  is_active: Boolean(r.is_active),
  sort_order: r.sort_order,
  created_at: r.created_at,
});

export const GalleryModel = {
  async list({ activeOnly = true } = {}) {
    const [rows] = await pool.query(
      `SELECT * FROM gallery_images ${activeOnly ? 'WHERE is_active = 1' : ''}
       ORDER BY is_sample ASC, sort_order ASC, created_at DESC, id DESC`
    );
    return rows.map(toApi);
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM gallery_images WHERE id = ?', [id]);
    return rows[0] ? toApi(rows[0]) : null;
  },
  async create(g) {
    const [r] = await pool.query(
      'INSERT INTO gallery_images (title, category, src, is_sample, is_active, sort_order) VALUES (?, ?, ?, ?, 1, ?)',
      [g.title, g.category, g.src, g.isSample ? 1 : 0, g.sort_order || 0]
    );
    return this.findById(r.insertId);
  },
  async update(id, fields) {
    const sets = [];
    const params = [];
    if ('title' in fields) { sets.push('title = ?'); params.push(fields.title); }
    if ('category' in fields) { sets.push('category = ?'); params.push(fields.category); }
    if ('isSample' in fields) { sets.push('is_sample = ?'); params.push(fields.isSample ? 1 : 0); }
    if ('is_active' in fields) { sets.push('is_active = ?'); params.push(fields.is_active ? 1 : 0); }
    if (sets.length) await pool.query(`UPDATE gallery_images SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
    return this.findById(id);
  },
  async remove(id) {
    const row = await this.findById(id);
    if (!row) return null;
    await pool.query('DELETE FROM gallery_images WHERE id = ?', [id]);
    return row;
  },
  async count() {
    const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM gallery_images');
    return c;
  },
};
