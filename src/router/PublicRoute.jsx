// ============================================================
// PublicRoute.jsx
// Redirects already-authenticated users to /dashboard
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

export default function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner fullPage />;

  // Already logged in — redirect away from public pages
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}
