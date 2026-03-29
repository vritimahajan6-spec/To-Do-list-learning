/**
 * @file AppRouter.jsx
 * @description Application route tree.
 *
 * Demonstrates:
 *  - React Router v6: Routes, Route, Navigate, Outlet
 *  - Nested routes with Layout wrapper
 *  - Protected and public route guards
 *  - React.lazy + Suspense for code-split lazy loading of ProfilePage
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import Spinner from '../components/common/Spinner';

// Lazy-load ProfilePage – demonstrates code splitting
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────────── */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Protected routes (require authentication) ─────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/profile"
            element={
              <Suspense
                fallback={
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Spinner size="lg" />
                  </div>
                }
              >
                <ProfilePage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* ── Index redirect ────────────────────────────────────────────── */}
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* ── 404 catch-all ─────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
