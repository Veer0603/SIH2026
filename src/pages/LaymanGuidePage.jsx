import React from 'react';
import LaymanGuide from '../components/LaymanGuide';
import { useApp } from '../context/useApp';

export default function LaymanGuidePage() {
  const { t } = useApp();

  return (
    <div>
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel)', marginBottom: '20px' }}>
        <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '8px', border: 'none' }}>
          {t('layman.tag', 'Easy Reading Guide & Citizen Health')}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          {t('layman.title', 'Air Particles & Atmospheric Science Explained Simply')}
        </h1>
        <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>
          {t('layman.subtitle', 'Understand what AQI numbers mean in everyday plain language, compare mask types, and check symptoms with bilingual English and Hindi guidance.')}
        </p>
      </div>

      {/* Simple Color Guide */}
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span>{t('layman.colorCodeTitle', 'UNIVERSAL AIR QUALITY COLOR SAFETY CODE')}</span>
            </div>
            <span className="subtitle">
              {t('layman.colorCodeSubtitle', 'Standard Indian CPCB and WHO visual classification for quick environmental hazard assessment.')}
            </span>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '14px' }}>
          <div style={{ backgroundColor: 'var(--aqi-good-bg)', border: '1px solid var(--aqi-good-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-good-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.greenTitle', '🟢 GREEN (0 - 50)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.greenName', 'Clean & Fresh Air')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.greenDesc', 'Safe for sports, outdoor running, open windows.')}</div>
          </div>

          <div style={{ backgroundColor: 'var(--aqi-mod-bg)', border: '1px solid var(--aqi-mod-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-mod-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.yellowTitle', '🟡 YELLOW (51 - 100)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.yellowName', 'Acceptable Air')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.yellowDesc', 'Okay for most. Asthmatics take short breathers.')}</div>
          </div>

          <div style={{ backgroundColor: 'var(--aqi-poor-bg)', border: '1px solid var(--aqi-poor-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-poor-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.orangeTitle', '🟠 ORANGE (101 - 200)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.orangeName', 'Hazy & Unhealthy')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.orangeDesc', 'Children & seniors wear simple masks outside.')}</div>
          </div>

          <div style={{ backgroundColor: 'var(--aqi-unhealthy-bg)', border: '1px solid var(--aqi-unhealthy-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-unhealthy-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.redTitle', '🔴 RED (201 - 300)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.redName', 'Heavy Toxic Smog')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.redDesc', 'Must wear N95 mask. Do not run or exercise outdoors.')}</div>
          </div>

          <div style={{ backgroundColor: 'var(--aqi-severe-bg)', border: '1px solid var(--aqi-severe-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-severe-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.purpleTitle', '🟣 PURPLE (301 - 400)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.purpleName', 'Severe Pollution')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.purpleDesc', 'Stay indoors. Keep doors and windows tightly sealed.')}</div>
          </div>

          <div style={{ backgroundColor: 'var(--aqi-hazardous-bg)', border: '1px solid var(--aqi-hazardous-border)', borderRadius: 'var(--radius-card)', padding: '16px', color: 'var(--aqi-hazardous-text)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>{t('layman.maroonTitle', '☠️ MAROON (401+)')}</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>{t('layman.maroonName', 'Emergency Toxic Hazard')}</div>
            <div style={{ fontSize: '12.5px', marginTop: '3px', opacity: 0.95 }}>{t('layman.maroonDesc', 'Avoid all exposure. Run HEPA air purifiers indoors.')}</div>
          </div>
        </div>
      </div>

      <LaymanGuide />
    </div>
  );
}
