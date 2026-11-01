import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import ServiceIcon from './ServiceIcon.jsx';
import Reveal from './Reveal.jsx';

export default function ServiceCard({ service, delay = 0 }) {
  return (
    <Reveal delay={delay} className="service-card">
      <Link to={`/services#${service.slug}`} className="service-card__link">
        <SmartImage src={service.image} alt={`${service.title} decoration`} className="service-card__img" />
        <div className="service-card__shade" />
        <div className="service-card__body">
          <span className="service-card__icon"><ServiceIcon name={service.icon} size={20} /></span>
          <h3>{service.title}</h3>
          <p>{service.tagline}</p>
          <span className="service-card__more">
            Explore <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
