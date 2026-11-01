import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import Logo from './Logo.jsx';
import { navLinks } from './Navbar.jsx';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons.jsx';
import { siteConfig } from '../config/siteConfig.js';
import { whatsappLink } from '../services/whatsapp.js';
import { useContent } from '../context/ContentContext.jsx';

export default function Footer() {
  const { services } = useContent();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__tagline">{siteConfig.tagline}</p>
          <p className="footer__about">
            Event planning, decoration coordination and vendor management for celebrations of every
            size across {siteConfig.city}.
          </p>
          <div className="footer__social">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
              <WhatsAppIcon size={18} />
            </a>
            {siteConfig.instagramUrl && (
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
            )}
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`} aria-label="Email us">
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="footer__title">Explore</h3>
          <ul className="footer__list">
            {navLinks.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer__title">Services</h3>
          <ul className="footer__list">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}><Link to={`/services#${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer__title">Get in touch</h3>
          <ul className="footer__list footer__list--contact">
            <li><MapPin size={16} aria-hidden="true" /> {siteConfig.city}, {siteConfig.state}</li>
            {siteConfig.email && (
              <li><Mail size={16} aria-hidden="true" /> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
            )}
            <li>
              <WhatsAppIcon size={16} />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </li>
          </ul>
          <Link to="/contact#enquiry" className="btn btn--outline-light btn--sm footer__cta">Send an enquiry</Link>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Proudly planning celebrations in {siteConfig.city}.</p>
      </div>
    </footer>
  );
}
