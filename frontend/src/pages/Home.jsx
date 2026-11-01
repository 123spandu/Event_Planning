import { Link } from 'react-router-dom';
import {
  ArrowRight, HandHeart, Wallet, Handshake, ClipboardList, Palette, Smile,
  MessageCircle, ListChecks, Sparkles, PartyPopper,
} from 'lucide-react';
import SmartImage from '../components/SmartImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import Reveal from '../components/Reveal.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CTASection from '../components/CTASection.jsx';
import PackageCard from '../components/PackageCard.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { img } from '../data/images.js';

const reasons = [
  { icon: HandHeart, title: 'Personalized Event Planning', text: 'Every plan starts with you – your story, your style and the way you want the day to feel.' },
  { icon: Wallet, title: 'Budget-Friendly Packages', text: 'Clear starting prices and honest quotations, with options to suit intimate and grand budgets.' },
  { icon: Handshake, title: 'Trusted Vendor Network', text: 'We connect you with reliable decorators, photographers, caterers, bakers, florists and venues.' },
  { icon: ClipboardList, title: 'Complete Event Coordination', text: 'One point of contact who manages timelines, vendors and every moving part.' },
  { icon: Palette, title: 'Creative Decoration Concepts', text: 'Thoughtful themes, colour palettes and setups designed to look beautiful in person and in photos.' },
  { icon: Smile, title: 'Stress-Free Execution', text: 'We handle the setup and the details on the day, so you can be present with your guests.' },
];

const steps = [
  { icon: MessageCircle, title: 'Tell Us Your Requirements', text: 'Share your event type, date, guest count, budget and ideas through our form or WhatsApp.' },
  { icon: ListChecks, title: 'Choose Your Package', text: 'Pick a package or let us build a custom plan with a clear, itemised quotation.' },
  { icon: Sparkles, title: 'We Coordinate Everything', text: 'Decor, vendors, timelines and setup – we plan and manage it all from start to finish.' },
  { icon: PartyPopper, title: 'Enjoy Your Celebration', text: 'Arrive, relax and celebrate. We take care of the rest.' },
];

export default function Home() {
  useDocumentMeta({
    title: 'Event Planners in Bengaluru',
    description:
      'Momentra Events plans birthdays, surprise parties, proposals, anniversaries, baby showers, engagements and corporate events in Bengaluru. We Plan. You Celebrate.',
    path: '/',
  });
  const { services, gallery, packages } = useContent();
  const featured = gallery.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <SmartImage src={img.hero} alt="Elegant event decoration with flowers and warm lighting" className="hero__bg" eager />
        <div className="hero__overlay" />
        <div className="container hero__inner">
          <p className="hero__eyebrow"><span /> Event Planning · Bengaluru</p>
          <h1 className="hero__title">
            Turning Your Special Moments Into <em>Beautiful Memories.</em>
          </h1>
          <p className="hero__text">
            From intimate celebrations to grand occasions, we plan, organize, and create unforgettable experiences.
          </p>
          <div className="hero__actions">
            <Link to="/contact#enquiry" className="btn btn--gold btn--lg">
              Plan Your Event <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/services" className="btn btn--outline-light btn--lg">Explore Our Services</Link>
          </div>
          <ul className="hero__chips" aria-label="Popular celebrations">
            {['Birthdays', 'Proposals', 'Baby Showers', 'Engagements', 'Corporate'].map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <a href="#intro" className="hero__scroll" aria-label="Scroll to content"><span /></a>
      </section>

      {/* INTRO */}
      <section className="section intro" id="intro">
        <div className="container intro__grid">
          <Reveal className="intro__media">
            <SmartImage src={img.tableDecor} alt="Styled celebration table with candles and flowers" className="intro__img intro__img--main" />
            <SmartImage src={img.birthdayCake} alt="Decorated celebration cake" className="intro__img intro__img--small" />
            <div className="intro__badge">
              <span className="intro__badge-title">We Plan.</span>
              <span>You Celebrate.</span>
            </div>
          </Reveal>
          <Reveal className="intro__content" delay={120}>
            <p className="eyebrow">Welcome to Momentra Events</p>
            <h2>Thoughtfully planned celebrations, beautifully delivered.</h2>
            <p>
              Momentra Events is a Bengaluru-based event planning and management studio. We design
              decorations, coordinate trusted vendors and manage every detail of your event – so that
              you get to enjoy it, not organise it.
            </p>
            <p>
              Whether it is a cosy surprise at home or a family function for hundreds, we bring the same
              care, creativity and calm coordination to every celebration.
            </p>
            <Link to="/about" className="btn btn--dark">Our Story <ArrowRight size={18} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section section--ivory">
        <div className="container">
          <SectionHeading
            eyebrow="What We Do"
            title="Celebrations We Plan"
            text="From personal milestones to professional gatherings, every service is fully customisable to your theme, guest list and budget."
          />
          <div className="service-grid">
            {services.slice(0, 8).map((s, i) => <ServiceCard key={s.slug} service={s} delay={(i % 4) * 80} />)}
          </div>
          <div className="section__action">
            <Link to="/services" className="btn btn--outline">View All Services <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section section--dark why">
        <div className="container">
          <SectionHeading
            light
            eyebrow="Why Momentra"
            title="Why Choose Us"
            text="We keep planning simple, transparent and personal – so your celebration feels like yours."
          />
          <div className="why__grid">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 3) * 90} className="why__item">
                <span className="why__icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Inspiration"
            title="Featured Event Styles"
            text="A glimpse of the looks and moods we can create. Images shown are samples for inspiration."
          />
          <div className="featured-gallery">
            {featured.map((g, i) => (
              <Reveal key={g.src + i} delay={(i % 3) * 80} className={`featured-gallery__item fg-${i}`}>
                <Link to="/gallery" aria-label={`${g.title} – view gallery`}>
                  <SmartImage src={g.src} alt={g.title} />
                  <span className="featured-gallery__caption">
                    <small>{g.category}</small>
                    {g.title}
                  </span>
                  {g.isSample && <span className="sample-tag">Sample</span>}
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="section__action">
            <Link to="/gallery" className="btn btn--outline">Explore the Gallery <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--ivory">
        <div className="container">
          <SectionHeading eyebrow="Simple Process" title="How It Works" text="Four easy steps from first message to final celebration." />
          <ol className="steps">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 100} className="step">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step__icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Packages" title="Packages to Suit Every Celebration" text="Transparent starting prices – every package can be customised." />
          <div className="package-grid">
            {packages.map((p, i) => <PackageCard key={p.slug} pkg={p} delay={i * 100} />)}
          </div>
          <p className="price-note">
            Starting prices only. Final pricing depends on location, guest count, materials, vendors and customization.{' '}
            <Link to="/packages#pricing-terms">See pricing details</Link>.
          </p>
        </div>
      </section>

      <Testimonials />
      <CTASection />
    </>
  );
}
