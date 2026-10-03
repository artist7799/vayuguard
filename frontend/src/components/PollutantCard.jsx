import React from 'react';
import { Activity } from 'lucide-react';

export default function PollutantCard({ reading }) {
  const getPollutantVal = (val) => {
    if (val === undefined || val === null || isNaN(Number(val))) {
      return 'N/A';
    }
    return val;
  };

  const pollutants = [
    { 
      label: 'PM2.5', 
      value: getPollutantVal(reading?.pm25), 
      unit: 'µg/m³', 
      max: 250, 
      desc: 'Fine Particulate Matter (≤ 2.5 µm)' 
    },
    { 
      label: 'PM10', 
      value: getPollutantVal(reading?.pm10), 
      unit: 'µg/m³', 
      max: 430, 
      desc: 'Coarse Particulate Matter (≤ 10 µm)' 
    },
    { 
      label: 'CO', 
      value: getPollutantVal(reading?.co), 
      unit: 'ppm', 
      max: 15.4, 
      desc: 'Carbon Monoxide Gas' 
    },
    { 
      label: 'NO₂', 
      value: getPollutantVal(reading?.no2), 
      unit: 'ppb', 
      max: 200, 
      desc: 'Nitrogen Dioxide' 
    },
    { 
      label: 'SO₂', 
      value: getPollutantVal(reading?.so2), 
      unit: 'ppb', 
      max: 75, 
      desc: 'Sulfur Dioxide' 
    },
    { 
      label: 'O₃', 
      value: getPollutantVal(reading?.o3), 
      unit: 'ppb', 
      max: 180, 
      desc: 'Ground-level Ozone' 
    },
  ];

  return (
    <div className="pollutant-section">
      <div className="section-title">
        <Activity size={20} className="icon-emerald" />
        <h3>Pollutant Concentrations</h3>
      </div>

      <div className="pollutant-grid">
        {pollutants.map((p) => {
          const isNum = typeof p.value === 'number';
          const percentage = isNum ? Math.min(100, Math.max(5, (p.value / p.max) * 100)) : 0;

          return (
            <div key={p.label} className="pollutant-card">
              <div className="pollutant-header">
                <span className="pollutant-name">{p.label}</span>
                <span className="pollutant-desc">{p.desc}</span>
              </div>

              <div className="pollutant-value-row">
                <span className="pollutant-num">{p.value}</span>
                {isNum && <span className="pollutant-unit">{p.unit}</span>}
              </div>

              <div className="pollutant-bar-track">
                <div 
                  className="pollutant-bar-fill" 
                  style={{ width: `${percentage}%`, opacity: isNum ? 1 : 0.2 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
