import React, { useState } from 'react';
import SearchGeocoding from '../components/SearchGeocoding';
import CurrentAQICard from '../components/CurrentAQICard';
import OutdoorWindowOptimizer from '../components/OutdoorWindowOptimizer';
import SourceApportionmentCard from '../components/SourceApportionmentCard';
import OfficialAuditReportModal from '../components/OfficialAuditReportModal';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';
import { speakDirective } from '../utils/audioSynthesizer';

export default function OverviewPage({ onNavigate }) {
  const {
    stations,
    selectedStation,
    setSelectedStation,
    customLocality,
    setCustomLocality,
    favorites,
    lastUpdated,
    addToast,
    language,
    t
  } = useApp();

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const catMeta = AQI_CATEGORIES[selectedStation.category] || AQI_CATEGORIES["Moderate"];

  // Compute NCR Statistics
  const averageAQI = Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length);
  const sortedByAQI = [...stations].sort((a, b) => b.aqi - a.aqi);
  const worstStation = sortedByAQI[0];
  const cleanestStation = sortedByAQI[sortedByAQI.length - 1];

  const favoriteStations = stations.filter(s => favorites.includes(s.id));

  const alertDirectiveText = language === 'hi'
    ? (selectedStation.aqi > 300
        ? 'आज हवा अत्यधिक जहरीली और खतरनाक है। घर के अंदर रहें, दरवाजे-खिड़कियां बंद रखें और एयर प्यूरीफायर चालू रखें।'
        : selectedStation.aqi > 200
          ? 'पूरे दिल्ली एनसीआर में घना स्मॉग है। बाहर निकलते समय N95 मास्क अवश्य पहनें।'
          : 'सामान्य गतिविधियों के लिए वायु गुणवत्ता संतोषजनक है।')
    : (selectedStation.aqi > 300
        ? 'Air is toxic and dangerous today. Stay indoors with doors sealed and air purifiers active.'
        : selectedStation.aqi > 200
          ? 'Smog is heavy across Delhi NCR. You must wear an N95 mask outdoors.'
          : 'Air quality is acceptable for normal outdoor activity.');

  const handleSpeakAlert = () => {
    const spoke = speakDirective(language === 'hi' ? `दिल्ली नागरिक ध्यान दें: ${alertDirectiveText}` : `Attention Delhi citizens: ${alertDirectiveText}`, language);
    if (spoke) {
      addToast(language === 'hi' ? 'आपातकालीन सुरक्षा उद्घोषणा प्रसारित की जा रही है...' : 'Broadcasting voice safety directive...', 'info');
    } else {
      addToast(language === 'hi' ? 'इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है' : 'Text-to-speech audio not supported on this browser', 'info');
    }
  };

  return (
    <div>
      {/* Hero Banner with Modern Elevation */}
      <div className="panel" style={{
        background: 'var(--color-surface)',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span className="tag" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', fontWeight: 600 }}>
                {t('overview.networkTag', 'CPCB Live Telemetry Network')}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {language === 'hi' ? 'अपडेट: ' : 'Updated '} {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="tag" style={{
                backgroundColor: selectedStation.pblHeight < 400 ? 'var(--aqi-unhealthy-bg)' : 'var(--bg-panel)',
                color: selectedStation.pblHeight < 400 ? 'var(--aqi-unhealthy-text)' : 'var(--text-muted)',
                borderColor: selectedStation.pblHeight < 400 ? 'var(--aqi-unhealthy-border)' : 'var(--border-color)',
                fontSize: '11px'
              }}>
                {selectedStation.pblHeight < 400 
                  ? `${t('overview.nocturnalCap', 'Nocturnal Inversion Cap')}: ${selectedStation.pblHeight}m` 
                  : `${t('overview.boundaryLayer', 'Boundary Layer')}: ${selectedStation.pblHeight}m`}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '8px' }}>
              {t('overview.title', 'Delhi NCR Atmospheric Inversion & 72h AQI Intelligence')}
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 0 }}>
              {t('overview.subtitle', 'Real-time coupled weather-chemistry forecasting simulating boundary layer entrapment, NW agricultural smoke advection, and citizen bio-dosimetry across all Delhi localities.')}
            </p>
          </div>

          {/* Quick Active Station Snapshot */}
          <div style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 22px',
            textAlign: 'right',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              {t('overview.activeLocality', 'Active Locality')}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {selectedStation.shortName}
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              marginTop: '4px',
              color: selectedStation.aqi > 300 ? 'var(--aqi-unhealthy-text)' : selectedStation.aqi > 200 ? 'var(--aqi-poor-text)' : 'var(--aqi-good-text)'
            }}>
              {t('common.aqi', 'AQI')} {selectedStation.aqi}: {language === 'hi' && catMeta.labelHi ? catMeta.labelHi.split(' ')[0] : selectedStation.category}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Quick Summary Bar (Cleanest vs Worst vs Delhi Avg) */}
      <div className="panel-subtle" style={{
        backgroundColor: 'var(--bg-panel)',
        marginBottom: '20px',
        padding: '16px 22px',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div className="grid-3" style={{ gap: '16px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {t('overview.ncrAverage', 'Delhi NCR Aggregate Mean AQI')}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginTop: '2px' }}>
              {averageAQI} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                {language === 'hi' ? `(${stations.length} सक्रिय स्टेशनों में)` : `across ${stations.length} active stations`}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {t('overview.mostPolluted', 'Highest Hotspot Locality')}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--aqi-unhealthy-text)', marginTop: '2px' }}>
              {worstStation.shortName} ({t('common.aqi', 'AQI')} {worstStation.aqi})
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              {t('overview.cleanestArea', 'Relatively Cleanest Air')}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--aqi-good-text)', marginTop: '2px' }}>
              {cleanestStation.shortName} ({t('common.aqi', 'AQI')} {cleanestStation.aqi})
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Favorites Quick Navigation Bar */}
      {favoriteStations.length > 0 && (
        <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {t('overview.pinnedStations', 'Pinned Localities:')}
          </span>
          {favoriteStations.map(st => {
            const isSelected = st.id === selectedStation.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-panel)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {st.shortName} ({t('common.aqi', 'AQI')} {st.aqi})
              </button>
            );
          })}
        </div>
      )}

      {/* Safety Alert Directive Banner — High-contrast, polished action bar */}
      <div style={{
        backgroundColor: selectedStation.aqi > 300 ? 'var(--aqi-unhealthy-bg)' : selectedStation.aqi > 200 ? 'var(--aqi-poor-bg)' : 'var(--aqi-good-bg)',
        border: `1px solid ${selectedStation.aqi > 300 ? 'var(--aqi-unhealthy-border)' : selectedStation.aqi > 200 ? 'var(--aqi-poor-border)' : 'var(--aqi-good-border)'}`,
        color: selectedStation.aqi > 300 ? 'var(--aqi-unhealthy-text)' : selectedStation.aqi > 200 ? 'var(--aqi-poor-text)' : 'var(--aqi-good-text)',
        borderRadius: 'var(--radius-panel)',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {language === 'hi' ? 'वास्तविक समय नागरिक सुरक्षा निर्देश' : 'REAL-TIME CITIZEN SAFETY DIRECTIVE'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', lineHeight: 1.3 }}>
            {language === 'hi'
              ? (selectedStation.aqi > 300
                  ? 'आज हवा विषाक्त और खतरनाक है: खिड़कियां-दरवाजे बंद रखें!'
                  : selectedStation.aqi > 200
                    ? 'घना स्मॉग है: बाहर N95 मास्क अनिवार्य है'
                    : 'सामान्य गतिविधियों के लिए हवा स्वीकार्य है')
              : (selectedStation.aqi > 300
                  ? 'AIR IS TOXIC & DANGEROUS TODAY: STAY INDOORS WITH DOORS SEALED!'
                  : selectedStation.aqi > 200
                    ? 'SMOG IS HEAVY: MUST WEAR N95 MASK OUTDOORS'
                    : 'AIR IS ACCEPTABLE FOR NORMAL ACTIVITY')}
          </div>
          <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.95 }}>
            {language === 'hi' && catMeta.laymanHi ? catMeta.laymanHi : catMeta.layman}
          </div>
        </div>

        {/* Action Controls in Directive Banner */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Voice alert button */}
          <button
            onClick={handleSpeakAlert}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'currentColor',
              color: 'currentColor',
              fontSize: '12px',
              padding: '6px 12px',
              fontWeight: 700,
              backgroundColor: 'var(--bg-glass)'
            }}
            title={language === 'hi' ? 'आपातकालीन सलाह आवाज़ में सुनें' : 'Speak emergency advisory through Web Speech synthesis'}
          >
            {language === 'hi' ? 'आवाज़ चेतावनी' : 'Voice Alert'}
          </button>

          {/* Official Audit Certificate Modal Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'currentColor',
              color: 'currentColor',
              fontSize: '12px',
              padding: '6px 12px',
              fontWeight: 700,
              backgroundColor: 'var(--bg-glass)'
            }}
            title={language === 'hi' ? 'आधिकारिक पर्यावरण ऑडिट रिपोर्ट तैयार करें' : 'Generate print-ready official environmental telemetry audit'}
          >
            {language === 'hi' ? 'ऑडिट रिपोर्ट' : 'Audit Report'}
          </button>

          {/* Health Advice Button */}
          <button
            onClick={() => onNavigate('ai-advisor')}
            className="btn btn-sm"
            style={{
              backgroundColor: selectedStation.aqi > 300 ? '#7a1d1d' : selectedStation.aqi > 200 ? '#7c3514' : 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-btn)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{language === 'hi' ? 'व्यक्तिगत स्वास्थ्य सलाह' : 'Personal Health Advice'}</span>
          </button>
        </div>
      </div>

      {/* Locality Search & Geocoding Bar */}
      <SearchGeocoding
        onSelectStation={setSelectedStation}
        onCustomLocationSelect={(loc) => setCustomLocality(loc)}
      />

      {/* Main AQI Status Card */}
      <CurrentAQICard
        station={selectedStation}
        customLocality={customLocality}
      />

      {/* Diurnal Exposure Budget & Safe Outdoor Window Optimizer */}
      <OutdoorWindowOptimizer
        station={selectedStation}
        onNavigate={onNavigate}
      />

      {/* Real-Time Pollution Source Attribution & Fingerprinting */}
      <SourceApportionmentCard
        station={selectedStation}
      />

      {/* Feature Gateway Cards */}
      <div style={{ marginTop: '24px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
          marginBottom: '12px'
        }}>
          {language === 'hi' ? 'वायुमंडलीय इंटेलिजेंस मॉड्यूल देखें:' : 'Explore Atmospheric Intelligence Modules:'}
        </div>

        <div className="grid-3" style={{ gap: '18px' }}>
          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('ai-advisor')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'AeroAI स्वास्थ्य सलाहकार' : 'AeroAI Health Advisor'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? 'बायो-डोसिमेट्री व सुरक्षित समय' : 'Bio-Dosimetry & Safe Windows'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'बच्चों और दमा रोगियों के लिए अनुकूलित आउटडोर समय, हेपा प्यूरीफायर क्षमता गणना और स्वास्थ्य सुरक्षा स्कोर।'
                : 'Dynamic outdoor safety windows, HEPA air purifier CADR sizing, and custom profiles for children and asthmatics.'}
            </p>
          </div>

          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('route-planner')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'सुरक्षित यात्रा योजना' : 'Commute Exposure Planner'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? 'दिल्ली रूट व यात्रा जोखिम' : 'Delhi Route & Transit Dose'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'भीड़-भाड़ के समय फेफड़ों में जाने वाले जहरीले कणों को कम करने के लिए मेट्रो, कैब और बाइक मार्गों की तुलना करें।'
                : 'Compare Metro vs AC Cab vs Bike routes to minimize inhaled toxic micro-particulates during rush hours.'}
            </p>
          </div>

          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('forecast')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? '72-घंटे पूर्वानुमान व नीतियां' : '72-Hour Outlook & Policy'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? 'WRF-Chem प्रति घंटा सिमुलेटर' : 'WRF-Chem Hourly Policy Simulator'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'ऑड-ईवन, पराली दहन रोकथाम और बारिश के प्रभाव का 72-घंटे के प्रदूषण प्रक्षेपवक्र पर सिमुलेशन करें।'
                : 'Simulate Odd-Even, stubble burning crackdowns, and precipitation washout effects on 72h trajectories.'}
            </p>
          </div>

          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('inversion')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'वायुमंडलीय भौतिकी' : 'Atmospheric Physics'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? '2D सीमा परत सिमुलेशन' : '2D Boundary Layer Simulation'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'जमीन पर स्मॉग कैद होने, धूप रुकने और एंटी-स्मॉग गन के प्रभाव का 2D भौतिकी क्रॉस-सेक्शन सिमुलेशन।'
                : 'Interactive 2D physics cross-section of ground smog entrapment, solar suppression feedback, and water mist guns.'}
            </p>
          </div>

          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('layman')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'प्रदूषण की आसान गाइड' : 'Air Simplified (Bilingual)'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? 'सरल भाषा व मास्क विज़ार्ड' : 'Easy Reading & Mask Wizard'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'हिंदी व अंग्रेजी में स्पष्टीकरण, मास्क फिल्ट्रेशन दक्षता परीक्षक, लक्षण गाइड और भ्रांतियों का निवारण।'
                : 'English & Hindi explanations, mask filtration efficiency checker, symptom diagnostics, and myth busters.'}
            </p>
          </div>

          <div
            className="panel-subtle"
            style={{
              backgroundColor: 'var(--bg-panel)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onNavigate('blockchain')}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
              {language === 'hi' ? 'AeroLedger सुरक्षा' : 'AeroLedger Security'}
            </div>
            <h4 style={{ marginBottom: '6px', fontSize: '16px' }}>{language === 'hi' ? 'क्रिप्टोग्राफिक प्रूफ व टेस्ट' : 'Cryptographic Proofs & Tamper Test'}</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0 }}>
              {language === 'hi'
                ? 'सेंसर में छेड़छाड़ के हमलों का परीक्षण करें और दिल्ली के सभी 16 नोड्स के मर्कल रूट को सत्यापित करें।'
                : 'Simulate sensor forgery attacks in the cryptographic sandbox and verify Merkle roots for all 16 Delhi nodes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Audit Report Modal */}
      <OfficialAuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        station={selectedStation}
      />
    </div>
  );
}
