import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'Unable to load air-quality data.', onRetry }) {
  return (
    <div className="error-card">
      <div className="error-icon-wrapper">
        <AlertTriangle size={32} />
      </div>
      <div className="error-content">
        <h4>Connection Error</h4>
        <p>{message}</p>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
}
