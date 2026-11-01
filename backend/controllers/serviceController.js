import { ServiceModel } from '../models/serviceModel.js';

export const listPublic = async (_req, res) => res.json(await ServiceModel.list({ activeOnly: true }));
export const listAll = async (_req, res) => res.json(await ServiceModel.list({ activeOnly: false }));
export const create = async (req, res) => res.status(201).json(await ServiceModel.create(req.service));

export async function update(req, res) {
  if (!(await ServiceModel.findById(req.params.id))) return res.status(404).json({ message: 'Service not found.' });
  res.json(await ServiceModel.update(req.params.id, req.service));
}

export async function remove(req, res) {
  if (!(await ServiceModel.remove(req.params.id))) return res.status(404).json({ message: 'Service not found.' });
  res.status(204).end();
}
