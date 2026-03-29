// ============================================================
// main.jsx — React entry point
// Demonstrates: ReactDOM.createRoot (React 18), StrictMode
// ============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/global.css';
import App from './App';

// React 18 concurrent rendering
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
