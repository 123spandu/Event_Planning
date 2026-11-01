import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import SmartImage from '../components/SmartImage.jsx';
import ServiceIcon from '../components/ServiceIcon.jsx';
import Reveal from '../components/Reveal.jsx';
import CTASection from '../components/CTASection.jsx';
import { WhatsAppIcon } from '../components/BrandIcons.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { whatsappLink } from '../services/whatsapp.js';
import { img } from '../data/images.js';

export default function Services() {
  useDocumentMeta({
    title: 'Event Planning Services in Bengaluru',
    description: 'Birthday parties, surprise parties, marriage proposals, anniversaries, baby showers, naming ceremonies, engagements, corporate, private and community events in Bengaluru.',
    path: '/services',
  });
  const { services } = useContent();

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Every Celebration, Thoughtfully Planned"
        text="Decoration, vendor coordination and complete event management for life's big and small moments."
        image={img.balloonsParty}
        crumb="Services"
      />

      <nav className="service-jump" aria-label="Jump to service">
        <div className="container service-jump__inner">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="service-jump__link">
              <ServiceIcon name={s.icon} size={16} /> {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="services-list">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} className={`service-detail ${i % 2 ? 'service-detail--alt' : ''}`}>
            <div className="container service-detail__grid">
              <Reveal className="service-detail__media">
                <SmartImage src={s.image} alt={`${s.title} decoration example (sample image)`} className="service-detail__img" />
                <span className="sample-tag">Sample image</span>
              </Reveal>
              <Reveal className="service-detail__content" delay={100}>
                <span className="service-detail__icon"><ServiceIcon name={s.icon} size={22} /></span>
                <p className="eyebrow">{s.tagline}</p>
                <h2>{s.title}</h2>
                <p className="service-detail__desc">{s.description}</p>
                <div className="service-detail__lists">
                  <div>
                    <h3>What's included</h3>
                    <ul className="check-list">
                      {s.included.map((x) => <li key={x}><Check size={17} aria-hidden="true" /> {x}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3>Customization options</h3>
                    <ul className="check-list check-list--sparkle">
                      {s.customizations.map((x) => <li key={x}><Sparkles size={16} aria-hidden="true" /> {x}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="service-detail__actions">
                  <Link to={`/contact?event=${s.slug}#enquiry`} className="btn btn--gold">
                    Enquire Now <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <a
                    href={whatsappLink(`Hello Momentra Events! I am interested in ${s.title}. Please share your packages and details.`)}
                    target="_blank" rel="noopener noreferrer" className="btn btn--outline"
                  >
                    <WhatsAppIcon size={18} /> Ask on WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="section section--ivory">
        <div className="container note-box">
          <h2>Vendors we coordinate</h2>
          <p>
            We connect you with reliable decorators, photographers, caterers, bakers, florists, venues and
            other service providers. Vendor charges are quoted separately and included in your package
            only when explicitly stated in your written quotation.
          </p>
          <Link to="/packages" className="btn btn--dark">See Packages <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
