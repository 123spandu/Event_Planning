import { STATUSES } from '../models/enquiryModel.js';

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const todayISO = () => {
  // Server-side "today" in India Standard Time
  const d = new Date(Date.now() + 5.5 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
};

/** Validates & normalises a public enquiry. Mirrors frontend/src/services/validation.js */
export function validateEnquiry(req, res, next) {
  const b = req.body || {};
  if (str(b.website)) return res.status(400).json({ message: 'Invalid submission.' }); // honeypot

  const e = {};
  const v = {
    fullName: str(b.fullName),
    phone: str(b.phone).replace(/[\s-]/g, ''),
    email: str(b.email).toLowerCase(),
    eventType: str(b.eventType),
    packageName: str(b.packageName) || null,
    eventDate: str(b.eventDate),
    location: str(b.location),
    guests: Number(b.guests),
    budget: Number(b.budget),
    requirements: str(b.requirements),
  };

  if (v.fullName.length < 2 || v.fullName.length > 100 || !/^[\p{L}\s.'-]+$/u.test(v.fullName))
    e.fullName = 'Please enter a valid full name.';
  if (!/^(\+?91|0)?[6-9]\d{9}$/.test(v.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || v.email.length > 150) e.email = 'Enter a valid email address.';
  if (!v.eventType || v.eventType.length > 100) e.eventType = 'Please select the type of event.';
  if (v.packageName && v.packageName.length > 100) e.packageName = 'Invalid package.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.eventDate) || Number.isNaN(Date.parse(v.eventDate)))
    e.eventDate = 'Please choose a valid event date.';
  else if (v.eventDate < todayISO()) e.eventDate = 'The event date cannot be in the past.';
  if (!v.location || v.location.length > 200) e.location = 'Please enter the event location.';
  if (!Number.isInteger(v.guests) || v.guests < 1 || v.guests > 5000) e.guests = 'Guests must be between 1 and 5000.';
  if (!Number.isFinite(v.budget) || v.budget < 1000 || v.budget > 10000000) e.budget = 'Budget should be at least ₹1,000.';
  if (v.requirements.length > 1500) e.requirements = 'Please keep requirements under 1500 characters.';

  if (Object.keys(e).length) return res.status(422).json({ message: 'Please correct the highlighted fields.', errors: e });
  req.enquiry = v;
  next();
}

export function validateEnquiryUpdate(req, res, next) {
  const b = req.body || {};
  const out = {};
  if ('status' in b) {
    if (!STATUSES.includes(b.status)) return res.status(422).json({ message: 'Invalid status.' });
    out.status = b.status;
  }
  for (const k of ['quoted_amount', 'final_amount']) {
    if (k in b) {
      if (b[k] === null || b[k] === '') out[k] = null;
      else if (!Number.isFinite(Number(b[k])) || Number(b[k]) < 0) return res.status(422).json({ message: `Invalid ${k}.` });
      else out[k] = Number(b[k]);
    }
  }
  if ('admin_notes' in b) out.admin_notes = String(b.admin_notes ?? '').slice(0, 5000);
  req.update = out;
  next();
}

const list = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 30) : []);
const slugOk = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 100;

export function validateService(req, res, next) {
  const b = req.body || {};
  const s = {
    slug: str(b.slug).toLowerCase(),
    title: str(b.title),
    icon: str(b.icon) || 'Sparkles',
    image: str(b.image) || null,
    tagline: str(b.tagline).slice(0, 200),
    description: str(b.description).slice(0, 5000),
    included: list(b.included),
    customizations: list(b.customizations),
    sort_order: Number.parseInt(b.sort_order, 10) || 0,
    is_active: b.is_active !== false,
  };
  if (!s.title || s.title.length > 120) return res.status(422).json({ message: 'Title is required (max 120 characters).' });
  if (!slugOk(s.slug)) return res.status(422).json({ message: 'Slug must use lowercase letters, numbers and hyphens.' });
  if (s.image && s.image.length > 500) return res.status(422).json({ message: 'Image URL is too long.' });
  req.service = s;
  next();
}

export function validatePackage(req, res, next) {
  const b = req.body || {};
  const p = {
    slug: str(b.slug).toLowerCase(),
    name: str(b.name),
    price: Number(b.price),
    subtitle: str(b.subtitle).slice(0, 200),
    features: list(b.features),
    highlighted: Boolean(b.highlighted),
    sort_order: Number.parseInt(b.sort_order, 10) || 0,
    is_active: b.is_active !== false,
  };
  if (!p.name || p.name.length > 100) return res.status(422).json({ message: 'Name is required (max 100 characters).' });
  if (!slugOk(p.slug)) return res.status(422).json({ message: 'Slug must use lowercase letters, numbers and hyphens.' });
  if (!Number.isFinite(p.price) || p.price < 0 || p.price > 100000000) return res.status(422).json({ message: 'Enter a valid price.' });
  req.pkg = p;
  next();
}
