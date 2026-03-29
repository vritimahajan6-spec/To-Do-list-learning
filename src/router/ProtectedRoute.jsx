/**
 * @file ProtectedRoute.jsx
 * @description Guards a route so only authenticated (and optionally, specific role) users can access it.
 *
 * Demonstrates:
 *  - Navigate (programmatic redirect) from react-router-dom
 *  - Spinner while auth state is being restored on page reload
 *  - Role-based access control
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

/**
 * @param {string} [requiredRole] - If set, user must have this role.
 */
export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Still checking stored tokens – show spinner to avoid flash of redirect
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted path so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
