import React from 'react';
import { Database, RefreshCw } from 'lucide-react';

export default function EmptyState({ 
  message = 'No air-quality readings available for this location.', 
  onRefresh 
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <Database size={40} />
      </div>
      <h3>No Data Available</h3>
      <p>{message}</p>
      {onRefresh && (
        <button className="action-btn refresh-btn" onClick={onRefresh}>
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </button>
      )}
    </div>
  );
}
