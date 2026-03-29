/**
 * @file ErrorBoundary.jsx
 * @description Class component that catches JavaScript errors in any child component tree.
 *
 * WHY a class component?
 * ─────────────────────────────────────────────────────────────────────────────
 * As of React 18, error boundaries MUST be class components because they rely
 * on two lifecycle methods that have no functional-component equivalents:
 *   - static getDerivedStateFromError(error)  → updates state to show fallback UI
 *   - componentDidCatch(error, info)           → logs error details
 *
 * The React team has indicated a future hook (useErrorBoundary) is planned,
 * but has not been released in stable React yet.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Demonstrates: Class components, lifecycle methods, error boundaries.
 */

import { Component } from 'react';
import styles from '../../assets/styles/common.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Called when a descendant throws; update state to render fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after the component stack has been collected; good for logging
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you would send this to an error tracking service
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h2 className={styles.errorBoundaryTitle}>Something went wrong</h2>
          <p className={styles.errorBoundaryMessage}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          {import.meta.env.DEV && this.state.errorInfo && (
            <details className={styles.errorBoundaryDetails}>
              <summary>Stack trace</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button className={styles.errorBoundaryBtn} onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
