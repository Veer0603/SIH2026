import React from 'react';
import InversionFeedbackSimulator from '../components/InversionFeedbackSimulator';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';

export default function InversionPhysicsPage() {
  const { selectedStation, setSelectedStation, t, stations } = useApp();
  const stationList = (stations && stations.length > 0) ? stations : DELHI_STATIONS;

  return (
    <div>
      <div className="panel" style={{
        background: 'var(--color-surface)',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', marginBottom: '8px', fontWeight: 600 }}>
              {t('inversion.tag', 'WRF-Chem Physics Simulator')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('inversion.title', 'Atmospheric Inversion & Stubble Smoke Simulator')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('inversion.subtitle', 'Simulate how nocturnal boundary layer cooling, calm surface winds, and agricultural fire smoke interact dynamically over Delhi NCR.')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {t('common.station', 'Station')}:
            </span>
            <select
              className="input-select"
              value={selectedStation.id}
              onChange={(e) => {
                const found = stationList.find(s => s.id === e.target.value);
                if (found) setSelectedStation(found);
              }}
              style={{ padding: '7px 12px', fontSize: '12.5px', fontWeight: 600, borderRadius: 'var(--radius-btn)' }}
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

      <InversionFeedbackSimulator station={selectedStation} />
    </div>
  );
}
