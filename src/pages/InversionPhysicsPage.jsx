import React from 'react';
import InversionFeedbackSimulator from '../components/InversionFeedbackSimulator';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';

export default function InversionPhysicsPage() {
  const { selectedStation, setSelectedStation, t, stations } = useApp();
  const stationList = (stations && stations.length > 0) ? stations : DELHI_STATIONS;

  return (
    <div>
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '6px' }}>
              {t('inversion.tag', 'WRF-Chem Physics Simulator')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
              {t('inversion.title', 'Atmospheric Inversion & Stubble Smoke Simulator')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('inversion.subtitle', 'Simulate how nocturnal boundary layer cooling, calm surface winds, and agricultural fire smoke interact dynamically over Delhi NCR.')}
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

      <InversionFeedbackSimulator station={selectedStation} />
    </div>
  );
}
