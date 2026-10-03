import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error Boundary catch:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="error-icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
              <AlertTriangle size={36} color="#ef4444" />
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: '#f9fafb' }}>Something went wrong.</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              An unexpected error occurred in the application interface.
            </p>
            <button className="auth-submit-btn" onClick={this.handleReload} style={{ width: '100%' }}>
              <RefreshCw size={18} />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
