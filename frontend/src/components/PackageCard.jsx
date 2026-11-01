import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { formatPrice } from '../config/siteConfig.js';

export default function PackageCard({ pkg, delay = 0 }) {
  return (
    <Reveal delay={delay} className={`package-card ${pkg.highlighted ? 'package-card--featured' : ''}`}>
      {pkg.highlighted && <span className="package-card__badge">Most Popular</span>}
      <h3 className="package-card__name">{pkg.name}</h3>
      {pkg.subtitle && <p className="package-card__subtitle">{pkg.subtitle}</p>}
      <div className="package-card__price">
        <span className="package-card__from">Starting from</span>
        <span className="package-card__amount">{formatPrice(pkg.price)}</span>
      </div>
      <ul className="package-card__features">
        {pkg.features.map((f) => (
          <li key={f}><Check size={18} aria-hidden="true" /> {f}</li>
        ))}
      </ul>
      <Link
        to={`/contact?package=${encodeURIComponent(pkg.slug)}#enquiry`}
        className={`btn btn--block ${pkg.highlighted ? 'btn--gold' : 'btn--dark'}`}
      >
        Get Custom Quote <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}
