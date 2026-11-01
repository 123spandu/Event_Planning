export default function Logo({ light = false, compact = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg className="logo__mark" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M13 33V15l11 11 11-11v18" fill="none" stroke="currentColor" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="logo__text">
          <span className="logo__name">Momentra</span>
          <span className="logo__sub">Events</span>
        </span>
      )}
    </span>
  );
}
