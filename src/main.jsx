/**
 * @file main.jsx
 * @description Application entry point.
 *
 * Demonstrates:
 *  - ReactDOM.createRoot (React 18 concurrent mode)
 *  - Wrapping the tree in multiple providers:
 *      QueryClientProvider  → React Query cache
 *      AuthProvider         → global auth state
 *      ThemeProvider        → light/dark theme
 *      BrowserRouter        → client-side routing
 *      Toaster              → toast notifications
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './assets/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
