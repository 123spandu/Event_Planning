import { EnquiryModel, STATUSES } from '../models/enquiryModel.js';

export async function createEnquiry(req, res) {
  const id = await EnquiryModel.create(req.enquiry);
  res.status(201).json({ id, message: 'Enquiry received.' });
}

export async function listEnquiries(req, res) {
  const status = STATUSES.includes(req.query.status) ? req.query.status : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : undefined;
  res.json(await EnquiryModel.list({ status, q }));
}

export async function getEnquiry(req, res) {
  const e = await EnquiryModel.findById(req.params.id);
  if (!e) return res.status(404).json({ message: 'Enquiry not found.' });
  res.json(e);
}

export async function updateEnquiry(req, res) {
  const existing = await EnquiryModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Enquiry not found.' });
  res.json(await EnquiryModel.update(req.params.id, req.update));
}

export async function deleteEnquiry(req, res) {
  const ok = await EnquiryModel.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Enquiry not found.' });
  res.status(204).end();
}

export async function stats(_req, res) {
  res.json(await EnquiryModel.stats());
}
