import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function AQIHistoryChart({ history, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <TrendingUp size={20} className="icon-emerald" />
            <h3>AQI Telemetry History</h3>
          </div>
        </div>
        <p className="no-data">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <TrendingUp size={20} className="icon-emerald" />
            <h3>AQI Telemetry History</h3>
          </div>
        </div>
        <p className="no-data error-text">Unable to load AQI history chart.</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <TrendingUp size={20} className="icon-emerald" />
            <h3>AQI Telemetry History</h3>
          </div>
        </div>
        <p className="no-data">No historical AQI telemetry available for chart.</p>
      </div>
    );
  }

  // Sort history chronologically (ascending time left to right)
  const chartData = [...history]
    .sort((a, b) => new Date(a.recordedAt || a.createdAt) - new Date(b.recordedAt || b.createdAt))
    .map((item) => ({
      time: new Date(item.recordedAt || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(item.recordedAt || item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      aqi: item.aqi,
      category: item.aqiCategory,
      location: item.location,
    }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={20} className="icon-emerald" />
          <h3>AQI Telemetry History</h3>
        </div>
        <span className="chart-badge">{chartData.length} Telemetry Points</span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
              formatter={(value, name, props) => [`${value} (${props.payload.category || 'AQI'})`, 'AQI Index']}
              labelFormatter={(label, items) => {
                if (items && items[0]) {
                  return `Time: ${label} (${items[0].payload.date})`;
                }
                return label;
              }}
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 7, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
