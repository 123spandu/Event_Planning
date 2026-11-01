import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig.js';

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

/** Per-page SEO: title, description, Open Graph, canonical and robots. */
export function useDocumentMeta({ title, description, path = '', noindex = false }) {
  useEffect(() => {
    const full = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.tagline}`;
    document.title = full;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', full);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (siteConfig.siteUrl) {
      const url = `${siteConfig.siteUrl.replace(/\/$/, '')}${path}`;
      setMeta('property', 'og:url', url);
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  }, [title, description, path, noindex]);
}
