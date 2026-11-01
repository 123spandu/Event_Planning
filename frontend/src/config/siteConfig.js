/**
 * Central business configuration.
 * Contact details come from environment variables (see .env.example) so that
 * nothing is hard-coded or invented. Edit the static text below freely.
 */
const env = import.meta.env;

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

export const siteConfig = {
  name: 'Momentra Events',
  tagline: 'We Plan. You Celebrate.',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  serviceArea: 'Bengaluru and nearby areas',
  siteUrl: clean(env.VITE_SITE_URL),

  // Digits only, international format (e.g. 91XXXXXXXXXX). Empty = not configured yet.
  whatsappNumber: clean(env.VITE_WHATSAPP_NUMBER).replace(/\D/g, ''),
  whatsappDefaultMessage:
    'Hello Momentra Events! I am interested in planning an event. Please share your packages and details.',

  email: clean(env.VITE_CONTACT_EMAIL),
  instagramUrl: clean(env.VITE_INSTAGRAM_URL),

  // Backend API. Empty = frontend-only mode (enquiries go through WhatsApp).
  apiUrl: clean(env.VITE_API_URL).replace(/\/+$/, ''),

  currency: '₹',

  pricingDisclaimer:
    'All prices are starting prices. The final price depends on event location, guest count, materials, vendors and customization. Catering, venue, photography and other vendor charges are not included unless explicitly specified in your written quotation.',
};

export const isApiEnabled = () => Boolean(siteConfig.apiUrl);
export const isWhatsAppConfigured = () => siteConfig.whatsappNumber.length >= 8;

export const formatPrice = (amount) =>
  `${siteConfig.currency}${Number(amount || 0).toLocaleString('en-IN')}`;
