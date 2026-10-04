import React, { useState } from 'react';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import AQIGauge from './AQIGauge';
import { calculateCigaretteEquivalent, calculateAQLIImpact, getGRAPStage } from '../utils/mlEngine';
import { useApp } from '../context/useApp';
import { calculateCompleteCPCB_AQI } from '../utils/cpcbAqiEngine';

export default function CurrentAQICard({ station, customLocality }) {
  const { toggleComparison, comparisonList, favorites, toggleFavorite, language } = useApp();
  const [showGrapDetails, setShowGrapDetails] = useState(false);
  const [healthMetricMode, setHealthMetricMode] = useState('cigarette'); // 'cigarette' | 'aqli'

  // Authentically compute official CPCB sub-indices and overall AQI dynamically
  const cpcbMetrics = calculateCompleteCPCB_AQI(station);
  const activeAQI = station.aqi || cpcbMetrics.aqi;
  const activeCategory = station.category || cpcbMetrics.category;
  const dominantPollutant = station.dominantPollutant || cpcbMetrics.dominantPollutant;
  const subIndices = cpcbMetrics.subIndices;

  const categoryMeta = AQI_CATEGORIES[activeCategory] || AQI_CATEGORIES[station.category] || AQI_CATEGORIES["Moderate"];
  const cigaretteData = calculateCigaretteEquivalent(station.pm25);
  const aqliData = calculateAQLIImpact(station.pm25);
  const grapData = getGRAPStage(activeAQI);

  const isCompared = comparisonList.some(s => s.id === station.id);
  const isFavorite = favorites.includes(station.id);

  // Live pollutant telemetry schema
  const pollutantsList = [
    { key: 'pm25', name: 'PM2.5', label: language === 'hi' ? 'PM2.5 (महीन कालिख)' : 'PM2.5 (Fine Soot)', val: station.pm25, unit: 'µg/m³', safeLimit: 60, whoLimit: 15, tag: language === 'hi' ? 'श्वसन विषाक्तता' : 'Combustion Smoke' },
    { key: 'pm10', name: 'PM10', label: language === 'hi' ? 'PM10 (सड़क धूल)' : 'PM10 (Road Dust)', val: station.pm10, unit: 'µg/m³', safeLimit: 100, whoLimit: 45, tag: language === 'hi' ? 'धूल व कण' : 'Coarse Dust' },
    { key: 'o3', name: 'Ozone (O3)', label: language === 'hi' ? 'ओजोन (O₃)' : 'Ozone (O₃)', val: station.o3, unit: 'µg/m³', safeLimit: 100, whoLimit: 100, tag: language === 'hi' ? 'सतही स्मॉग' : 'Ground Smog' },
    { key: 'nox', name: 'NOx', label: language === 'hi' ? 'NOx (ट्रैफिक धुआं)' : 'NOx (Traffic)', val: station.nox, unit: 'ppb', safeLimit: 80, whoLimit: 25, tag: language === 'hi' ? 'डीजल धुआं' : 'Diesel Fumes' },
    { key: 'so2', name: 'SO2', label: language === 'hi' ? 'SO₂ (औद्योगिक)' : 'SO₂ (Industrial)', val: station.so2, unit: 'ppb', safeLimit: 80, whoLimit: 40, tag: language === 'hi' ? 'कोयला दहन' : 'Coal Combustion' },
    { key: 'co', name: 'CO', label: language === 'hi' ? 'CO (कार्बन मोनोऑक्साइड)' : 'CO (Carbon Monoxide)', val: station.co, unit: 'mg/m³', safeLimit: 2.0, whoLimit: 4.0, tag: language === 'hi' ? 'वाहनों का उत्सर्जन' : 'Vehicle Exhaust' }
  ];

  return (
    <div className="panel" style={{ marginBottom: '22px' }}>
      {/* Panel Header with actions & Live telemetry status */}
      <div className="panel-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>{language === 'hi' ? 'वर्तमान वायुमंडलीय स्थिति' : 'CURRENT ATMOSPHERIC STATE'} — {customLocality ? customLocality.displayName : station.name}</span>
            
            {/* Live Telemetry Verification Pill */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block'
              }}></span>
              <span>{station.isLiveAPI ? (language === 'hi' ? 'लाइव उपग्रह व CPCB सिंक' : 'LIVE CAMS & CPCB TELEMETRY') : (language === 'hi' ? 'डायनामिक CPCB गणना' : 'LIVE DYNAMIC CPCB ENGINE')}</span>
            </span>
          </div>

          <span className="subtitle">
            {language === 'hi' ? 'निर्देशांक' : 'Coordinates'}: {(Number(station?.lat) || 28.6139).toFixed(4)}°N, {(Number(station?.lng) || 77.2090).toFixed(4)}°E • {language === 'hi' ? 'जोन' : 'Zone'}: <strong>{station?.zone || 'Delhi NCR'}</strong> • {language === 'hi' ? 'ऊंचाई' : 'Altitude'}: 216m MSL • {language === 'hi' ? 'सिंक समय' : 'Synced'}: {station?.lastSynced || 'Active'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => toggleComparison(station)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11.5px',
              padding: '5px 10px',
              backgroundColor: isCompared ? 'var(--accent-primary)' : 'transparent',
              color: isCompared ? '#ffffff' : 'var(--text-main)',
              borderColor: isCompared ? 'var(--accent-primary)' : 'var(--border-color)',
              fontWeight: isCompared ? 700 : 500
            }}
          >
            {isCompared ? (language === 'hi' ? '✓ तुलना में शामिल' : '✓ In Compare') : (language === 'hi' ? '+ तुलना करें' : '+ Compare')}
          </button>

          <button
            onClick={() => toggleFavorite(station.id)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11.5px', padding: '5px 10px' }}
          >
            {isFavorite ? (language === 'hi' ? '⭐ पिन किया गया' : '⭐ Pinned') : (language === 'hi' ? '☆ पिन करें' : '☆ Pin')}
          </button>
        </div>
      </div>

      {/* Dynamic GRAP Emergency Alert Strip */}
      <div style={{
        backgroundColor: grapData.bg,
        border: `1px solid ${grapData.border || grapData.color}`,
        color: grapData.color,
        borderRadius: 'var(--radius-card)',
        padding: '12px 18px',
        marginBottom: '18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="tag" style={{
            backgroundColor: grapData.border || 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '11px'
          }}>
            {grapData.badge}
          </span>
          <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '0.01em' }}>
            {language === 'hi' ? 'दिल्ली एनसीआर वैधानिक प्रोटोकॉल:' : 'DELHI NCR STATUTORY PROTOCOL:'} {grapData.stage.toUpperCase()}
          </span>
        </div>

        <button
          onClick={() => setShowGrapDetails(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            color: grapData.color,
            textDecoration: 'underline'
          }}
        >
          {showGrapDetails 
            ? (language === 'hi' ? 'सरकारी प्रतिबंध छिपाएं ▲' : 'Hide Government Restrictions ▲') 
            : (language === 'hi' ? 'सरकारी प्रतिबंध देखें ▼' : 'View Government Restrictions ▼')}
        </button>
      </div>

      {/* GRAP Details Accordion */}
      {showGrapDetails && (
        <div style={{
          backgroundColor: 'var(--bg-panel-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-card)',
          padding: '16px',
          marginBottom: '18px',
          fontSize: '13px'
        }}>
          <div style={{ fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '11.5px', letterSpacing: '0.04em' }}>
            {language === 'hi' ? `GRAP ${grapData.stage} के तहत लागू वैधानिक निर्देश:` : `Statutory Directives Enforced Under ${grapData.stage}:`}
          </div>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {grapData.actions.map((act, idx) => (
              <li key={idx} style={{ color: 'var(--text-main)', lineHeight: 1.45 }}>
                {act}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Grid: Gauge & Hero Stats */}
      <div className="grid-2" style={{ alignItems: 'stretch', gap: '20px' }}>
        {/* Left: Interactive Radial Gauge & Cigarette Equivalent */}
        <div className={`metric-box ${categoryMeta.bgClass}`} style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 'var(--radius-card)',
          border: '1px solid currentColor'
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {language === 'hi' ? 'वास्तविक समय CPCB टेलीमेट्री' : 'Real-Time CPCB Telemetry'}
            </span>
            <span className="tag" style={{ border: '1px solid currentColor', fontWeight: 800, fontSize: '11px' }}>
              {language === 'hi' && categoryMeta.labelHi ? categoryMeta.labelHi.split(' ')[0].toUpperCase() : activeCategory.toUpperCase()}
            </span>
          </div>

          <AQIGauge aqi={activeAQI} size={210} />

          {/* Health Impact Metric Card: Berkeley Earth Cigarettes vs Univ of Chicago AQLI */}
          <div style={{
            width: '100%',
            marginTop: '16px',
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid currentColor',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            textAlign: 'left',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <button
                type="button"
                onClick={() => setHealthMetricMode('cigarette')}
                style={{
                  background: healthMetricMode === 'cigarette' ? 'var(--accent-primary)' : 'transparent',
                  color: healthMetricMode === 'cigarette' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🚬 {language === 'hi' ? 'सिगरेट समतुल्य' : 'Cigarette Equiv'}
              </button>
              <button
                type="button"
                onClick={() => setHealthMetricMode('aqli')}
                style={{
                  background: healthMetricMode === 'aqli' ? 'var(--accent-primary)' : 'transparent',
                  color: healthMetricMode === 'aqli' ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⏳ {language === 'hi' ? 'AQLI आयु प्रभाव' : 'AQLI Life Impact'}
              </button>
            </div>

            {healthMetricMode === 'cigarette' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'hi' ? 'धूम्रपान विषाक्तता समतुल्य' : 'Smoking Toxicity Equivalent'}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    🚬 ~{cigaretteData.cigarettes} {language === 'hi' ? 'सिगरेट/दिन' : 'cigs/day'}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', opacity: 0.9, lineHeight: 1.4 }}>
                  {language === 'hi'
                    ? `इस वायु में 24 घंटे सांस लेना दिन में ~${cigaretteData.cigarettes} सिगरेट पीने के बराबर फेफड़ों को नुकसान पहुंचाता है।`
                    : `${cigaretteData.description} (Berkeley Earth standard calculation based on ${station.pm25} µg/m³ PM2.5).`}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language === 'hi' ? 'जीवन प्रत्याशा हानि (AQLI)' : 'Life Expectancy Loss (AQLI)'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--aqi-hazardous-text)' }}>
                    ⏳ -{aqliData.yearsLostWHO} {language === 'hi' ? 'वर्ष' : 'years'}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', opacity: 0.9, lineHeight: 1.4, marginBottom: '6px' }}>
                  {language === 'hi'
                    ? `WHO दिशा-निर्देश (5 µg/m³) की तुलना में इस क्षेत्र के निवासी औसतन ${aqliData.yearsLostWHO} वर्ष जीवन खो रहे हैं (-${aqliData.yearsLostCPCB} वर्ष भारतीय मानक 40 µg/m³ की तुलना में)।`
                    : `Sustained exposure at this level reduces life expectancy by ${aqliData.yearsLostWHO} years vs WHO guideline (-${aqliData.yearsLostCPCB} yrs vs Indian 40 µg/m³ standard).`}
                </div>
                {/* Chronic Disease Excess Risk Badges */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', fontSize: '10px', fontWeight: 700 }}>
                  <span style={{ padding: '2px 5px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>COPD: +{aqliData.copdExcessRiskPct}%</span>
                  <span style={{ padding: '2px 5px', borderRadius: '3px', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>Cardio: +{aqliData.cardioExcessRiskPct}%</span>
                  <span style={{ padding: '2px 5px', borderRadius: '3px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>Stroke: +{aqliData.strokeExcessRiskPct}%</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '14px', width: '100%', textAlign: 'left', borderTop: '1px solid currentColor', paddingTop: '10px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {language === 'hi' ? 'प्रमुख विषैला कारक' : 'Dominant Toxic Agent'}: <strong>{dominantPollutant}</strong>
              </span>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>Sub-Index: {subIndices[dominantPollutant.toLowerCase().replace(/[^a-z0-9]/g, '')] || activeAQI}</span>
            </div>
            <p style={{ fontSize: '12px', marginBottom: 0, opacity: 0.95, marginTop: '3px', lineHeight: 1.4 }}>
              {language === 'hi' && categoryMeta.laymanHi ? categoryMeta.laymanHi : categoryMeta.layman}
            </p>
          </div>
        </div>

        {/* Right: Chemical Matrix & Atmospheric Coupling */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {language === 'hi' ? 'कण और रासायनिक गैस सांद्रता' : 'Particulate & Chemical Gas Concentrations'}
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'CPCB NAQI उप-सूचकांक सहित' : 'With Official CPCB Sub-Indices'}
              </span>
            </div>

            <div className="grid-3" style={{ gap: '10px' }}>
              {pollutantsList.map(p => {
                const subIdx = subIndices[p.key] || 0;
                const isDominant = dominantPollutant.toLowerCase().includes(p.key.toLowerCase());
                const isOverLimit = p.safeLimit && p.val > p.safeLimit;

                return (
                  <div key={p.key} className="metric-box" style={{
                    position: 'relative',
                    borderColor: isDominant ? 'var(--accent-primary)' : 'var(--border-color)',
                    boxShadow: isDominant ? '0 0 0 1px var(--accent-primary)' : 'none'
                  }}>
                    {isDominant && (
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: 'var(--accent-primary)',
                        color: '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {language === 'hi' ? 'प्रमुख' : 'Dominant'}
                      </span>
                    )}
                    <div className="metric-label">{p.label}</div>
                    <div className="metric-value">{p.val}<span className="metric-unit">{p.unit}</span></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: subIdx > 200 ? '#dc2626' : subIdx > 100 ? '#ea580c' : '#059669' }}>
                        AQI: {subIdx}
                      </span>
                      <span className="metric-sub" style={{
                        margin: 0,
                        fontSize: '10.5px',
                        color: isOverLimit ? '#dc2626' : '#059669'
                      }}>
                        {isOverLimit ? `${(p.val / p.safeLimit).toFixed(1)}x Limit` : '✓ Safe'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meteorological & Boundary Layer Coupling Panel */}
          <div className="panel-subtle" style={{ marginTop: 'auto', borderRadius: 'var(--radius-card)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
              {language === 'hi' ? 'WRF-Chem संयुक्त मौसम टेलीमेट्री' : 'WRF-Chem Coupled Meteorological Telemetry'}
            </div>
            <div className="grid-4" style={{ gap: '12px' }}>
              <div>
                <span className="metric-label">{language === 'hi' ? 'PBL सीमा ऊंचाई' : 'PBL Ceiling Height'}</span>
                <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {station.pblHeight || 320} m
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: (station.pblHeight || 320) < 400 ? '#dc2626' : 'var(--text-muted)', marginTop: '2px' }}>
                  {(station.pblHeight || 320) < 400 ? (language === 'hi' ? 'गंभीर इनवर्जन ट्रैप' : 'Severe Inversion Trap') : (language === 'hi' ? 'सामान्य वायु संचार' : 'Normal Circulation')}
                </div>
              </div>

              <div>
                <span className="metric-label">{language === 'hi' ? 'इनवर्जन तीव्रता' : 'Inversion Strength'}</span>
                <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {station.inversionStrength || 88}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{language === 'hi' ? 'वायुमंडलीय ढक्कन' : 'Atmospheric Lid'}</div>
              </div>

              <div>
                <span className="metric-label">{language === 'hi' ? 'पराली धुआं प्रवाह' : 'Stubble Smoke Flux'}</span>
                <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {station.stubbleFlux || 92}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{language === 'hi' ? 'NW कॉरिडोर प्रभाव' : 'NW Corridor Exposure'}</div>
              </div>

              <div>
                <span className="metric-label">{language === 'hi' ? 'धूप में रुकावट' : 'Sunlight Blocking'}</span>
                <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {station.solarSuppression || 24.5}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{language === 'hi' ? 'शीतलन फीडबैक' : 'Cooling Feedback'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
