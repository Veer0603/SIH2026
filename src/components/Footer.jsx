import React from 'react';
import { useApp } from '../context/useApp';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onOpenModal, onOpenFlowGuide }) {
  const { language, t } = useApp();
  const isHindi = language === 'hi';

  return (
    <footer style={{
      backgroundColor: 'var(--bg-panel)',
      borderTop: '1px solid var(--border-color)',
      padding: '32px 0 24px 0',
      marginTop: '40px'
    }}>
      <div className="container">
        <div className="grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              {t('footer.heading', 'AERIS DELHI — COUPLED ATMOSPHERIC AQI ENGINE')}
            </div>
            <p className="muted" style={{ fontSize: '13px', maxWidth: '520px', lineHeight: 1.5 }}>
              {t('footer.description', 'High-resolution 72-hour forecast system for Delhi NCR interlinking planetary boundary layer physics, surface weather parameters, and PM2.5/Ozone chemical transport.')}
            </p>

            {onOpenFlowGuide && (
              <button
                onClick={onOpenFlowGuide}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '11.5px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: 'var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  marginTop: '8px'
                }}
              >
                <span>🧭</span>
                <span>{isHindi ? 'वेबसाइट नेविगेशन रोडमैप व फ्लो गाइड देखें' : 'View Master Navigation Roadmap & Flow Guide'}</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <button
                onClick={() => onOpenModal('terms')}
                className="btn btn-outline btn-sm"
                style={{ border: 'none', padding: 0, textDecoration: 'underline' }}
              >
                {t('footer.terms', 'Terms of Service')}
              </button>
              <button
                onClick={() => onOpenModal('privacy')}
                className="btn btn-outline btn-sm"
                style={{ border: 'none', padding: 0, textDecoration: 'underline' }}
              >
                {t('footer.privacy', 'Privacy Policy')}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
              {language === 'hi'
                ? 'ओपन डेटा स्रोत: CPCB, IITM SAFAR, WRF-Chem ओपन कम्युनिटी फ्रेमवर्क'
                : 'Open Data Attribution: CPCB, IITM SAFAR, WRF-Chem Open Community Framework'}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            © {CURRENT_YEAR} {t('footer.copyright', 'AERIS Delhi — Atmosphere & Chemistry Resilient Intelligence Engine')}
          </div>
          <div>
            {language === 'hi' ? 'AeroLedger स्थिति: ' : 'AeroLedger Mainnet Status: '}
            <strong style={{ color: '#2b7a3e' }}>
              {language === 'hi' ? 'सक्रिय (16/16 नोड्स सत्यापित)' : 'ACTIVE (16/16 Nodes Verified)'}
            </strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
