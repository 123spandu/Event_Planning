import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, checking } = useAuth();
  const location = useLocation();
  if (checking) return <div className="admin-loading">Checking your session…</div>;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return children;
}
