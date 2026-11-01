import { Link } from 'react-router-dom';
import { Target, Telescope, Compass, HandHeart, ArrowRight, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import SmartImage from '../components/SmartImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import CTASection from '../components/CTASection.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { img } from '../data/images.js';

const approach = [
  { title: 'Listen first', text: 'We begin with a conversation about you – the occasion, the people, the mood and the budget.' },
  { title: 'Design with purpose', text: 'We create a concept, colour palette and layout that suits your space and your style.' },
  { title: 'Coordinate the right vendors', text: 'We match you with decorators, photographers, caterers, bakers, florists and venues that fit the brief.' },
  { title: 'Execute with care', text: 'On the day, we manage setup, timing and vendors so everything flows smoothly.' },
];

export default function About() {
  useDocumentMeta({
    title: 'About Us',
    description: 'Momentra Events is a Bengaluru-based event planning studio. Learn about our story, mission, vision and approach to planning stress-free celebrations.',
    path: '/about',
  });

  return (
    <>
      <PageHeader
        eyebrow="About Momentra Events"
        title="Celebrations Planned With Heart"
        text="A Bengaluru-based event planning studio built on care, creativity and honest coordination."
        image={img.heroAlt}
        crumb="About Us"
      />

      <section className="section">
        <div className="container split">
          <Reveal className="split__media">
            <SmartImage src={img.floralDecor} alt="Floral event decoration" className="split__img" />
          </Reveal>
          <Reveal className="split__content" delay={120}>
            <p className="eyebrow">Our Story</p>
            <h2>Born from a simple belief: you should enjoy your own celebration.</h2>
            <p>
              Anyone who has planned a birthday, a proposal or a family function knows the feeling –
              endless calls to vendors, last-minute changes and a host who barely gets to enjoy the day.
              Momentra Events was started in Bengaluru to change that.
            </p>
            <p>
              We bring together creative decoration, a trusted network of event service providers and
              calm, organised coordination – so that your energy goes into the moment, not the logistics.
              Our name brings together <em>moments</em> and <em>mantra</em>: making every moment count is the
              principle we work by.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container mv-grid">
          <Reveal className="mv-card">
            <span className="mv-card__icon"><Target size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <h3>Our Mission</h3>
            <p>
              To make event planning simple, transparent and joyful for every family and organisation we
              work with – delivering beautiful celebrations that reflect their personality and respect their budget.
            </p>
          </Reveal>
          <Reveal className="mv-card" delay={100}>
            <span className="mv-card__icon"><Telescope size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <h3>Our Vision</h3>
            <p>
              To become Bengaluru's most trusted partner for personal and community celebrations, known
              for thoughtful design, dependable vendors and genuinely stress-free execution.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How We Work" title="Our Approach to Event Planning" />
          <div className="approach">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 90} className="approach__item">
                <span className="approach__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container split split--reverse">
          <Reveal className="split__media">
            <SmartImage src={img.weddingTable} alt="Elegant event table setting" className="split__img" />
          </Reveal>
          <Reveal className="split__content split__content--light" delay={120}>
            <p className="eyebrow">Our Commitment</p>
            <h2>Your satisfaction guides every decision we make.</h2>
            <ul className="check-list">
              {[
                'Clear, itemised quotations – no hidden charges',
                'Honest advice on what works for your space and budget',
                'One dedicated point of contact from planning to celebration',
                'Reliable vendors chosen for quality and punctuality',
                'Quick responses on WhatsApp and phone',
              ].map((t) => (
                <li key={t}><Check size={18} aria-hidden="true" /> {t}</li>
              ))}
            </ul>
            <Link to="/contact#enquiry" className="btn btn--gold">Start Planning <ArrowRight size={18} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container values">
          {[
            { icon: HandHeart, t: 'Care', d: 'We treat every event as if it were our own family celebration.' },
            { icon: Compass, t: 'Clarity', d: 'Clear plans, clear timelines and clear pricing.' },
            { icon: Target, t: 'Reliability', d: 'We do what we promise, when we promise it.' },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 90} className="values__item">
              <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
