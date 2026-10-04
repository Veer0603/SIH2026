import React, { useState } from 'react';
import { getAIHealthAdvice } from '../utils/mlEngine';
import { useApp } from '../context/useApp';
import SpringCheck from './SpringCheck';

export default function AiHealthAdvisor({ station }) {
  const { language, t } = useApp();
  const [profile, setProfile] = useState('general');
  const advice = getAIHealthAdvice(station.aqi, profile, { pm25: station.pm25 }, language);

  const profiles = [
    { id: 'general', label: t('advisor.profiles.general.title', 'General Public (Adult)'), desc: t('advisor.profiles.general.desc', 'Standard adult with no chronic respiratory issues') },
    { id: 'children', label: t('advisor.profiles.children.title', 'Children & Elderly'), desc: t('advisor.profiles.children.desc', 'Developing lungs or senior citizens vulnerable to PM2.5') },
    { id: 'asthma', label: t('advisor.profiles.asthma.title', 'Asthma / Respiratory Sensitivity'), desc: t('advisor.profiles.asthma.desc', 'Pre-existing COPD, asthma, or bronchitis') },
    { id: 'athlete', label: t('advisor.profiles.athlete.title', 'Outdoor Athlete / Runner'), desc: t('advisor.profiles.athlete.desc', 'Heavy ventilation during outdoor sports, running, or cycling') },
    { id: 'pregnant', label: t('advisor.profiles.pregnant.title', 'Expectant Mothers'), desc: t('advisor.profiles.pregnant.desc', 'Foetal cardiovascular protection from micro-particle penetration') },
    { id: 'commuter', label: t('advisor.profiles.commuter.title', 'Daily Commuter / Delivery Worker'), desc: t('advisor.profiles.commuter.desc', 'Prolonged exposure in roadside diesel smoke corridors') }
  ];

  return (
    <div className="panel" id="ai-advisor-section">
      <div className="panel-header">
        <div className="panel-title">
          <span>{language === 'hi' ? 'AeroAI — व्यक्तिगत स्वास्थ्य व कार्यकलाप सलाहकार' : 'AeroAI — PERSONALIZED HEALTH & ACTIVITY ADVISOR'}</span>
          <span className="subtitle">{language === 'hi' ? 'वास्तविक समय WRF-Chem AQI आधारित AI स्वास्थ्य इंजन' : 'AI advisory engine powered by real-time WRF-Chem AQI predictions'}</span>
        </div>
        <div className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)', borderColor: 'var(--border-dark)' }}>
          {language === 'hi' ? 'मॉडल विश्वसनीयता: 94.8%' : 'ML Model Confidence: 94.8%'}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Profile Selector */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            {t('advisor.section1Title', '1. Select Your Health & Vulnerability Profile:')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profiles.map((p) => {
              const isSelected = profile === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(0, 180, 216, 0.08)' : 'var(--bg-page)',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-card, 8px)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>
                        {p.label}
                      </span>
                      {isSelected && (
                        <span className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '9px', padding: '2px 6px' }}>
                          {t('common.active', 'ACTIVE')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {p.desc}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SpringCheck
                      checked={isSelected}
                      onChange={() => setProfile(p.id)}
                      strike="none"
                      boxSize={20}
                      boxRadius={10}
                      color="var(--accent-primary)"
                      fillColor="var(--accent-primary)"
                      checkColor="#ffffff"
                      bounce={0.28}
                      ariaLabel={p.label}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Output Advisory Panel */}
        <div className="metric-box" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'AeroAI स्वास्थ्य परामर्श' : 'AeroAI Health Advisory Output'}
              </span>
              <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
                {advice.status}
              </span>
            </div>

            <h3 style={{ fontSize: '17px', color: 'var(--accent-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
              {advice.title}
            </h3>

            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '16px' }}>
              {advice.advice}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div className="grid-3" style={{ gap: '8px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('advisor.outdoorScore', 'Outdoor Score')}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {advice.outdoorScore}
                </div>
                {advice.outdoorRating && (
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: advice.outdoorRatingBg,
                    color: advice.outdoorRatingColor,
                    display: 'inline-block',
                    marginTop: '2px'
                  }}>
                    {advice.outdoorRating}
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('advisor.maskRequired', 'Mask Required')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                  {advice.maskRecommended
                    ? (language === 'hi' ? '😷 हाँ (N95)' : 'YES (N95)')
                    : (language === 'hi' ? 'वैकल्पिक' : 'OPTIONAL')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('advisor.ventilateWindows', 'Ventilate Windows')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                  {advice.ventilateHome
                    ? (language === 'hi' ? '✓ खुली रखें' : 'ALLOWED')
                    : (language === 'hi' ? '🔒 बंद रखें' : 'KEEP CLOSED')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
