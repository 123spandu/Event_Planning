/** Enquiry validation – mirrors backend rules in backend/middleware/validate.js */
export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export function validateEnquiry(v) {
  const e = {};
  const name = v.fullName.trim();
  if (!name) e.fullName = 'Please enter your full name.';
  else if (name.length < 2 || name.length > 100) e.fullName = 'Name should be 2–100 characters.';
  else if (!/^[\p{L}\s.'-]+$/u.test(name)) e.fullName = 'Name can contain letters, spaces, dots and hyphens only.';

  const phone = v.phone.replace(/[\s-]/g, '');
  if (!phone) e.phone = 'Please enter your phone number.';
  else if (!/^(\+?91|0)?[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';

  const email = v.email.trim();
  if (!email) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 150) e.email = 'Enter a valid email address.';

  if (!v.eventType) e.eventType = 'Please select the type of event.';

  if (!v.eventDate) e.eventDate = 'Please choose your preferred event date.';
  else if (v.eventDate < todayISO()) e.eventDate = 'The event date cannot be in the past.';

  const loc = v.location.trim();
  if (!loc) e.location = 'Please enter the event location or area.';
  else if (loc.length > 200) e.location = 'Location is too long (max 200 characters).';

  const guests = Number(v.guests);
  if (!v.guests) e.guests = 'Please enter the approximate number of guests.';
  else if (!Number.isInteger(guests) || guests < 1 || guests > 5000) e.guests = 'Enter a number between 1 and 5000.';

  const budget = Number(v.budget);
  if (!v.budget) e.budget = 'Please enter your approximate budget.';
  else if (!Number.isFinite(budget) || budget < 1000) e.budget = 'Budget should be at least ₹1,000.';
  else if (budget > 10000000) e.budget = 'Please enter a realistic budget amount.';

  if (v.requirements.length > 1500) e.requirements = 'Please keep this under 1500 characters.';
  return e;
}
