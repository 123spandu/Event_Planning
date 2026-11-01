import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';

export default function NotFound() {
  useDocumentMeta({ title: 'Page Not Found', noindex: true });
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>This page has left the party.</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--gold">Back to Home</Link>
          <Link to="/contact#enquiry" className="btn btn--outline">Plan an Event</Link>
        </div>
      </div>
    </section>
  );
}
