import { PackageModel } from '../models/packageModel.js';

export const listPublic = async (_req, res) => res.json(await PackageModel.list({ activeOnly: true }));
export const listAll = async (_req, res) => res.json(await PackageModel.list({ activeOnly: false }));
export const create = async (req, res) => res.status(201).json(await PackageModel.create(req.pkg));

export async function update(req, res) {
  if (!(await PackageModel.findById(req.params.id))) return res.status(404).json({ message: 'Package not found.' });
  res.json(await PackageModel.update(req.params.id, req.pkg));
}

export async function remove(req, res) {
  if (!(await PackageModel.remove(req.params.id))) return res.status(404).json({ message: 'Package not found.' });
  res.status(204).end();
}
