import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, LoaderCircle, CircleAlert, Eye, EyeOff } from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { isApiEnabled } from '../../config/siteConfig.js';
import { useDocumentMeta } from '../../hooks/useDocumentMeta.js';

export default function AdminLogin() {
  useDocumentMeta({ title: 'Admin Login', noindex: true });
  const { admin, login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      nav(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <Logo />
        <h1>Admin Login</h1>
        {!isApiEnabled() ? (
          <div className="form-alert form-alert--info">
            <CircleAlert size={20} aria-hidden="true" />
            <div>
              <strong>The admin dashboard needs the backend.</strong>
              <p>Set <code>VITE_API_URL</code> in the frontend <code>.env</code> and start the API server. See the README for setup steps.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {error && (
              <div className="form-alert form-alert--error" role="alert">
                <CircleAlert size={20} aria-hidden="true" /><div>{error}</div>
              </div>
            )}
            <div className="field">
              <label htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="admin-password">Password</label>
              <div className="input-with-btn">
                <input id="admin-password" type={show ? 'text' : 'password'} autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn--dark btn--block" disabled={busy}>
              {busy ? <LoaderCircle size={18} className="spin" aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
        <Link to="/" className="admin-auth__back">← Back to website</Link>
      </div>
    </div>
  );
}
