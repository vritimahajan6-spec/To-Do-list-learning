// ============================================================
// AppRouter.jsx
// Demonstrates: React Router v6, nested routes, React.lazy,
//               Suspense, Layout with Outlet
// ============================================================

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Spinner from '../components/common/Spinner';

// Page imports (some eager, ProfilePage lazy-loaded)
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

// React.lazy: ProfilePage is code-split and loaded on demand
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes — redirect if already authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected routes — wrapped in Layout (provides Header + Footer + Outlet) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* ProfilePage is lazy-loaded — Suspense shows fallback while loading */}
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Spinner />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
