import fs from 'node:fs/promises';
import path from 'node:path';
import { GalleryModel } from '../models/galleryModel.js';
import { UPLOAD_DIR } from '../middleware/upload.js';

export const listPublic = async (_req, res) => res.json(await GalleryModel.list({ activeOnly: true }));
export const listAll = async (_req, res) => res.json(await GalleryModel.list({ activeOnly: false }));

export async function upload(req, res) {
  if (!req.file) return res.status(422).json({ message: 'Please choose an image to upload.' });
  const title = String(req.body.title || '').trim().slice(0, 150);
  const category = String(req.body.category || '').trim().slice(0, 80);
  if (!title || !category) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(422).json({ message: 'Title and category are required.' });
  }
  const image = await GalleryModel.create({
    title,
    category,
    src: `/uploads/${req.file.filename}`,
    isSample: req.body.isSample === 'true',
  });
  res.status(201).json(image);
}

export async function update(req, res) {
  if (!(await GalleryModel.findById(req.params.id))) return res.status(404).json({ message: 'Image not found.' });
  const b = req.body || {};
  const fields = {};
  if (typeof b.title === 'string' && b.title.trim()) fields.title = b.title.trim().slice(0, 150);
  if (typeof b.category === 'string' && b.category.trim()) fields.category = b.category.trim().slice(0, 80);
  if (typeof b.isSample === 'boolean') fields.isSample = b.isSample;
  if (typeof b.is_active === 'boolean') fields.is_active = b.is_active;
  res.json(await GalleryModel.update(req.params.id, fields));
}

export async function remove(req, res) {
  const row = await GalleryModel.remove(req.params.id);
  if (!row) return res.status(404).json({ message: 'Image not found.' });
  if (row.src.startsWith('/uploads/')) {
    const file = path.join(UPLOAD_DIR, path.basename(row.src));
    await fs.unlink(file).catch(() => {});
  }
  res.status(204).end();
}
