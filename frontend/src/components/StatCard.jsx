import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Layers, Activity, Database } from 'lucide-react';

export default function StatCard({ summary }) {
  if (!summary) return null;

  const formatVal = (val, suffix = '') => {
    if (val === undefined || val === null) return 'N/A';
    if (typeof val === 'number') {
      return `${val}${suffix}`;
    }
    return `${val}${suffix}`;
  };

  const stats = [
    { label: 'Average AQI', value: formatVal(summary.averageAqi), icon: TrendingUp, color: '#38bdf8' },
    { label: 'Minimum AQI', value: formatVal(summary.minimumAqi), icon: TrendingDown, color: '#34d399' },
    { label: 'Maximum AQI', value: formatVal(summary.maximumAqi), icon: Activity, color: '#f87171' },
    { label: 'Avg PM2.5', value: formatVal(summary.averagePm25, ' µg/m³'), icon: Layers, color: '#fbbf24' },
    { label: 'Avg PM10', value: formatVal(summary.averagePm10, ' µg/m³'), icon: Layers, color: '#c084fc' },
    { label: 'Total Readings', value: formatVal(summary.numberOfReadings), icon: Database, color: '#a7f3d0' },
  ];

  return (
    <div className="stats-section">
      <div className="section-title">
        <BarChart3 size={20} className="icon-blue" />
        <h3>AQI Statistics Summary ({summary.location || 'All Locations'})</h3>
      </div>

      <div className="stats-grid">
        {stats.map((s) => {
          const IconComp = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon-bg" style={{ backgroundColor: `${s.color}15` }}>
                <IconComp size={20} style={{ color: s.color }} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
