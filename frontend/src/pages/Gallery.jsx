import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import SmartImage from '../components/SmartImage.jsx';
import CTASection from '../components/CTASection.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { galleryCategories } from '../data/gallery.js';
import { img } from '../data/images.js';

export default function Gallery() {
  useDocumentMeta({
    title: 'Event Decoration Gallery',
    description: 'Browse birthday decorations, surprise setups, romantic proposals, anniversaries, baby showers, engagements and corporate event styles.',
    path: '/gallery',
  });
  const { gallery } = useContent();
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null); // index into `items`

  const categories = useMemo(() => {
    const extra = [...new Set(gallery.map((g) => g.category))].filter((c) => !galleryCategories.includes(c));
    return ['All', ...galleryCategories, ...extra];
  }, [gallery]);

  const items = useMemo(
    () => (filter === 'All' ? gallery : gallery.filter((g) => g.category === filter)),
    [gallery, filter]
  );
  const hasSamples = gallery.some((g) => g.isSample);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((d) => setActive((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (active === null) return;
    document.body.classList.add('no-scroll');
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  const current = active !== null ? items[active] : null;

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments & Inspiration"
        text="Explore decoration styles and setups to spark ideas for your own celebration."
        image={img.lights}
        crumb="Gallery"
      />

      <section className="section">
        <div className="container">
          {hasSamples && (
            <p className="gallery-note">
              <Info size={18} aria-hidden="true" />
              Images marked <strong>“Sample”</strong> are demonstration and inspiration photographs, not
              events delivered by Momentra Events. Our own event photographs will be added here soon.
            </p>
          )}

          <div className="filters" role="toolbar" aria-label="Filter gallery by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-chip ${filter === c ? 'is-active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="empty-state">No images in this category yet – check back soon.</p>
          ) : (
            <div className="masonry">
              {items.map((g, i) => (
                <button
                  type="button"
                  key={`${g.src}-${i}`}
                  className="masonry__item"
                  onClick={() => setActive(i)}
                  aria-label={`Open image: ${g.title}`}
                >
                  <SmartImage src={g.src} alt={g.title} />
                  <span className="masonry__caption">
                    <small>{g.category}</small>
                    {g.title}
                  </span>
                  {g.isSample && <span className="sample-tag">Sample</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <button type="button" className="lightbox__close" onClick={close} aria-label="Close" autoFocus>
            <X size={28} />
          </button>
          {items.length > 1 && (
            <>
              <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); step(-1); }}>
                <ChevronLeft size={32} />
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); step(1); }}>
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <SmartImage key={current.src} src={current.src} alt={current.title} eager />
            <figcaption>
              <span>{current.category}{current.isSample ? ' · Sample image' : ''}</span>
              {current.title}
              <small>{active + 1} / {items.length}</small>
            </figcaption>
          </figure>
        </div>
      )}

      <CTASection title="Love What You See?" text="Tell us which style you like and we will design something unique for your celebration." />
    </>
  );
}
