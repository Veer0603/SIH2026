import React, { useState } from 'react';
import Forecast72h from '../components/Forecast72h';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';
import { generateML72hForecast, evaluateEarlyGRAPTrigger } from '../utils/mlEngine';

export default function ForecastPage() {
  const { selectedStation, setSelectedStation, t, language, stations } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const fullForecast = generateML72hForecast(selectedStation);
  const grapEarlyTrigger = evaluateEarlyGRAPTrigger(fullForecast);

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

      {/* Proactive CAQM GRAP-3/4 Early Advisory System */}
      {grapEarlyTrigger && (
        <div style={{
          backgroundColor: grapEarlyTrigger.urgency === 'CRITICAL_EMERGENCY'
            ? 'var(--aqi-hazardous-bg)'
            : grapEarlyTrigger.urgency === 'HIGH_ALERT'
            ? 'var(--aqi-unhealthy-bg)'
            : 'var(--bg-panel)',
          border: `1px solid ${
            grapEarlyTrigger.urgency === 'CRITICAL_EMERGENCY'
              ? 'var(--aqi-hazardous-border)'
              : grapEarlyTrigger.urgency === 'HIGH_ALERT'
              ? 'var(--aqi-unhealthy-border)'
              : 'var(--border-color)'
          }`,
          borderRadius: 'var(--radius-card)',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: grapEarlyTrigger.urgency === 'CRITICAL_EMERGENCY' ? '#ef4444' : '#f97316',
                  color: '#ffffff'
                }}>
                  {language === 'hi' ? '⚡ CAQM अग्रिम GRAP चेतावनी' : '⚡ CAQM PROACTIVE GRAP TRIGGER'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {grapEarlyTrigger.triggerStage}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {language === 'hi'
                  ? `भौतिकी-संवर्धित मॉडल ने अगले 72 घंटों में +${grapEarlyTrigger.peakHour}h पर चरम AQI ${grapEarlyTrigger.peakPredictedAQI} की भविष्यवाणी की है (${grapEarlyTrigger.consecutiveSevereHours} घंटे गंभीर प्रदूषण अवधि)।`
                  : `PINN physics model projects persistent severe atmospheric trapping peaking at AQI ${grapEarlyTrigger.peakPredictedAQI} (+${grapEarlyTrigger.peakHour}h horizon) across ${grapEarlyTrigger.consecutiveSevereHours} consecutive hours.`}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: 'var(--bg-panel)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ opacity: 0.65, fontSize: '10px', display: 'block' }}>ADVANCE NOTICE</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>+{grapEarlyTrigger.leadTimeHours}h LEAD</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
                <span style={{ opacity: 0.65, fontSize: '10px', display: 'block' }}>PEAK FORECAST</span>
                <span style={{ color: '#ef4444', fontSize: '14px' }}>AQI {grapEarlyTrigger.peakPredictedAQI}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', color: 'var(--text-main)' }}>
              {language === 'hi' ? '📋 अग्रिम वैधानिक आपातकालीन निर्देश (24-48 घंटे पूर्व)' : '📋 Mandated Early Policy Interventions (Triggered 24-48h Prior to Smog Clamp):'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {grapEarlyTrigger.recommendedInterventions.map((action, idx) => (
                <div key={idx} style={{
                  fontSize: '11.5px',
                  backgroundColor: 'var(--bg-page)',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>•</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
