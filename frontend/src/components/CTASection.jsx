import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import SmartImage from './SmartImage.jsx';
import { WhatsAppIcon } from './BrandIcons.jsx';
import { whatsappLink } from '../services/whatsapp.js';
import { img } from '../data/images.js';

export default function CTASection({
  title = "Let's Make Your Next Celebration Special.",
  text = 'Share your idea, date and budget – we will come back with a plan and a transparent quotation tailored to you.',
}) {
  return (
    <section className="cta">
      <SmartImage src={img.lights} alt="" className="cta__bg" />
      <div className="cta__overlay" />
      <Reveal className="container cta__inner">
        <p className="eyebrow eyebrow--light">We Plan. You Celebrate.</p>
        <h2>{title}</h2>
        <p className="cta__text">{text}</p>
        <div className="cta__actions">
          <Link to="/contact#enquiry" className="btn btn--gold">
            Plan Your Event <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--outline-light">
            <WhatsAppIcon size={18} /> WhatsApp Us
          </a>
        </div>
      </Reveal>
    </section>
  );
}
