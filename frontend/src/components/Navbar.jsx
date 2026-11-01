import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, CalendarCheck } from 'lucide-react';
import Logo from './Logo.jsx';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className={`navbar ${solid ? 'navbar--solid' : ''}`}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Momentra Events – Home">
          <Logo light={!solid} />
        </Link>

        <nav className="navbar__links" aria-label="Main">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="navbar__link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact#enquiry" className="btn btn--gold btn--sm navbar__cta">
          <CalendarCheck size={16} aria-hidden="true" /> Book an Event
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          {navLinks.map((l, i) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className="mobile-menu__link"
              style={{ transitionDelay: `${i * 40}ms` }}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact#enquiry" className="btn btn--gold btn--block">
            <CalendarCheck size={18} aria-hidden="true" /> Book an Event
          </Link>
        </nav>
      </div>
    </header>
  );
}
