import React from 'react';
import { useApp } from '../context/useApp';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import { calculateCigaretteEquivalent } from '../utils/mlEngine';
import { exportToCSV } from '../utils/exportUtils';

export default function StationCompareModal() {
  const {
    stations = [],
    comparisonList,
    toggleComparison,
    clearComparison,
    setComparisonStations,
    isCompareModalOpen,
    setIsCompareModalOpen,
    setSelectedStation,
    language
  } = useApp();

  const isHindi = language === 'hi';

  // Keyboard Escape to dismiss modal
  React.useEffect(() => {
    if (!isCompareModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        setIsCompareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isCompareModalOpen, setIsCompareModalOpen]);

  if (!isCompareModalOpen) return null;

  const presets = [
    {
      id: 'hotspots',
      name: isHindi ? '🔥 4 प्रमुख हॉटस्पॉट' : '🔥 Top Smog Hotspots',
      desc: isHindi ? 'आनंद विहार, जहांगीरपुरी, पंजाबी बाग, बवाना' : 'Anand Vihar, Jahangirpuri, Punjabi Bagh, Bawana',
      stationIds: ['anand-vihar', 'jahangirpuri', 'punjabi-bagh', 'bawana']
    },
    {
      id: 'best-worst',
      name: isHindi ? '🟢 सबसे स्वच्छ बनाम सबसे प्रदूषित' : '🟢 Cleanest vs Worst Air',
      desc: isHindi ? 'मंदिर मार्ग, लोधी रोड, आनंद विहार, नरेला' : 'Mandir Marg, Lodhi Road, Anand Vihar, Narela',
      stationIds: ['mandir-marg', 'lodhi-road', 'anand-vihar', 'narela']
    },
    {
      id: 'central-vip',
      name: isHindi ? '🏛️ मध्य दिल्ली व वीआईपी क्षेत्र' : '🏛️ Central VIP Corridor',
      desc: isHindi ? 'कनॉट प्लेस, मंदिर मार्ग, आर.के. पुरम, पूसा' : 'Connaught Place, Mandir Marg, RK Puram, Pusa',
      stationIds: ['connaught-place', 'mandir-marg', 'rk-puram', 'pusa']
    },
    {
      id: 'industrial',
      name: isHindi ? '🏭 औद्योगिक व सीमावर्ती क्षेत्र' : '🏭 Industrial & Border Belt',
      desc: isHindi ? 'बवाना, नरेला, ओखला, आनंद विहार' : 'Bawana, Narela, okhla-phase-2',
      stationIds: ['bawana', 'narela', 'okhla-phase-2', 'anand-vihar']
    }
  ];

  const handleLoadPreset = (preset) => {
    const matched = preset.stationIds.map(id => stations.find(s => s.id === id)).filter(Boolean);
    if (setComparisonStations) {
      setComparisonStations(matched);
    } else {
      clearComparison();
      matched.forEach(s => toggleComparison(s));
    }
  };

  const handleSelectStationToAdd = (e) => {
    const id = e.target.value;
    if (!id) return;
    const found = stations.find(s => s.id === id);
    if (found) {
      toggleComparison(found);
    }
    e.target.value = '';
  };

  const handleExport = () => {
    const rows = comparisonList.map(st => {
      const cig = calculateCigaretteEquivalent(st.pm25);
      return {
        Station: st.name,
        Zone: st.zone,
        AQI: st.aqi,
        Category: st.category,
        PM25_ugm3: st.pm25,
        PM10_ugm3: st.pm10,
        PBL_Ceiling_m: st.pblHeight,
        Inversion_Strength_pct: st.inversionStrength,
        Stubble_Flux_pct: st.stubbleFlux,
        Wind_kmh: st.windSpeed,
        Cigarettes_Equiv: cig.cigarettes
      };
    });
    exportToCSV(`delhi_station_comparison_${Date.now()}`, rows);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCompareModalOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 2600,
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
          border: '2px solid var(--accent-primary)',
          width: '100%',
        maxWidth: '1150px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '24px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '4px' }}>
              {isHindi ? 'तुलनात्मक पर्यावरण मैट्रिक्स' : 'Side-by-Side Environmental Matrix'}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0' }}>
              {isHindi ? 'दिल्ली स्टेशन तुलना व रासायनिक विश्लेषण' : 'Side-by-Side Delhi Locality Environmental Audit'}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isHindi
                ? `वर्तमान में ${comparisonList.length}/4 स्टेशन तुलना सूची में चयनित हैं।`
                : `Comparing ${comparisonList.length}/4 monitoring locations across chemical and atmospheric dispersion variables.`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {comparisonList.length > 0 && (
              <button
                onClick={handleExport}
                className="btn btn-outline btn-sm"
              >
                📥 {isHindi ? 'CSV डाउनलोड' : 'Export CSV'}
              </button>
            )}
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="btn btn-outline btn-sm"
              >
                ↺ {isHindi ? 'सभी हटाएं' : 'Clear All'}
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="btn btn-sm"
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px'
              }}
              title="Close modal (Esc)"
            >
              ✕ {isHindi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

        {/* Interactive Station Picker & Quick Presets Bar */}
        <div style={{
          padding: '14px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-panel-subtle)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', flexShrink: 0 }}>
                ➕ {isHindi ? 'स्टेशन जोड़ें:' : 'Add Station:'}
              </span>
              <select
                onChange={handleSelectStationToAdd}
                defaultValue=""
                className="input-select"
                style={{ flex: 1, padding: '7px 10px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="" disabled>
                  {isHindi ? '-- तुलना हेतु स्टेशन चुनें (38 उपलब्ध) --' : '-- Select a Delhi station to add (38 available) --'}
                </option>
                {stations.map(st => {
                  const already = comparisonList.some(c => c.id === st.id);
                  return (
                    <option key={st.id} value={st.id} disabled={already || comparisonList.length >= 4}>
                      {st.shortName} (AQI {st.aqi} • {st.zone}) {already ? '✓ Added' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {comparisonList.length >= 4 && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-highlight)' }}>
                ℹ️ {isHindi ? 'अधिकतम 4 स्टेशन सीमा पूर्ण' : 'Maximum 4 stations limit reached'}
              </span>
            )}
          </div>

          {/* Quick 1-Click Comparison Presets */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              ⚡ {isHindi ? 'त्वरित 1-क्लिक तुलना प्रीसेट:' : 'Instant 1-Click Comparison Presets:'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p)}
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-page)'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '12px', color: 'var(--text-main)' }}>{p.name}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.2 }}>{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {comparisonList.length === 0 ? (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-panel-subtle)',
            borderRadius: '8px',
            border: '1px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚖️</div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              {isHindi ? 'तुलना के लिए अभी कोई स्टेशन चयनित नहीं है' : 'No stations selected for comparison yet'}
            </p>
            <p style={{ fontSize: '13px', maxWidth: '480px', margin: '0 auto 16px auto' }}>
              {isHindi
                ? 'ऊपर दिए गए ड्रॉपडाउन से स्टेशन चुनें या तुरंत 1-क्लिक प्रीसेट (जैसे "4 प्रमुख हॉटस्पॉट") पर क्लिक करें।'
                : 'Select any station from the dropdown above or click an instant preset to see live side-by-side chemistry and meteorological comparison.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ border: '1px solid var(--border-color)' }}>
              <thead>
                <tr>
                  <th style={{ width: '180px', backgroundColor: 'var(--bg-panel)' }}>Parameter</th>
                  {comparisonList.map(st => (
                    <th key={st.id} style={{ minWidth: '220px', backgroundColor: 'var(--bg-panel-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{st.shortName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.zone}</div>
                        </div>
                        <button
                          onClick={() => toggleComparison(st)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'var(--text-muted)'
                          }}
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Real-Time AQI</td>
                  {comparisonList.map(st => {
                    const catMeta = AQI_CATEGORIES[st.category] || AQI_CATEGORIES["Moderate"];
                    return (
                      <td key={st.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{st.aqi}</span>
                          <span className={`tag ${catMeta.bgClass}`} style={{ fontSize: '11px' }}>{st.category}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>PM2.5 (Fine Dust)</td>
                  {comparisonList.map(st => (
                    <td key={st.id}>
                      <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {st.pm25} µg/m³
                      </span>
                      <div style={{ fontSize: '11px', color: st.pm25 > 60 ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-good-text)' }}>
                        {st.pm25 > 60 ? `⚠️ ${(st.pm25 / 60).toFixed(1)}x above CPCB limit` : 'Within safe limit'}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>PM10 (Road Dust)</td>
                  {comparisonList.map(st => (
                    <td key={st.id} style={{ fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
                      {st.pm10} µg/m³
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>Cigarette Equivalent (24h)</td>
                  {comparisonList.map(st => {
                    const cig = calculateCigaretteEquivalent(st.pm25);
                    return (
                      <td key={st.id}>
                        <div style={{ fontWeight: 800, color: cig.severity === 'extreme' ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-poor-text)', fontSize: '15px' }}>
                          🚬 ~{cig.cigarettes} cigarettes/day
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Inhalation alveolar burden
                        </div>
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>PBL Ceiling (Mixing Height)</td>
                  {comparisonList.map(st => (
                    <td key={st.id}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{st.pblHeight} meters</div>
                      <div style={{ fontSize: '11px', color: st.pblHeight < 400 ? 'var(--aqi-unhealthy-text)' : 'var(--text-muted)' }}>
                        {st.pblHeight < 400 ? 'Severe Ground Smog Trap' : 'Moderate Dispersion'}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>Inversion Trapping %</td>
                  {comparisonList.map(st => (
                    <td key={st.id}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{st.inversionStrength}%</div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', marginTop: '4px' }}>
                        <div style={{ width: `${st.inversionStrength}%`, height: '100%', backgroundColor: st.inversionStrength > 75 ? 'var(--aqi-unhealthy-border)' : 'var(--accent-highlight)' }} />
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>Stubble Smoke Flux</td>
                  {comparisonList.map(st => (
                    <td key={st.id} style={{ fontFamily: 'var(--font-mono)' }}>
                      {st.stubbleFlux}% exposure
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>Wind & Surface Vector</td>
                  {comparisonList.map(st => (
                    <td key={st.id} style={{ fontSize: '12px' }}>
                      {st.windSpeed} km/h • {st.windDirectionText}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ fontWeight: 700 }}>Quick Action</td>
                  {comparisonList.map(st => (
                    <td key={st.id}>
                      <button
                        onClick={() => {
                          setSelectedStation(st);
                          setIsCompareModalOpen(false);
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', fontSize: '11px' }}
                      >
                        Set as Active Locality
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
