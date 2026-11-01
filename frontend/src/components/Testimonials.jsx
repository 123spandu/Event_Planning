import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import { testimonials } from '../data/testimonials.js';

/**
 * Shows genuine testimonials from data/testimonials.js. When none have been
 * added yet, it shows an honest invitation instead of invented reviews.
 */
export default function Testimonials() {
  return (
    <section className="section section--ivory">
      <div className="container">
        <SectionHeading eyebrow="Kind Words" title="What Our Clients Say" />
        {testimonials.length > 0 ? (
          <div className="testimonials">
            {testimonials.map((t, i) => (
              <Reveal as="figure" key={`${t.name}-${i}`} delay={i * 100} className="testimonial">
                <Quote className="testimonial__icon" size={32} aria-hidden="true" />
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.event && <span>{t.event}</span>}
                </figcaption>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="testimonial-empty">
            <Quote size={36} aria-hidden="true" />
            <p className="testimonial-empty__title">Our story is just beginning.</p>
            <p>
              We are a new event planning studio in Bengaluru, and we only share genuine feedback from
              real clients. Reviews from the celebrations we plan will appear here – yours could be one
              of the first.
            </p>
            <Link to="/contact#enquiry" className="btn btn--outline">Plan your celebration</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
