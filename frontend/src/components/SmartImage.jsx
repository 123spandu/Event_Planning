import { useState } from 'react';

/**
 * Lazy-loaded image with a graceful, on-brand fallback so the site never
 * shows a broken image icon.
 */
export default function SmartImage({ src, alt, className = '', eager = false, sizes, ...rest }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  return (
    <span className={`smart-img ${className} is-${status}`}>
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={eager ? 'high' : undefined}
          sizes={sizes}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          {...rest}
        />
      )}
      {status === 'error' && (
        <span className="smart-img__fallback" role="img" aria-label={alt}>
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M13 33V15l11 11 11-11v18" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{alt}</span>
        </span>
      )}
    </span>
  );
}
