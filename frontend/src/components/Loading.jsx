import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading environmental telemetry...' }) {
  return (
    <div className="loading-state">
      <Loader2 size={36} className="spinner" />
      <p>{message}</p>
    </div>
  );
}
