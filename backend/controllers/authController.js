import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminModel } from '../models/adminModel.js';

// Constant-time-ish dummy hash so unknown emails take as long as wrong passwords
const DUMMY_HASH = bcrypt.hashSync('timing-safe-dummy-password', 12);

export async function login(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const admin = await AdminModel.findByEmail(email);
  const ok = await bcrypt.compare(password, admin?.password_hash || DUMMY_HASH);
  if (!admin || !ok) return res.status(401).json({ message: 'Invalid email or password.' });

  const token = jwt.sign({ sub: admin.id, email: admin.email, role: 'admin' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}

export async function me(req, res) {
  const admin = await AdminModel.findById(req.admin.id);
  if (!admin) return res.status(401).json({ message: 'Account not found.' });
  res.json({ admin });
}
