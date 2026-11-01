import { RefreshCw } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAsync, STATUSES, inr, fmtDate } from './useAsync.js';

export default function OverviewPanel({ goTo }) {
  const { data, error, loading, reload } = useAsync(() => api.stats());

  if (loading) return <p className="admin-muted">Loading overview…</p>;
  if (error) return <div className="form-alert form-alert--error">{error} <button className="link-btn" onClick={reload}>Retry</button></div>;

  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  data.byStatus.forEach((r) => { counts[r.status] = r.count; });

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <p className="admin-muted">Figures are calculated from enquiries saved in your database.</p>
        <button type="button" className="btn btn--outline btn--sm" onClick={reload}><RefreshCw size={16} /> Refresh</button>
      </div>
      <div className="stat-grid">
        <div className="stat"><span>Total enquiries</span><strong>{data.total}</strong></div>
        <div className="stat"><span>New (needs response)</span><strong>{counts.New}</strong></div>
        <div className="stat"><span>Confirmed bookings</span><strong>{counts.Confirmed}</strong></div>
        <div className="stat"><span>Completed events</span><strong>{counts.Completed}</strong></div>
        <div className="stat stat--gold"><span>Revenue (completed)</span><strong>{inr(data.revenueCompleted)}</strong></div>
        <div className="stat"><span>Booked value (confirmed)</span><strong>{inr(data.revenueConfirmed)}</strong></div>
        <div className="stat"><span>Open quotations</span><strong>{inr(data.quotedOpen)}</strong></div>
        <div className="stat"><span>Upcoming confirmed events</span><strong>{data.upcoming.length}</strong></div>
      </div>

      <div className="admin-card">
        <h2>Pipeline by status</h2>
        <div className="pipeline">
          {STATUSES.map((s) => (
            <div key={s} className={`pipeline__item status-${s.toLowerCase()}`}>
              <span>{s}</span><strong>{counts[s]}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__head">
          <h2>Upcoming confirmed events</h2>
          <button type="button" className="link-btn" onClick={() => goTo('enquiries')}>View all enquiries →</button>
        </div>
        {data.upcoming.length === 0 ? (
          <p className="admin-muted">No upcoming confirmed events.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Customer</th><th>Event</th><th>Location</th><th>Final amount</th></tr></thead>
              <tbody>
                {data.upcoming.map((e) => (
                  <tr key={e.id}>
                    <td>{fmtDate(e.event_date)}</td><td>{e.full_name}</td><td>{e.event_type}</td>
                    <td>{e.location}</td><td>{e.final_amount ? inr(e.final_amount) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
