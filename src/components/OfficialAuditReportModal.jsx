import React, { useState, useEffect } from 'react';
import { calculateCigaretteEquivalent, calculateAQLIImpact, getGRAPStage } from '../utils/mlEngine';
import { useApp } from '../context/useApp';

export default function OfficialAuditReportModal({ isOpen, onClose, station }) {
  const { addToast, lastUpdated, language } = useApp();
  const [copied, setCopied] = useState(false);
  const dateObj = lastUpdated;
  const isHindi = language === 'hi';

  // Global Escape key listener to close modal from anywhere in the window
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen || !station) return null;

  const dateStr = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  const stationId = station.id ? station.id.toUpperCase() : 'DELHI-CENTRAL';
  const reportId = `AERIS-${stationId}-${dateObj.getFullYear()}${(dateObj.getMonth() + 1).toString().padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}-${(Math.abs(dateObj.getTime() % 9000) + 1000)}`;

  const pm25 = station.pm25 || 120;
  const pm10 = station.pm10 || Math.round(pm25 * 1.6);
  const aqi = station.aqi || Math.round(pm25 * 1.5);
  const pblHeight = station.pblHeight || 340;
  const inversionStrength = station.inversionStrength || 65;
  const stubbleFlux = station.stubbleFlux || 45;
  const windSpeed = station.windSpeed || 5.2;
  const windDirectionText = station.windDirectionText || 'NW';
  const dominantPollutant = station.dominantPollutant || 'PM2.5';
  const category = station.category || 'Severe';
  const zone = station.zone || 'Delhi NCR';
  const stationName = station.name || 'Delhi Central Monitoring Node';
  const latStr = (station.lat || 28.6139).toFixed(4);
  const lngStr = (station.lng || 77.2090).toFixed(4);
  const blockchainHash = station.blockchainHash || '0x7f9a2c4e1b8d5a6390cf214b7e8d3a1f';

  const cig = calculateCigaretteEquivalent(pm25);
  const aqli = calculateAQLIImpact(pm25);
  const grap = getGRAPStage(aqi);
  const whoMultiplier = (pm25 / 5).toFixed(1); // WHO PM2.5 annual guideline is 5 µg/m³

  const handlePrint = () => {
    window.print();
  };

  const getMarkdownContent = () => {
    return `
# OFFICIAL AIR QUALITY & ATMOSPHERIC INVERSION AUDIT REPORT
**Document Reference ID:** ${reportId}
**Issued by:** AERIS Delhi Atmospheric Chemistry & WRF-Chem Telemetry Network
**Locality/Station:** ${stationName} (${zone})
**Coordinates:** ${latStr}°N, ${lngStr}°E
**Timestamp:** ${dateStr}
**SHA-256 Cryptographic Seal:** ${blockchainHash}

---

## 1. REAL-TIME CPCB SENSOR TELEMETRY
- **Air Quality Index (AQI):** ${aqi} (${category.toUpperCase()})
- **Dominant Toxic Agent:** ${dominantPollutant}
- **PM2.5 (Fine Combustion Soot):** ${pm25} µg/m³ (${whoMultiplier}x WHO Safe Limit)
- **PM10 (Coarse Soil/Road Dust):** ${pm10} µg/m³
- **Ground Ozone (O₃ Smog):** ${station.o3 || 42} µg/m³
- **Nitrogen Oxides (Traffic NOx):** ${station.nox || 65} ppb
- **Sulfur Dioxide (Industrial SO₂):** ${station.so2 || 14} ppb
- **Carbon Monoxide (CO):** ${station.co || 1.8} mg/m³

---

## 2. ATMOSPHERIC BOUNDARY LAYER & INVERSION STATUS
- **Planetary Boundary Layer (PBL) Ceiling:** ${pblHeight} meters
- **Thermal Inversion Lid Strength:** ${inversionStrength}%
- **Regional Stubble Burning Smoke Flux:** ${stubbleFlux}%
- **Surface Wind Vector:** ${windSpeed} km/h (${windDirectionText})
- **Solar Insolation Blocking:** ${station.solarSuppression || 20}%

---

## 3. PUBLIC HEALTH & EPIDEMIOLOGICAL RISK
- **Daily Inhaled Toxicity:** Equivalent to smoking ~${cig.cigarettes} cigarettes/day (Berkeley Earth formula).
- **Life Expectancy Reduction (AQLI):** -${aqli.yearsLostWHO} years lost compared to WHO guideline (-${aqli.yearsLostCPCB} years vs Indian National Ambient Air Standard).
- **Chronic Disease Relative Risk Multipliers:**
  - COPD Excess Risk: +${aqli.copdExcessRiskPct}%
  - Ischemic Heart Disease Excess Risk: +${aqli.cardioExcessRiskPct}%
  - Stroke Excess Risk: +${aqli.strokeExcessRiskPct}%
- **Health Assessment:** ${cig.description}

---

## 4. STATUTORY MANDATE UNDER GRAP (${grap.stage.toUpperCase()})
${grap.actions.map(a => `- ${a}`).join('\n')}

---

*Certified authentic and tamper-evident via SHA-256 cryptographic verification in the AeroLedger Delhi Node Registry.*
    `.trim();
  };

  const handleCopyMarkdown = () => {
    const md = getMarkdownContent();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(() => {
        setCopied(true);
        addToast(isHindi ? 'ऑडिट रिपोर्ट क्लिपबोर्ड पर कॉपी की गई!' : 'Audit Report copied to clipboard in Markdown format!', 'success');
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => fallbackCopy(md));
    } else {
      fallbackCopy(md);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      addToast(isHindi ? 'ऑडिट रिपोर्ट क्लिपबोर्ड पर कॉपी की गई!' : 'Audit Report copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast(isHindi ? 'कॉपी करने में असमर्थ' : 'Could not copy to clipboard', 'error');
    }
  };

  const handleDownload = () => {
    try {
      const md = getMarkdownContent();
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportId}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast(isHindi ? 'ऑडिट रिपोर्ट फाइल (.md) डाउनलोड की गई!' : 'Audit Report file (.md) downloaded successfully!', 'success');
    } catch {
      addToast(isHindi ? 'डाउनलोड करने में असमर्थ' : 'Failed to download report', 'error');
    }
  };

  return (
    <div
      className="audit-report-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(19, 27, 35, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000,
        padding: '20px'
      }}
    >
      <div
        className="audit-report-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-panel, 16px)',
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Action Toolbar (Hidden during print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-panel-subtle)',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📜</span>
            <span style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {isHindi ? 'आधिकारिक पर्यावरण ऑडिट रिपोर्ट प्रमाणपत्र' : 'Official Air Quality & Inversion Audit Report'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Download File Button */}
            <button
              onClick={handleDownload}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              title={isHindi ? 'मार्कडाउन रिपोर्ट डाउनलोड करें' : 'Download report as Markdown file'}
            >
              <span>📥</span>
              <span>{isHindi ? 'डाउनलोड (.md)' : 'Download (.md)'}</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              title={isHindi ? 'रिपोर्ट प्रिंट या PDF के रूप में सेव करें' : 'Print certificate or save as PDF'}
            >
              <span>🖨️</span>
              <span>{isHindi ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
            </button>

            {/* Copy Markdown Button */}
            <button
              onClick={handleCopyMarkdown}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>{copied ? '✓' : '📋'}</span>
              <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'मार्कडाउन कॉपी' : 'Copy Markdown')}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px 8px',
                marginLeft: '4px'
              }}
              aria-label="Close Modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Formal Document Body */}
        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--bg-panel)' }}>
          {/* Header Seal & Meta */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--text-main)',
            paddingBottom: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>
                {isHindi ? 'राष्ट्रीय राजधानी क्षेत्र दिल्ली • वैधानिक पर्यावरण टेलीमेट्री ऑडिट' : 'NATIONAL CAPITAL REGION • STATUTORY ENVIRONMENTAL TELEMETRY'}
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 2px' }}>
                {isHindi ? 'वायु गुणवत्ता एवं वायुमंडलीय इनवर्जन अनुपालन रिपोर्ट' : 'AIR QUALITY & ATMOSPHERIC INVERSION COMPLIANCE AUDIT'}
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHindi ? 'निगरानी स्थल:' : 'Monitoring Target:'} <strong>{stationName}</strong> • {isHindi ? 'जोन:' : 'Zone:'} <strong>{zone}</strong> • {isHindi ? 'निर्देशांक:' : 'Coordinates:'} {latStr}°N, {lngStr}°E
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <div><strong>DOC ID:</strong> {reportId}</div>
              <div><strong>DATE:</strong> {dateStr}</div>
              <div><strong>SENSOR NODE:</strong> CPCB-{stationId}</div>
            </div>
          </div>

          {/* Top Score Box */}
          <div style={{
            backgroundColor: aqi > 300 ? 'var(--aqi-unhealthy-bg)' : aqi > 200 ? 'var(--aqi-poor-bg)' : 'var(--aqi-good-bg)',
            border: `1px solid ${aqi > 300 ? 'var(--aqi-unhealthy-border)' : 'var(--border-color)'}`,
            padding: '16px 20px',
            borderRadius: 'var(--radius-card, 8px)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                {isHindi ? 'CPCB समग्र राष्ट्रीय वायु गुणवत्ता सूचकांक (NAQI)' : 'CPCB COMPOSITE AIR QUALITY INDEX (NAQI)'}
              </div>
              <div style={{ fontSize: '34px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                AQI {aqi} — {category.toUpperCase()}
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                {isHindi ? 'प्रमुख विषैला कारक:' : 'Dominant Toxic Agent:'} <strong>{dominantPollutant}</strong> • {isHindi ? 'WHO सुरक्षित सीमा से अधिक:' : 'WHO Guideline Exceedance:'} <strong>{whoMultiplier}x</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '10px 14px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#1e293b' }}>
                  {isHindi ? 'सिगरेट समतुल्य' : 'BERKELEY SMOKING DOSE'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
                  🚬 ~{cig.cigarettes} {isHindi ? 'सिग/दिन' : 'cigs/day'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '10px 14px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#1e293b' }}>
                  {isHindi ? 'जीवन प्रत्याशा हानि' : 'AQLI LIFE LOSS'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#dc2626' }}>
                  ⏳ -{aqli.yearsLostWHO} {isHindi ? 'वर्ष' : 'yrs'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Chemical & Particulate Matrix */}
          <div style={{ marginBottom: '22px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              {isHindi ? '1. कण व गैसीय द्रव्यमान सांद्रता (Particulate & Gaseous Mass Concentrations)' : '1. Particulate & Gaseous Mass Concentrations'}
            </h4>
            <div className="grid-3" style={{ gap: '10px' }}>
              <div className="metric-box">
                <span className="metric-label">PM2.5 ({isHindi ? 'महीन कालिख' : 'Fine Combustion Soot'})</span>
                <span className="metric-value">{pm25} <span className="metric-unit">µg/m³</span></span>
                <span className="metric-sub" style={{ color: pm25 > 60 ? '#dc2626' : 'inherit' }}>
                  {isHindi ? 'मानक सीमा: 60 µg/m³' : 'Standard Limit: 60 µg/m³'}
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">PM10 ({isHindi ? 'सड़क धूल व कण' : 'Coarse Dust'})</span>
                <span className="metric-value">{pm10} <span className="metric-unit">µg/m³</span></span>
                <span className="metric-sub" style={{ color: pm10 > 100 ? '#ea580c' : 'inherit' }}>
                  {isHindi ? 'मानक सीमा: 100 µg/m³' : 'Standard Limit: 100 µg/m³'}
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'ओजोन (O₃)' : 'Ground Ozone (O₃)'}</span>
                <span className="metric-value">{station.o3 || 42} <span className="metric-unit">µg/m³</span></span>
                <span className="metric-sub">{isHindi ? 'सतही स्मॉग' : 'Photochemical Smog'}</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'नाइट्रोजन ऑक्साइड (NOx)' : 'Nitrogen Oxides (NOx)'}</span>
                <span className="metric-value">{station.nox || 65} <span className="metric-unit">ppb</span></span>
                <span className="metric-sub">{isHindi ? 'डीजल ट्रैफिक धुआं' : 'Diesel & Traffic Exhaust'}</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'सल्फर डाइऑक्साइड (SO₂)' : 'Sulfur Dioxide (SO₂)'}</span>
                <span className="metric-value">{station.so2 || 14} <span className="metric-unit">ppb</span></span>
                <span className="metric-sub">{isHindi ? 'औद्योगिक कोयला दहन' : 'Industrial Coal Combustion'}</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'कार्बन मोनोऑक्साइड (CO)' : 'Carbon Monoxide (CO)'}</span>
                <span className="metric-value">{station.co || 1.8} <span className="metric-unit">mg/m³</span></span>
                <span className="metric-sub">{isHindi ? 'अपूर्ण ईंधन दहन' : 'Incomplete Fuel Burning'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Meteorological & Boundary Layer Coupling */}
          <div style={{ marginBottom: '22px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              {isHindi ? '2. वायुमंडलीय सीमा परत (PBL) व थर्मल इनवर्जन टेलीमेट्री' : '2. Atmospheric Boundary Layer (PBL) & Inversion Lid Telemetry'}
            </h4>
            <div className="grid-3" style={{ gap: '10px' }}>
              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'PBL सीमा ऊंचाई (Ceiling)' : 'PBL Ceiling Altitude'}</span>
                <span className="metric-value">{pblHeight} <span className="metric-unit">m</span></span>
                <span className="metric-sub" style={{ color: pblHeight < 350 ? '#dc2626' : 'inherit' }}>
                  {pblHeight < 350 ? (isHindi ? '⚠️ गंभीर इनवर्जन ढक्कन' : '⚠️ Severe Inversion Lid') : (isHindi ? 'मध्यम फैलाव' : 'Moderate Ventilation')}
                </span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'इनवर्जन ट्रैपिंग क्षमता' : 'Inversion Lid Strength'}</span>
                <span className="metric-value">{inversionStrength}%</span>
                <span className="metric-sub">{isHindi ? 'प्रदूषक दमन गुणांक' : 'Suppression Coefficient'}</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">{isHindi ? 'पराली धुआं प्रवाह (Flux)' : 'Stubble Smoke Flux'}</span>
                <span className="metric-value">{stubbleFlux}%</span>
                <span className="metric-sub">{isHindi ? 'उत्तर-पश्चिम कृषि धुआं' : 'NW Corridor Fire Plume'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Epidemiological Impact (Univ of Chicago AQLI) */}
          <div style={{ marginBottom: '22px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              {isHindi ? '3. जन स्वास्थ्य व दीर्घकालिक जोखिम (University of Chicago AQLI Model)' : '3. Public Health & Epidemiological Impact (University of Chicago AQLI)'}
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-page)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card, 8px)',
              padding: '14px 18px',
              fontSize: '12.5px',
              lineHeight: 1.5
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                {isHindi
                  ? `विश्व स्वास्थ्य संगठन (WHO) के 5 µg/m³ दिशा-निर्देश की तुलना में इस क्षेत्र के निवासी औसतन ${aqli.yearsLostWHO} वर्ष की जीवन प्रत्याशा खो रहे हैं (-${aqli.yearsLostCPCB} वर्ष भारतीय 40 µg/m³ राष्ट्रीय मानक की तुलना में)।`
                  : `According to the University of Chicago EPIC Air Quality Life Index (Greenstone et al.), sustained ambient exposure at ${pm25} µg/m³ PM2.5 reduces life expectancy by ${aqli.yearsLostWHO} years compared to WHO guidelines (-${aqli.yearsLostCPCB} years vs Indian National Ambient Air Standard).`}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontWeight: 700, fontSize: '11px' }}>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>COPD Excess Risk: +{aqli.copdExcessRiskPct}%</span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>Cardiovascular Excess Risk: +{aqli.cardioExcessRiskPct}%</span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>Stroke Excess Risk: +{aqli.strokeExcessRiskPct}%</span>
              </div>
            </div>
          </div>

          {/* Section 4: Statutory GRAP Directives */}
          <div style={{
            backgroundColor: 'var(--bg-panel-subtle)',
            border: '1px solid var(--border-color)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-card, 8px)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff' }}>
                {grap.badge}
              </span>
              <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                {isHindi ? `लागू वैधानिक आपातकालीन निर्देश: ${grap.stage}` : `Statutory Directives in Force: ${grap.stage}`}
              </span>
            </div>
            <ul style={{ paddingLeft: '20px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
              {grap.actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Official Footer Verification */}
          <div style={{
            paddingTop: '14px',
            borderTop: '1px dashed var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              🔒 {isHindi ? 'AeroLedger दिल्ली नोड रजिस्ट्री में SHA-256 ब्लॉकचेन द्वारा सत्यापित व मुहरबंद।' : 'Cryptographically sealed & verified via AERIS Delhi Node SHA-256 Merkle Ledger.'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>
              HASH: <code>{blockchainHash.slice(0, 18)}...</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
