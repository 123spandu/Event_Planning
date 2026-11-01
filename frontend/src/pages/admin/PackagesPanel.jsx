import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAsync, inr } from './useAsync.js';

const blank = { slug: '', name: '', price: '', subtitle: '', features: [], highlighted: false, sort_order: 0, is_active: true };

export default function PackagesPanel() {
  const { data, error, loading, reload } = useAsync(() => api.adminPackages());
  const [editing, setEditing] = useState(null);

  const remove = async (p) => {
    if (!window.confirm(`Delete package "${p.name}"?`)) return;
    try { await api.deletePackage(p.id); reload(); } catch (e) { alert(e.message); }
  };

  return (
    <div className="admin-stack">
      <div className="admin-toolbar">
        <p className="admin-muted">Edit package names, starting prices and inclusions. Changes appear on the website immediately.</p>
        <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(blank)}><Plus size={16} /> Add package</button>
      </div>
      {error && <div className="form-alert form-alert--error">{error}</div>}
      {loading && !data ? <p className="admin-muted">Loading…</p> : (
        <div className="admin-pkg-grid">
          {(data || []).map((p) => (
            <div key={p.id} className={`admin-card admin-pkg ${p.highlighted ? 'admin-pkg--hl' : ''}`}>
              <div className="admin-card__head">
                <h2>{p.name}</h2>
                <div className="admin-list__actions">
                  <button type="button" className="icon-btn" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}><Pencil size={16} /></button>
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(p)} aria-label={`Delete ${p.name}`}><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="admin-pkg__price">from {inr(p.price)}</p>
              <ul>{p.features.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="admin-pkg__tags">
                {p.highlighted && <span className="badge status-quoted">Highlighted</span>}
                {!p.is_active && <span className="badge status-cancelled">Hidden</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && <PackageForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </div>
  );
}

function PackageForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState({ ...initial, features: (initial.features || []).join('\n') });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.slug.trim()) return setErr('Name and slug are required.');
    if (!(Number(f.price) >= 0) || f.price === '') return setErr('Enter a valid price.');
    setBusy(true); setErr('');
    const body = {
      ...f,
      slug: f.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      price: Number(f.price),
      sort_order: Number(f.sort_order) || 0,
      features: f.features.split('\n').map((x) => x.trim()).filter(Boolean),
    };
    try {
      if (initial.id) await api.updatePackage(initial.id, body); else await api.createPackage(body);
      onSaved();
    } catch (e2) { setErr(e2.message); setBusy(false); }
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Edit package">
      <div className="drawer__backdrop" onClick={onClose} />
      <form className="drawer__panel" onSubmit={submit}>
        <div className="drawer__head">
          <h2>{initial.id ? 'Edit package' : 'New package'}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={22} /></button>
        </div>
        <div className="drawer__body">
          {err && <div className="form-alert form-alert--error">{err}</div>}
          <div className="form-grid">
            <div className="field"><label htmlFor="pk-name">Name *</label><input id="pk-name" value={f.name} onChange={set('name')} /></div>
            <div className="field"><label htmlFor="pk-slug">Slug *</label><input id="pk-slug" value={f.slug} onChange={set('slug')} placeholder="mini-moments" /></div>
            <div className="field"><label htmlFor="pk-price">Starting price (₹) *</label><input id="pk-price" type="number" min="0" value={f.price} onChange={set('price')} /></div>
            <div className="field"><label htmlFor="pk-order">Display order</label><input id="pk-order" type="number" value={f.sort_order} onChange={set('sort_order')} /></div>
          </div>
          <div className="field"><label htmlFor="pk-sub">Subtitle</label><input id="pk-sub" value={f.subtitle} onChange={set('subtitle')} /></div>
          <div className="field"><label htmlFor="pk-feat">Features (one per line)</label><textarea id="pk-feat" rows="6" value={f.features} onChange={set('features')} /></div>
          <label className="checkbox"><input type="checkbox" checked={Boolean(f.highlighted)} onChange={set('highlighted')} /> Highlight as “Most Popular”</label>
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
