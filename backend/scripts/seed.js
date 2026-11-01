/**
 * Seed services, packages and sample gallery images from the frontend data
 * files (single source of truth). Only fills tables that are empty, so it is
 * safe to run more than once. Pass --force to replace existing rows.
 */
import { pool } from '../config/db.js';
import { services } from '../../frontend/src/data/services.js';
import { packages } from '../../frontend/src/data/packages.js';
import { galleryImages } from '../../frontend/src/data/gallery.js';

const force = process.argv.includes('--force');

async function seedTable(table, rows, insert) {
  const [[{ c }]] = await pool.query(`SELECT COUNT(*) AS c FROM ${table}`);
  if (c > 0 && !force) {
    console.log(`• ${table}: already has ${c} rows – skipped (use --force to replace)`);
    return;
  }
  if (force) await pool.query(`DELETE FROM ${table}`);
  for (const [i, r] of rows.entries()) await insert(r, i);
  console.log(`✓ ${table}: inserted ${rows.length} rows`);
}

try {
  await seedTable('services', services, (s, i) =>
    pool.query(
      `INSERT INTO services (slug, title, icon, image, tagline, description, included, customizations, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [s.slug, s.title, s.icon, s.image, s.tagline, s.description, JSON.stringify(s.included), JSON.stringify(s.customizations), i]
    )
  );
  await seedTable('packages', packages, (p, i) =>
    pool.query(
      `INSERT INTO packages (slug, name, price, subtitle, features, highlighted, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [p.slug, p.name, p.price, p.subtitle, JSON.stringify(p.features), p.highlighted ? 1 : 0, i]
    )
  );
  await seedTable('gallery_images', galleryImages, (g, i) =>
    pool.query(
      'INSERT INTO gallery_images (title, category, src, is_sample, is_active, sort_order) VALUES (?, ?, ?, ?, 1, ?)',
      [g.title, g.category, g.src, g.isSample ? 1 : 0, i]
    )
  );
} catch (e) {
  console.error('✗ Seeding failed:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
