import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Layers } from 'lucide-react';

export default function PollutantChart({ history, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <Layers size={20} className="icon-blue" />
            <h3>Pollutant Trends (PM2.5 vs PM10)</h3>
          </div>
        </div>
        <p className="no-data">Loading pollutant data...</p>
      </div>
    );
  }

  if (error || !history || history.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <Layers size={20} className="icon-blue" />
            <h3>Pollutant Trends (PM2.5 vs PM10)</h3>
          </div>
        </div>
        <p className="no-data">No historical pollutant readings available for chart.</p>
      </div>
    );
  }

  // Format and sort data chronologically
  const chartData = [...history]
    .sort((a, b) => new Date(a.recordedAt || a.createdAt) - new Date(b.recordedAt || b.createdAt))
    .slice(-15)
    .map((item) => ({
      time: new Date(item.recordedAt || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      'PM2.5': item.pm25 !== undefined ? item.pm25 : 0,
      'PM10': item.pm10 !== undefined ? item.pm10 : 0,
    }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <Layers size={20} className="icon-blue" />
          <h3>Pollutant Trends (PM2.5 & PM10)</h3>
        </div>
        <span className="chart-badge">Particulate Matter</span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
              formatter={(val, name) => [`${val} µg/m³`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="PM2.5" name="PM2.5 (µg/m³)" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            <Bar dataKey="PM10" name="PM10 (µg/m³)" fill="#c084fc" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
