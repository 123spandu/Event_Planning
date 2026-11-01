import { siteConfig } from '../config/siteConfig.js';

/**
 * Build a wa.me link. If no business number is configured yet, WhatsApp opens
 * with the message and lets the user choose a chat – nothing is invented.
 */
export function whatsappLink(message = siteConfig.whatsappDefaultMessage) {
  const text = encodeURIComponent(message);
  return siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function enquiryToWhatsAppMessage(e, eventLabel) {
  const lines = [
    'Hello Momentra Events! I would like to enquire about an event.',
    '',
    `*Name:* ${e.fullName}`,
    `*Phone:* ${e.phone}`,
    `*Email:* ${e.email}`,
    `*Event type:* ${eventLabel || e.eventType}`,
    `*Event date:* ${e.eventDate}`,
    `*Location:* ${e.location}`,
    `*Guests:* ${e.guests}`,
    `*Budget:* ₹${Number(e.budget).toLocaleString('en-IN')}`,
  ];
  if (e.packageName) lines.push(`*Interested package:* ${e.packageName}`);
  if (e.requirements?.trim()) lines.push('', `*Requirements:* ${e.requirements.trim()}`);
  return lines.join('\n');
}
