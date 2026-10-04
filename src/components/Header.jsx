import React from 'react';

export default function Header({ activeSection, setActiveSection }) {
  return (
    <header style={{
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand identity - NO SIH 2026 labels */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--accent-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '-0.03em',
            borderRadius: 'var(--radius-sharp)'
          }}>
            AE
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--text-main)'
            }}>
              AERIS DELHI
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Coupled Weather-Chemistry 72h Forecast Engine
            </div>
          </div>
        </div>

        {/* Live System Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-page)',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#2b7a3e',
            display: 'inline-block'
          }}></span>
          <span>WRF-CHEM + ML LIVE MODEL active</span>
        </div>

        {/* Navigation Section Buttons */}
        <nav style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'search', label: 'Search Locality' },
            { id: 'forecast', label: '72h Forecast' },
            { id: 'layman', label: 'Particles Simplified' },
            { id: 'ai-advisor', label: 'AeroAI Advisor' },
            { id: 'inversion', label: 'Inversion Physics' },
            { id: 'blockchain', label: 'Blockchain Ledger' },
            { id: 'map', label: 'Station Matrix' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="btn btn-outline btn-sm"
              style={{
                backgroundColor: activeSection === item.id ? 'var(--accent-primary)' : 'transparent',
                color: activeSection === item.id ? '#ffffff' : 'var(--text-main)',
                borderColor: activeSection === item.id ? 'var(--accent-primary)' : 'var(--border-color)',
                borderRadius: 'var(--radius-sharp)',
                padding: '6px 12px'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
