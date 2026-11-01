import { Mail, MapPin, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { WhatsAppIcon, InstagramIcon } from '../components/BrandIcons.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { siteConfig } from '../config/siteConfig.js';
import { whatsappLink } from '../services/whatsapp.js';
import { img } from '../data/images.js';

export default function Contact() {
  useDocumentMeta({
    title: 'Contact Us & Book an Event',
    description: 'Send an event enquiry to Momentra Events, Bengaluru. Share your event type, date, guest count and budget, or chat with us on WhatsApp.',
    path: '/contact',
  });

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's Plan Something Beautiful"
        text="Tell us about your celebration – we would love to hear your ideas."
        image={img.planning}
        crumb="Contact Us"
      />

      <section className="section">
        <div className="container contact">
          <Reveal as="aside" className="contact__info">
            <h2>{siteConfig.name}</h2>
            <p className="contact__tagline">{siteConfig.tagline}</p>

            <ul className="contact__list">
              <li>
                <span className="contact__icon"><MapPin size={20} aria-hidden="true" /></span>
                <div>
                  <strong>Service area</strong>
                  <span>{siteConfig.serviceArea}, {siteConfig.state}</span>
                </div>
              </li>
              <li>
                <span className="contact__icon"><WhatsAppIcon size={20} /></span>
                <div>
                  <strong>WhatsApp</strong>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">Chat with us on WhatsApp</a>
                </div>
              </li>
              <li>
                <span className="contact__icon"><Mail size={20} aria-hidden="true" /></span>
                <div>
                  <strong>Email</strong>
                  {siteConfig.email
                    ? <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                    : <span className="muted">Email address coming soon</span>}
                </div>
              </li>
              <li>
                <span className="contact__icon"><InstagramIcon size={20} /></span>
                <div>
                  <strong>Instagram</strong>
                  {siteConfig.instagramUrl
                    ? <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Follow our work</a>
                    : <span className="muted">Instagram page coming soon</span>}
                </div>
              </li>
              <li>
                <span className="contact__icon"><Clock size={20} aria-hidden="true" /></span>
                <div>
                  <strong>Planning tip</strong>
                  <span>Enquire early – popular dates fill up quickly.</span>
                </div>
              </li>
            </ul>

            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--block">
              <WhatsAppIcon size={20} /> Chat on WhatsApp
            </a>
          </Reveal>

          <Reveal className="contact__form" id="enquiry" delay={100}>
            <p className="eyebrow">Event Enquiry</p>
            <h2>Book an Event</h2>
            <p className="contact__form-intro">
              Fill in the details below and we will get back to you with ideas and a tailored quotation.
              Fields marked * are required.
            </p>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
