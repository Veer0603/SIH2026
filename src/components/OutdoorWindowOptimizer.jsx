import React, { useState } from 'react';
import { findSafeOutdoorWindows } from '../utils/mlEngine';
import { useApp } from '../context/useApp';

export default function OutdoorWindowOptimizer({ station, userProfile: propProfile, onNavigate }) {
  const { language, userProfile: globalProfile, setUserProfile } = useApp();
  const [selectedHour, setSelectedHour] = useState(null);

  const activeProfile = propProfile || globalProfile || 'general';

  const safeWindowsData = findSafeOutdoorWindows(station, activeProfile);
  const windows = safeWindowsData?.windows || [];
  const bestHour = safeWindowsData?.bestWindow || windows[0] || { timeLabel: 'Now', aqi: station.aqi, safetyScore: 50, hourOffset: 0 };

  if (!windows.length) return null;

  const currentHourData = (selectedHour !== null && windows[selectedHour]) ? windows[selectedHour] : windows[0] || bestHour;

  const profiles = [
    { id: 'general', label: language === 'hi' ? 'सामान्य नागरिक' : 'General' },
    { id: 'children', label: language === 'hi' ? 'बच्चे व वृद्ध' : 'Children & Elderly' },
    { id: 'asthma', label: language === 'hi' ? 'दमा / श्वसन रोगी' : 'Asthma / Sensitive' },
    { id: 'athlete', label: language === 'hi' ? 'खिलाड़ी व धावक' : 'Athletes' }
  ];

  return (
    <div className="panel" style={{ marginBottom: '20px' }}>
      <div className="panel-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="panel-title">
            <span>{language === 'hi' ? '🏃 24-घंटे आउटडोर सुरक्षा समय व अनुकूलन विज़ार्ड' : '🏃 DIURNAL EXPOSURE BUDGET & OPTIMAL OUTDOOR WINDOW OPTIMIZER'}</span>
          </div>
          <span className="subtitle">
            {language === 'hi'
              ? 'भौतिकी-आधारित 24h वेंटिलेशन चक्र जो दौड़ने, टहलने या बच्चों के बाहर खेलने के लिए सबसे सुरक्षित घंटों की पहचान करता है।'
              : 'Physics-informed 24h ventilation cycle identifying the safest hours for running, walking, or children playing outdoors.'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="tag" style={{
            backgroundColor: bestHour.aqi <= 100 ? 'rgba(16, 185, 129, 0.15)' : bestHour.aqi <= 200 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: bestHour.aqi <= 100 ? '#10b981' : bestHour.aqi <= 200 ? '#eab308' : '#ef4444',
            border: `1px solid ${bestHour.aqi <= 100 ? '#10b981' : bestHour.aqi <= 200 ? '#eab308' : '#ef4444'}`,
            fontWeight: 800,
            fontSize: '11.5px'
          }}>
            {language === 'hi' ? `🌟 आज का सर्वश्रेष्ठ समय: ${bestHour.timeLabel} (AQI ${bestHour.aqi})` : `🌟 Best Window Today: ${bestHour.timeLabel} (AQI ${bestHour.aqi})`}
          </span>
        </div>
      </div>

      {/* Vulnerability Profile Selector Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '14px',
        flexWrap: 'wrap',
        padding: '6px 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
          {language === 'hi' ? 'स्वास्थ्य संवेदनशीलता प्रोफाइल:' : 'Vulnerability Profile:'}
        </span>
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => setUserProfile && setUserProfile(p.id)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 9px',
              backgroundColor: activeProfile === p.id ? 'var(--accent-primary)' : 'transparent',
              color: activeProfile === p.id ? '#ffffff' : 'var(--text-main)',
              borderColor: activeProfile === p.id ? 'var(--accent-primary)' : 'var(--border-color)',
              fontWeight: activeProfile === p.id ? 700 : 500
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 24-hour Bar Grid */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          gap: '4px',
          alignItems: 'end',
          height: '84px',
          padding: '8px 0',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {windows.map((w, idx) => {
            const isSelected = selectedHour === idx;
            const isBest = w.hourOffset === bestHour.hourOffset;

            // Height proportional to safety score (minimum 16% height)
            const barHeight = Math.max(16, w.safetyScore);
            const barBg = w.color || '#ea580c';

            return (
              <div
                key={idx}
                onClick={() => setSelectedHour(idx)}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
                title={`${w.timeLabel}: ${language === 'hi' ? 'सुरक्षा स्कोर' : 'Safety Score'} ${w.safetyScore}/100 (AQI ${w.aqi})`}
              >
                <div style={{
                  height: `${barHeight}%`,
                  backgroundColor: barBg,
                  borderRadius: '3px 3px 0 0',
                  border: isSelected ? '2px solid #ffffff' : isBest ? '2px solid #f59e0b' : 'none',
                  boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.5)' : isBest ? '0 0 6px rgba(245, 158, 11, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }} />
              </div>
            );
          })}
        </div>

        {/* Hour Axis Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          <span>{language === 'hi' ? `अभी (${windows[0]?.timeLabel})` : `Now (${windows[0]?.timeLabel})`}</span>
          <span>{language === 'hi' ? '+6घं (सुबह)' : '+6h (Morning)'}</span>
          <span>{language === 'hi' ? '+12घं (दोपहर संवहन)' : '+12h (Afternoon Convection)'}</span>
          <span>{language === 'hi' ? '+18घं (शाम का ढक्कन)' : '+18h (Evening Cap)'}</span>
          <span>+24h</span>
        </div>
      </div>

      {/* Selected Hour Telemetry Detail */}
      <div style={{
        backgroundColor: 'var(--bg-panel-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card, 8px)',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'निरीक्षित समय' : 'Inspected Time'}
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {currentHourData.timeLabel} (+{currentHourData.hourOffset}h)
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'आउटडोर सुरक्षा स्कोर' : 'Outdoor Safety Score'}
            </div>
            <div style={{
              fontSize: '17px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: currentHourData.color || '#ea580c'
            }}>
              {currentHourData.safetyScore}/100 — {language === 'hi' ? currentHourData.statusHi.toUpperCase() : currentHourData.status.toUpperCase()}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'पूर्वानुमानित AQI व PBL सीमा' : 'Predicted AQI & PBL Ceiling'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              AQI {currentHourData.aqi} • {language === 'hi' ? 'सीमा परत' : 'Boundary Layer'}: {currentHourData.pblHeight}m
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.35 }}>
            {safeWindowsData.recommendation}
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('ai-advisor')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '6px 12px', whiteSpace: 'nowrap' }}
            >
              {language === 'hi' ? 'स्वास्थ्य प्रोफाइल ➔' : 'Health Profile ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
