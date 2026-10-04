import React, { useState } from 'react';
import Forecast72h from '../components/Forecast72h';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';
import { generateML72hForecast } from '../utils/mlEngine';

export default function ForecastPage() {
  const { selectedStation, setSelectedStation, t, stations } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const fullForecast = generateML72hForecast(selectedStation);

  // Filtered rows for detailed table
  const filteredHourly = fullForecast.filter(f =>
    f.timeLabel.toLowerCase().includes(filterQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const stationList = (stations && stations.length > 0) ? stations : DELHI_STATIONS;

  return (
    <div>
      {/* Header Banner */}
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '6px' }}>
              {t('forecast.tag', '72h Coupled WRF-Chem Outlook')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
              {t('forecast.title', '72-Hour Air Quality & Weather Ceiling Forecast')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('forecast.subtitle', 'Hourly trajectory of photochemical smog, boundary layer lids, and stubble fire impacts for')} {selectedStation.name}.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t('common.station', 'Station')}:
            </span>
            <select
              className="input-select"
              value={selectedStation.id}
              onChange={(e) => {
                const found = stationList.find(s => s.id === e.target.value);
                if (found) setSelectedStation(found);
              }}
              style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 600 }}
            >
              {stationList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.shortName} ({t('common.aqi', 'AQI')} {s.aqi})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 72h Forecast Component */}
      <Forecast72h station={selectedStation} />

      {/* Hourly Data Table with Peak Smog Identification */}
      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span>{t('forecast.matrixTitle', 'HOURLY DATA MATRIX BREAKDOWN (72 HOURS)')}</span>
            </div>
            <span className="subtitle">
              {t('forecast.matrixSubtitle', 'Inspect specific time slots to identify morning inversion peaks vs afternoon ventilation relief.')}
            </span>
          </div>

          <input
            type="text"
            className="input-text"
            placeholder={t('forecast.filterPlaceholder', 'Filter hours (e.g. Mon, Severe, 08:00)...')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ width: '220px', padding: '6px 10px', fontSize: '12px' }}
          />
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '360px' }}>
          <table className="data-table">
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <th>{t('forecast.timeHorizon', 'Time Horizon')}</th>
                <th>{t('common.aqi', 'AQI')}</th>
                <th>{t('forecast.category', 'Category')}</th>
                <th>PM2.5 (µg/m³)</th>
                <th>{t('forecast.pblCeiling', 'PBL Ceiling (m)')}</th>
                <th>{t('forecast.inversionPct', 'Inversion %')}</th>
                <th>{t('common.temp', 'Temp')} (°C)</th>
                <th>{t('common.wind', 'Wind')} (km/h)</th>
                <th>{t('forecast.modelConfidence', 'Model Confidence')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHourly.map((f, i) => (
                <tr key={i} style={{ backgroundColor: f.aqi >= 400 ? 'var(--aqi-hazardous-bg)' : f.aqi >= 300 ? 'var(--aqi-severe-bg)' : 'transparent' }}>
                  <td style={{ fontWeight: 600 }}>{f.timeLabel} (+{f.hourOffset}h)</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{f.aqi}</td>
                  <td>
                    <span className="tag" style={{ fontSize: '10px' }}>{f.category}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{f.pm25}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{f.pblHeight}m</td>
                  <td>{f.inversionStrength}%</td>
                  <td>{f.temp}°C</td>
                  <td>{f.windSpeed} km/h</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.modelConfidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
