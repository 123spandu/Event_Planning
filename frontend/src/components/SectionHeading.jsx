import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, text, align = 'center', light = false }) {
  return (
    <Reveal className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p className="section-heading__text">{text}</p>}
    </Reveal>
  );
}
