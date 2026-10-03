import React from 'react';
import { Thermometer, Droplets, MapPin, Compass, Clock, Cloud } from 'lucide-react';
import { getRelativeTime } from '../utils/aqi';

export default function EnvironmentalCard({ reading }) {
  if (!reading) return null;

  const formattedTime = reading.recordedAt || reading.createdAt 
    ? new Date(reading.recordedAt || reading.createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const relativeTime = reading.recordedAt || reading.createdAt
    ? getRelativeTime(reading.recordedAt || reading.createdAt)
    : 'Recently';

  return (
    <div className="environmental-card">
      <div className="section-title">
        <Cloud size={20} className="icon-blue" />
        <h3>Environmental Information</h3>
      </div>

      <div className="env-grid">
        <div className="env-item">
          <div className="env-item-icon amber-bg">
            <Thermometer size={20} className="icon-amber" />
          </div>
          <div className="env-item-details">
            <span className="env-label">Temperature</span>
            <span className="env-value">
              {reading.temperature !== undefined && reading.temperature !== null ? `${reading.temperature}°C` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="env-item">
          <div className="env-item-icon blue-bg">
            <Droplets size={20} className="icon-blue" />
          </div>
          <div className="env-item-details">
            <span className="env-label">Humidity</span>
            <span className="env-value">
              {reading.humidity !== undefined && reading.humidity !== null ? `${reading.humidity}%` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="env-item">
          <div className="env-item-icon emerald-bg">
            <MapPin size={20} className="icon-emerald" />
          </div>
          <div className="env-item-details">
            <span className="env-label">Location</span>
            <span className="env-value">{reading.location || 'N/A'}</span>
          </div>
        </div>

        <div className="env-item">
          <div className="env-item-icon purple-bg">
            <Compass size={20} className="icon-purple" />
          </div>
          <div className="env-item-details">
            <span className="env-label">Coordinates (Lat / Lng)</span>
            <span className="env-value">
              {reading.latitude !== undefined && reading.longitude !== undefined 
                ? `${reading.latitude}, ${reading.longitude}` 
                : 'N/A'}
            </span>
          </div>
        </div>

        <div className="env-item full-width-item">
          <div className="env-item-icon gray-bg">
            <Clock size={20} className="icon-gray" />
          </div>
          <div className="env-item-details">
            <span className="env-label">Recorded Timestamp</span>
            <span className="env-value">{formattedTime} ({relativeTime})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
