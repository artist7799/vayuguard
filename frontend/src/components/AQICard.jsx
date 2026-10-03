import React from 'react';
import { Wind, Clock, MapPin } from 'lucide-react';
import { getAqiCategory, getAqiCategoryColor, getAqiCategoryBg, getAqiDescription, getRelativeTime } from '../utils/aqi';

export default function AQICard({ reading }) {
  if (!reading) {
    return (
      <div className="aqi-card empty-aqi">
        <div className="aqi-card-header">
          <div className="aqi-card-title">
            <Wind size={22} />
            <span>Air Quality Index (AQI)</span>
          </div>
        </div>
        <div className="aqi-card-body">
          <p className="no-data-text">No active AQI reading available.</p>
        </div>
      </div>
    );
  }

  const category = reading.aqiCategory || getAqiCategory(reading.aqi);
  const color = getAqiCategoryColor(category);
  const bgColor = getAqiCategoryBg(category);
  const description = getAqiDescription(category);
  const relativeTime = getRelativeTime(reading.recordedAt || reading.createdAt);

  return (
    <div className="aqi-card" style={{ borderColor: color }}>
      <div className="aqi-card-header">
        <div className="aqi-card-title">
          <Wind size={22} style={{ color }} />
          <span>Air Quality Index (AQI)</span>
        </div>
        <div className="aqi-timestamp">
          <Clock size={14} />
          <span>Updated: {relativeTime}</span>
        </div>
      </div>

      <div className="aqi-card-body">
        <div className="aqi-value-display">
          <span className="aqi-number" style={{ color }}>{reading.aqi}</span>
          <div className="aqi-category-pill" style={{ backgroundColor: bgColor, color }}>
            {category}
          </div>
        </div>

        <div className="aqi-meta">
          <div className="aqi-location">
            <MapPin size={18} style={{ color }} />
            <span>{reading.location}</span>
          </div>
          <p className="aqi-description">{description}</p>
        </div>
      </div>
    </div>
  );
}
