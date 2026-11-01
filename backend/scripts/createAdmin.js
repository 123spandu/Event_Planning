/**
 * Create or reset an admin account.
 * Usage: npm run create-admin -- --email you@example.com --password "StrongPass123" --name "Your Name"
 */
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { AdminModel } from '../models/adminModel.js';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const email = String(args.email || '').trim().toLowerCase();
const password = String(args.password || '');
const name = String(args.name || 'Admin').trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
  console.error('Usage: npm run create-admin -- --email you@example.com --password "AtLeast10Chars" [--name "Your Name"]');
  process.exit(1);
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await AdminModel.upsert({ name, email, passwordHash });
  console.log(`✓ Admin account ready: ${email}`);
} catch (e) {
  console.error('✗ Failed to create admin:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
