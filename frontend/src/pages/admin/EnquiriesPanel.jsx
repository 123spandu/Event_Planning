import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, X, Trash2, Save, Phone, Mail } from 'lucide-react';
import { WhatsAppIcon } from '../../components/BrandIcons.jsx';
import { api } from '../../services/api.js';
import { useAsync, STATUSES, inr, fmtDate } from './useAsync.js';

export default function EnquiriesPanel() {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (query) p.set('q', query);
    const s = p.toString();
    return s ? `?${s}` : '';
  }, [status, query]);

  const { data, setData, error, loading, reload } = useAsync(() => api.listEnquiries(qs), [qs]);
  const rows = data || [];

  const onSaved = (updated) => {
    setData((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(updated);
  };
  const onDeleted = (id) => {
    setData((list) => list.filter((r) => r.id !== id));
    setSelected(null);
  };

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search name, phone, email, location…" value={q}
            onChange={(e) => setQ(e.target.value)} aria-label="Search enquiries" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button type="button" className="btn btn--outline btn--sm" onClick={reload}><RefreshCw size={16} /> Refresh</button>
      </div>

      {error && <div className="form-alert form-alert--error">{error}</div>}
      {loading && !data ? <p className="admin-muted">Loading enquiries…</p> : rows.length === 0 ? (
        <div className="admin-card"><p className="admin-muted">No enquiries found.</p></div>
      ) : (
        <div className="table-wrap admin-card admin-card--flush">
          <table className="admin-table admin-table--click">
            <thead>
              <tr><th>#</th><th>Received</th><th>Customer</th><th>Event</th><th>Event date</th><th>Guests</th><th>Budget</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setSelected(r)} tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(r)}>
                  <td>{r.id}</td>
                  <td>{fmtDate(r.created_at)}</td>
                  <td><strong>{r.full_name}</strong><br /><small>{r.phone}</small></td>
                  <td>{r.event_type}{r.package_name && <><br /><small>{r.package_name}</small></>}</td>
                  <td>{fmtDate(r.event_date)}</td>
                  <td>{r.guests}</td>
                  <td>{inr(r.budget)}</td>
                  <td><span className={`badge status-${r.status.toLowerCase()}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <EnquiryDrawer enquiry={selected} onClose={() => setSelected(null)} onSaved={onSaved} onDeleted={onDeleted} />
      )}
    </div>
  );
}

function EnquiryDrawer({ enquiry, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    status: enquiry.status,
    quoted_amount: enquiry.quoted_amount ?? '',
    final_amount: enquiry.final_amount ?? '',
    admin_notes: enquiry.admin_notes ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setForm({
      status: enquiry.status,
      quoted_amount: enquiry.quoted_amount ?? '',
      final_amount: enquiry.final_amount ?? '',
      admin_notes: enquiry.admin_notes ?? '',
    });
    setMsg(null);
  }, [enquiry.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const updated = await api.updateEnquiry(enquiry.id, {
        status: form.status,
        quoted_amount: form.quoted_amount === '' ? null : Number(form.quoted_amount),
        final_amount: form.final_amount === '' ? null : Number(form.final_amount),
        admin_notes: form.admin_notes,
      });
      onSaved(updated);
      setMsg({ type: 'success', text: 'Saved.' });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete enquiry #${enquiry.id} from ${enquiry.full_name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api.deleteEnquiry(enquiry.id);
      onDeleted(enquiry.id);
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
      setBusy(false);
    }
  };

  const phoneDigits = enquiry.phone.replace(/\D/g, '');
  const waNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits.replace(/^0/, '');

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label={`Enquiry #${enquiry.id}`}>
      <div className="drawer__backdrop" onClick={onClose} />
      <div className="drawer__panel">
        <div className="drawer__head">
          <h2>Enquiry #{enquiry.id}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={22} /></button>
        </div>
        <div className="drawer__body">
          <section className="detail-block">
            <h3>Customer</h3>
            <dl className="detail-list">
              <dt>Name</dt><dd>{enquiry.full_name}</dd>
              <dt>Phone</dt><dd>{enquiry.phone}</dd>
              <dt>Email</dt><dd>{enquiry.email}</dd>
            </dl>
            <div className="detail-actions">
              <a className="btn btn--outline btn--sm" href={`tel:${enquiry.phone}`}><Phone size={15} /> Call</a>
              <a className="btn btn--outline btn--sm" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={15} /> WhatsApp</a>
              <a className="btn btn--outline btn--sm" href={`mailto:${enquiry.email}`}><Mail size={15} /> Email</a>
            </div>
          </section>
          <section className="detail-block">
            <h3>Event</h3>
            <dl className="detail-list">
              <dt>Type</dt><dd>{enquiry.event_type}</dd>
              {enquiry.package_name && (<><dt>Package</dt><dd>{enquiry.package_name}</dd></>)}
              <dt>Date</dt><dd>{fmtDate(enquiry.event_date)}</dd>
              <dt>Location</dt><dd>{enquiry.location}</dd>
              <dt>Guests</dt><dd>{enquiry.guests}</dd>
              <dt>Budget</dt><dd>{inr(enquiry.budget)}</dd>
              <dt>Received</dt><dd>{new Date(enquiry.created_at).toLocaleString('en-IN')}</dd>
            </dl>
            {enquiry.requirements && (<><h4>Requirements</h4><p className="detail-text">{enquiry.requirements}</p></>)}
          </section>
          <section className="detail-block">
            <h3>Booking management</h3>
            <div className="field">
              <label htmlFor="enq-status">Status</label>
              <select id="enq-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="enq-quoted">Quoted amount (₹)</label>
                <input id="enq-quoted" type="number" min="0" value={form.quoted_amount}
                  onChange={(e) => setForm({ ...form, quoted_amount: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="enq-final">Final amount (₹)</label>
                <input id="enq-final" type="number" min="0" value={form.final_amount}
                  onChange={(e) => setForm({ ...form, final_amount: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="enq-notes">Internal notes</label>
              <textarea id="enq-notes" rows="4" value={form.admin_notes}
                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })} />
            </div>
            {msg && <p className={`inline-msg inline-msg--${msg.type}`} role="status">{msg.text}</p>}
          </section>
        </div>
        <div className="drawer__foot">
          <button type="button" className="btn btn--danger btn--sm" onClick={remove} disabled={busy}><Trash2 size={16} /> Delete</button>
          <button type="button" className="btn btn--dark" onClick={save} disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}
