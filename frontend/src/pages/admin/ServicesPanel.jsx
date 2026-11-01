import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { api, resolveMediaUrl } from '../../services/api.js';
import { useAsync } from './useAsync.js';
import SmartImage from '../../components/SmartImage.jsx';

const ICONS = ['Cake', 'Gift', 'Heart', 'Sparkles', 'Baby', 'Flower2', 'Gem', 'Briefcase', 'PartyPopper', 'Users'];
const blank = { slug: '', title: '', icon: 'Sparkles', image: '', tagline: '', description: '', included: [], customizations: [], sort_order: 0, is_active: true };

export default function ServicesPanel() {
  const { data, error, loading, reload } = useAsync(() => api.adminServices());
  const [editing, setEditing] = useState(null);

  const remove = async (s) => {
    if (!window.confirm(`Delete service "${s.title}"?`)) return;
    try { await api.deleteService(s.id); reload(); } catch (e) { alert(e.message); }
  };

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <p className="admin-muted">Services shown on the website. Inactive services are hidden from visitors.</p>
        <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(blank)}><Plus size={16} /> Add service</button>
      </div>
      {error && <div className="form-alert form-alert--error">{error}</div>}
      {loading && !data ? <p className="admin-muted">Loading…</p> : (
        <div className="admin-list">
          {(data || []).map((s) => (
            <div key={s.id} className="admin-list__item">
              <SmartImage src={resolveMediaUrl(s.image)} alt={s.title} className="admin-thumb" />
              <div className="admin-list__info">
                <strong>{s.title}</strong>
                <small>{s.tagline}</small>
                {!s.is_active && <span className="badge status-cancelled">Hidden</span>}
              </div>
              <div className="admin-list__actions">
                <button type="button" className="icon-btn" onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`}><Pencil size={16} /></button>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(s)} aria-label={`Delete ${s.title}`}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && <ServiceForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </div>
  );
}

function ServiceForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState({
    ...initial,
    included: (initial.included || []).join('\n'),
    customizations: (initial.customizations || []).join('\n'),
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim() || !f.slug.trim()) return setErr('Title and slug are required.');
    setBusy(true); setErr('');
    const body = {
      ...f,
      slug: f.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      included: f.included.split('\n').map((x) => x.trim()).filter(Boolean),
      customizations: f.customizations.split('\n').map((x) => x.trim()).filter(Boolean),
      sort_order: Number(f.sort_order) || 0,
    };
    try {
      if (initial.id) await api.updateService(initial.id, body); else await api.createService(body);
      onSaved();
    } catch (e2) { setErr(e2.message); setBusy(false); }
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Edit service">
      <div className="drawer__backdrop" onClick={onClose} />
      <form className="drawer__panel" onSubmit={submit}>
        <div className="drawer__head">
          <h2>{initial.id ? 'Edit service' : 'New service'}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={22} /></button>
        </div>
        <div className="drawer__body">
          {err && <div className="form-alert form-alert--error">{err}</div>}
          <div className="form-grid">
            <div className="field"><label htmlFor="sv-title">Title *</label><input id="sv-title" value={f.title} onChange={set('title')} /></div>
            <div className="field"><label htmlFor="sv-slug">Slug (URL id) *</label><input id="sv-slug" value={f.slug} onChange={set('slug')} placeholder="birthday-parties" /></div>
            <div className="field"><label htmlFor="sv-icon">Icon</label>
              <select id="sv-icon" value={f.icon} onChange={set('icon')}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
            <div className="field"><label htmlFor="sv-order">Display order</label><input id="sv-order" type="number" value={f.sort_order} onChange={set('sort_order')} /></div>
          </div>
          <div className="field"><label htmlFor="sv-tagline">Tagline</label><input id="sv-tagline" value={f.tagline} onChange={set('tagline')} /></div>
          <div className="field"><label htmlFor="sv-image">Image URL</label><input id="sv-image" value={f.image} onChange={set('image')} placeholder="https://… or /uploads/…" />
            <span className="field__hint">Tip: upload a photo in the Gallery tab and paste its URL here.</span></div>
          <div className="field"><label htmlFor="sv-desc">Description</label><textarea id="sv-desc" rows="4" value={f.description} onChange={set('description')} /></div>
          <div className="field"><label htmlFor="sv-inc">What's included (one per line)</label><textarea id="sv-inc" rows="5" value={f.included} onChange={set('included')} /></div>
          <div className="field"><label htmlFor="sv-cus">Customization options (one per line)</label><textarea id="sv-cus" rows="4" value={f.customizations} onChange={set('customizations')} /></div>
          <label className="checkbox"><input type="checkbox" checked={Boolean(f.is_active)} onChange={set('is_active')} /> Show on website</label>
        </div>
        <div className="drawer__foot">
          <button type="button" className="btn btn--outline btn--sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--dark" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
