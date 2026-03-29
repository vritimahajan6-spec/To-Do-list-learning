// ============================================================
// App.jsx — Root component
// Demonstrates: Context providers composition, QueryClient,
//               Toaster, ErrorBoundary, BrowserRouter
// ============================================================

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';

// Create a QueryClient instance (React Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    // ErrorBoundary: catches uncaught render errors in the tree
    <ErrorBoundary>
      {/* React Query provider — makes queryClient available everywhere */}
      <QueryClientProvider client={queryClient}>
        {/* ThemeProvider — provides theme context */}
        <ThemeProvider>
          {/* AuthProvider — provides auth context */}
          <AuthProvider>
            {/* BrowserRouter — provides routing context */}
            <BrowserRouter>
              <AppRouter />
              {/* react-hot-toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                  },
                }}
              />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
