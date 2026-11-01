import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Inbox, Sparkles, Package, Images, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';
import OverviewPanel from './OverviewPanel.jsx';
import EnquiriesPanel from './EnquiriesPanel.jsx';
import ServicesPanel from './ServicesPanel.jsx';
import PackagesPanel from './PackagesPanel.jsx';
import GalleryPanel from './GalleryPanel.jsx';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, Panel: OverviewPanel },
  { id: 'enquiries', label: 'Enquiries & Bookings', icon: Inbox, Panel: EnquiriesPanel },
  { id: 'services', label: 'Services', icon: Sparkles, Panel: ServicesPanel },
  { id: 'packages', label: 'Packages & Prices', icon: Package, Panel: PackagesPanel },
  { id: 'gallery', label: 'Gallery', icon: Images, Panel: GalleryPanel },
];

export default function AdminDashboard() {
  useDocumentMeta({ title: 'Admin Dashboard', noindex: true });
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [menu, setMenu] = useState(false);
  const { Panel, label } = tabs.find((t) => t.id === tab);

  return (
    <div className="admin">
      <aside className={`admin__sidebar ${menu ? 'is-open' : ''}`}>
        <div className="admin__brand"><Logo light /></div>
        <nav aria-label="Admin">
          {tabs.map(({ id, label: l, icon: Icon }) => (
            <button key={id} type="button" className={`admin__nav ${tab === id ? 'is-active' : ''}`}
              aria-current={tab === id ? 'page' : undefined}
              onClick={() => { setTab(id); setMenu(false); }}>
              <Icon size={18} aria-hidden="true" /> {l}
            </button>
          ))}
        </nav>
        <div className="admin__sidebar-foot">
          <Link to="/" target="_blank" className="admin__nav"><ExternalLink size={18} aria-hidden="true" /> View website</Link>
          <button type="button" className="admin__nav" onClick={logout}><LogOut size={18} aria-hidden="true" /> Log out</button>
        </div>
      </aside>
      <div className="admin__main">
        <header className="admin__top">
          <button type="button" className="admin__menu-btn" onClick={() => setMenu((m) => !m)} aria-label="Toggle admin menu">
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1>{label}</h1>
          <span className="admin__user">{admin?.name || admin?.email}</span>
        </header>
        <div className="admin__content">
          <Panel goTo={setTab} />
        </div>
      </div>
    </div>
  );
}
