import { WhatsAppIcon } from './BrandIcons.jsx';
import { whatsappLink } from '../services/whatsapp.js';

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      className="wa-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Momentra Events on WhatsApp"
    >
      <WhatsAppIcon size={30} />
      <span className="wa-float__label">Chat with us</span>
    </a>
  );
}
