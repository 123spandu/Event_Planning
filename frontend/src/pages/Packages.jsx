import { Link } from 'react-router-dom';
import { Info, ArrowRight, MapPin, Users, Package, Handshake, Palette } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import PackageCard from '../components/PackageCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import CTASection from '../components/CTASection.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { siteConfig } from '../config/siteConfig.js';
import { img } from '../data/images.js';

const factors = [
  { icon: MapPin, t: 'Event location' },
  { icon: Users, t: 'Guest count' },
  { icon: Package, t: 'Materials' },
  { icon: Handshake, t: 'Vendors' },
  { icon: Palette, t: 'Customization' },
];

const faqs = [
  { q: 'Are catering, venue and photography included?', a: 'No – unless explicitly specified in your written quotation. Packages cover decoration and coordination as listed. We can coordinate caterers, venues and photographers for you and quote their charges separately.' },
  { q: 'Can I customise a package?', a: 'Absolutely. Every package is a starting point. Tell us your theme, colours and requirements and we will build a quotation around them.' },
  { q: 'How do I confirm a booking?', a: 'After your enquiry, we share a detailed quotation. Your booking is confirmed only once you approve the quotation and the agreed advance is paid.' },
  { q: 'Do you plan events outside Bengaluru?', a: 'We primarily serve Bengaluru and nearby areas. For other locations, send us an enquiry and we will let you know what is possible.' },
];

export default function Packages() {
  useDocumentMeta({
    title: 'Event Packages & Pricing',
    description: 'Event decoration and planning packages in Bengaluru starting from ₹2,999. Mini Moments, Celebration Plus and Premium Experience – get a custom quote.',
    path: '/packages',
  });
  const { packages } = useContent();

  return (
    <>
      <PageHeader
        eyebrow="Packages & Pricing"
        title="Simple Packages, Honest Pricing"
        text="Choose a starting point – then we tailor everything to your celebration."
        image={img.sparklers}
        crumb="Packages"
      />

      <section className="section">
        <div className="container">
          <div className="package-grid">
            {packages.map((p, i) => <PackageCard key={p.slug} pkg={p} delay={i * 100} />)}
          </div>

          <Reveal className="disclaimer" id="pricing-terms">
            <Info size={22} aria-hidden="true" />
            <div>
              <h2>Important pricing information</h2>
              <p>{siteConfig.pricingDisclaimer}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <SectionHeading eyebrow="What affects the price" title="Your Final Quote Depends On" />
          <div className="factors">
            {factors.map(({ icon: Icon, t }, i) => (
              <Reveal key={t} delay={i * 70} className="factors__item">
                <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                <span>{t}</span>
              </Reveal>
            ))}
          </div>
          <div className="section__action">
            <Link to="/contact#enquiry" className="btn btn--gold">Get a Custom Quote <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading eyebrow="FAQs" title="Questions About Pricing" />
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Need Something Unique?" text="Tell us what you have in mind and we will create a custom plan and quotation just for you." />
    </>
  );
}
