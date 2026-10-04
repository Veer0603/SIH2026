import React from 'react';
import StationMap from '../components/StationMap';
import StationTable from '../components/StationTable';
import { useApp } from '../context/useApp';

export default function MapStationPage({ onOpenAddModal }) {
  const { stations, language, t } = useApp();

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
              {t('map.tag', 'Mapbox HD Vector Tiles')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('map.title', 'Delhi NCR Mapbox Monitoring Grid & Data Matrix')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {language === 'hi' 
                ? `दिल्ली एनसीआर के सभी ${stations.length} सक्रिय स्टेशनों का उच्च-रिज़ॉल्यूशन मैप और पराली वायु प्रवाह वेक्टर्स के साथ निरीक्षण व तुलना करें।`
                : `Inspect and compare all ${stations.length} active monitoring nodes across Delhi NCR on high-resolution Mapbox maps with stubble wind vectors.`}
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="btn"
            style={{ fontWeight: 700, padding: '8px 16px', borderRadius: 'var(--radius-btn)' }}
          >
            {t('map.addReading', '+ Add Station / Reading')}
          </button>
        </div>
      </div>

      <StationMap onOpenAddModal={onOpenAddModal} />

      <StationTable onOpenAddModal={onOpenAddModal} />
    </div>
  );
}
