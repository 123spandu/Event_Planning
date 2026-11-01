import { createContext, useContext, useEffect, useState } from 'react';
import { isApiEnabled } from '../config/siteConfig.js';
import { api, resolveMediaUrl } from '../services/api.js';
import { services as staticServices } from '../data/services.js';
import { packages as staticPackages } from '../data/packages.js';
import { galleryImages as staticGallery } from '../data/gallery.js';

const ContentContext = createContext(null);

/**
 * Provides services, packages and gallery images. Uses the static data files
 * immediately, then (if a backend is configured) replaces them with the
 * admin-managed content from the API. If the API is unreachable the static
 * content stays in place, so the public site always works.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState({
    services: staticServices,
    packages: staticPackages,
    gallery: staticGallery,
    source: 'static',
  });

  useEffect(() => {
    if (!isApiEnabled()) return;
    const ctrl = new AbortController();
    const opts = { signal: ctrl.signal };
    Promise.allSettled([api.getServices(opts), api.getPackages(opts), api.getGallery(opts)]).then(
      ([s, p, g]) => {
        if (ctrl.signal.aborted) return;
        setContent((prev) => ({
          services: s.status === 'fulfilled' && s.value?.length ? s.value : prev.services,
          packages: p.status === 'fulfilled' && p.value?.length ? p.value : prev.packages,
          gallery:
            g.status === 'fulfilled' && g.value?.length
              ? g.value.map((x) => ({ ...x, src: resolveMediaUrl(x.src) }))
              : prev.gallery,
          source: 'api',
        }));
      }
    );
    return () => ctrl.abort();
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
