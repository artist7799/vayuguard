import React from 'react';
import { MapPin, Globe } from 'lucide-react';

export const INITIAL_LOCATIONS = ['New Delhi', 'New York', 'Los Angeles', 'Tokyo', 'London'];

export default function LocationSelector({ selectedLocation, onSelectLocation }) {
  return (
    <div className="location-selector-container">
      <div className="location-selector-header">
        <Globe size={18} className="icon-emerald" />
        <label htmlFor="location-select" className="location-selector-label">
          Monitoring Station Location:
        </label>
      </div>

      <div className="location-buttons-grid">
        {INITIAL_LOCATIONS.map((loc) => {
          const isSelected = selectedLocation === loc;
          return (
            <button
              key={loc}
              type="button"
              className={`location-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectLocation(loc)}
              aria-pressed={isSelected}
            >
              <MapPin size={14} className="chip-icon" />
              <span>{loc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
