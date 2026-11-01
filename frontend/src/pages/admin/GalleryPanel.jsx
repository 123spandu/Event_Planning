import { useRef, useState } from 'react';
import { Upload, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { api, resolveMediaUrl } from '../../services/api.js';
import { useAsync } from './useAsync.js';
import SmartImage from '../../components/SmartImage.jsx';
import { galleryCategories } from '../../data/gallery.js';

export default function GalleryPanel() {
  const { data, setData, error, loading, reload } = useAsync(() => api.adminGallery());
  const [form, setForm] = useState({ title: '', category: galleryCategories[0], isSample: false });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg({ type: 'error', text: 'Choose an image to upload.' });
    if (!form.title.trim()) return setMsg({ type: 'error', text: 'Add a short title for the image.' });
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', form.title.trim());
    fd.append('category', form.category);
    fd.append('isSample', String(form.isSample));
    setBusy(true); setMsg(null);
    try {
      await api.uploadGalleryImage(fd);
      setForm((f) => ({ ...f, title: '' }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setMsg({ type: 'success', text: 'Image uploaded.' });
      reload();
    } catch (e2) {
      setMsg({ type: 'error', text: e2.message });
    } finally { setBusy(false); }
  };

  const toggle = async (g, key) => {
    try {
      const updated = await api.updateGalleryImage(g.id, { [key]: !g[key] });
      setData((list) => list.map((x) => (x.id === g.id ? updated : x)));
    } catch (e) { alert(e.message); }
  };

  const remove = async (g) => {
    if (!window.confirm(`Delete "${g.title}"?`)) return;
    try { await api.deleteGalleryImage(g.id); setData((l) => l.filter((x) => x.id !== g.id)); } catch (e) { alert(e.message); }
  };

  const copy = (g) => navigator.clipboard?.writeText(resolveMediaUrl(g.src)).then(() => setMsg({ type: 'success', text: 'Image URL copied.' }));

  return (
    <div className="admin-stack">
      <form className="admin-card upload-form" onSubmit={upload}>
        <h2>Upload a photo</h2>
        <div className="form-grid">
          <div className="field"><label htmlFor="g-file">Image (JPG, PNG or WebP, max 5 MB)</label>
            <input id="g-file" ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <div className="field"><label htmlFor="g-title">Title</label>
            <input id="g-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Pastel birthday setup, Whitefield" /></div>
          <div className="field"><label htmlFor="g-cat">Category</label>
            <select id="g-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {galleryCategories.map((c) => <option key={c}>{c}</option>)}
            </select></div>
          <div className="field field--center">
            <label className="checkbox"><input type="checkbox" checked={form.isSample} onChange={(e) => setForm({ ...form, isSample: e.target.checked })} /> Mark as sample / inspiration image</label>
          </div>
        </div>
        {msg && <p className={`inline-msg inline-msg--${msg.type}`} role="status">{msg.text}</p>}
        <button type="submit" className="btn btn--dark" disabled={busy}><Upload size={16} /> {busy ? 'Uploading…' : 'Upload'}</button>
      </form>

      {error && <div className="form-alert form-alert--error">{error}</div>}
      {loading && !data ? <p className="admin-muted">Loading…</p> : (
        <div className="admin-gallery">
          {(data || []).map((g) => (
            <div key={g.id} className={`admin-gallery__item ${g.is_active ? '' : 'is-hidden'}`}>
              <SmartImage src={resolveMediaUrl(g.src)} alt={g.title} />
              <div className="admin-gallery__info">
                <strong>{g.title}</strong>
                <small>{g.category}{g.isSample ? ' · Sample' : ''}{!g.is_active ? ' · Hidden' : ''}</small>
              </div>
              <div className="admin-gallery__actions">
                <button type="button" className="icon-btn" onClick={() => toggle(g, 'is_active')} aria-label={g.is_active ? 'Hide from website' : 'Show on website'} title={g.is_active ? 'Hide' : 'Show'}>
                  {g.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button type="button" className="icon-btn" onClick={() => toggle(g, 'isSample')} title="Toggle sample label" aria-label="Toggle sample label">S</button>
                <button type="button" className="icon-btn" onClick={() => copy(g)} aria-label="Copy image URL" title="Copy URL"><Copy size={16} /></button>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => remove(g)} aria-label="Delete image" title="Delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
