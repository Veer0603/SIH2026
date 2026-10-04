import React, { useEffect } from 'react';

export default function TermsPrivacyModal({ mode, onClose }) {
  // Global Escape key listener to close modal from anywhere in the window
  useEffect(() => {
    if (!mode) return;

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [mode, onClose]);

  if (!mode) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(24, 27, 29, 0.6)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-page)',
          border: '2px solid var(--border-dark)',
          borderRadius: 'var(--radius-sharp)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            {mode === 'terms' ? 'Terms of Service (Draft for Review)' : 'Privacy Policy (Draft for Review)'}
          </h2>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close ✕
          </button>
        </div>

        {mode === 'terms' ? (
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            <p><strong>DRAFT FOR LEGAL REVIEW — AERIS DELHI FORECASTING SYSTEM</strong></p>
            
            <h4 style={{ margin: '12px 0 4px 0' }}>1. Service Scope & Forecast Nature</h4>
            <p>
              AERIS Delhi provides high-resolution 72-hour coupled meteorology-chemistry air quality predictions for Delhi NCR using WRF-Chem and Physics-Informed Neural Network (PINN) surrogate models. Predictions are generated for informational purposes and public environmental awareness.
            </p>

            <h4 style={{ margin: '12px 0 4px 0' }}>2. Health Advisory Disclaimer</h4>
            <p>
              AeroAI health advisories are automated risk estimations based on Indian CPCB AQI standards and micro-particulate concentrations. Individuals with severe chronic medical conditions should consult licensed medical practitioners.
            </p>

            <h4 style={{ margin: '12px 0 4px 0' }}>3. Cryptographic Ledger Data Proofs</h4>
            <p>
              AeroLedger blockchain receipts confirm sensor reading hash immutability. Sensor hardware maintenance and raw telemetry calibration remain under official station operator management (CPCB / IITM / DPCC).
            </p>
          </div>
        ) : (
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            <p><strong>DRAFT FOR PRIVACY REVIEW — AERIS DELHI PLATFORM</strong></p>
            
            <h4 style={{ margin: '12px 0 4px 0' }}>1. Geocoding Search & Query Privacy</h4>
            <p>
              Address search queries entered into the Delhi Locality Search box are processed via client-side fuzzy matching and OpenStreetMap Nominatim geocoding services. No personal IP addresses, search logs, or precise location traces are stored or sold to third parties.
            </p>

            <h4 style={{ margin: '12px 0 4px 0' }}>2. Local Preferences & Storage</h4>
            <p>
              Selected monitoring station preferences and vulnerability profiles are maintained exclusively within local browser state (`localStorage`).
            </p>

            <h4 style={{ margin: '12px 0 4px 0' }}>3. Open Data & Attribution</h4>
            <p>
              Air quality data feeds are sourced from CPCB / DPCC / SAFAR open telemetry infrastructure combined with WRF-Chem boundary layer modeling.
            </p>
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '14px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn">
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
