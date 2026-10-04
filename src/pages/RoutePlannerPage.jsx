import React, { useState } from 'react';
import { getDistanceKm } from '../utils/geocoding';
import { useApp } from '../context/useApp';
import { exportToJSON } from '../utils/exportUtils';

export default function RoutePlannerPage() {
  const { stations, addToast, language, t } = useApp();

  const [originId, setOriginId] = useState('anand-vihar');
  const [destinationId, setDestinationId] = useState('connaught-place');
  const [transitMode, setTransitMode] = useState('metro'); // 'metro' | 'cab' | 'two-wheeler' | 'cycling'
  const [departureTime, setDepartureTime] = useState('morning'); // 'morning' (08:00) | 'afternoon' (14:00) | 'evening' (19:00)

  const originStation = stations.find(s => s.id === originId) || stations[0];
  const destStation = stations.find(s => s.id === destinationId) || stations[1];

  // Calculate straight-line distance + road winding factor (1.35x)
  const directDistance = getDistanceKm(originStation.lat, originStation.lng, destStation.lat, destStation.lng);
  const routeDistanceKm = Math.max(2, Math.round(directDistance * 1.35 * 10) / 10);

  // Average outdoor PM2.5 between origin and destination
  const routeBasePM25 = Math.round((originStation.pm25 + destStation.pm25) / 2);

  // Time-of-day inversion factor: morning is worst (1.25x), afternoon is best (0.8x), evening is high (1.15x)
  let timeFactor = 1.0;
  if (departureTime === 'morning') timeFactor = 1.25;
  else if (departureTime === 'afternoon') timeFactor = 0.80;
  else if (departureTime === 'evening') timeFactor = 1.15;

  const adjustedOutdoorPM25 = Math.round(routeBasePM25 * timeFactor);

  // Modes config
  const transitModes = {
    metro: {
      name: language === 'hi' ? 'दिल्ली मेट्रो (वातानुकूलित - फ़िल्टर्ड)' : 'Delhi Metro (Air Conditioned)',
      icon: '🚇',
      indoorPM25: 42, // underground/overhead filtered air
      durationMins: Math.round(routeDistanceKm * 2.2 + 8),
      ventilationMultiplier: 1.0, // sitting/standing normal breathing (8 L/min)
      description: language === 'hi' 
        ? 'भूमिगत टनल और ट्रेन के एसी फिल्टर 80-85% प्रदूषण रोकते हैं।' 
        : 'Underground tunnels and train HVAC filters eliminate 80-85% of outdoor soot.'
    },
    cab: {
      name: language === 'hi' ? 'एसी टैक्सी / कार (रीसर्कुलेशन)' : 'AC Taxi / Car (Recirculation)',
      icon: '🚗',
      indoorPM25: 95, // cabin air with AC recirculation
      durationMins: Math.round(routeDistanceKm * 2.8 + 10),
      ventilationMultiplier: 1.0,
      description: language === 'hi'
        ? 'एसी को आंतरिक रीसर्कुलेशन पर रखें; सीधे सड़क के धुएं से बचाता है।'
        : 'Good protection if AC is kept on internal recirculation; avoids direct diesel plumes.'
    },
    'two-wheeler': {
      name: language === 'hi' ? 'मोटरसाइकिल / ऑटो-रिक्शा' : 'Motorcycle / Auto-Rickshaw',
      icon: '🛵',
      indoorPM25: adjustedOutdoorPM25, // direct road exposure
      durationMins: Math.round(routeDistanceKm * 2.4),
      ventilationMultiplier: 1.4, // street alertness and vibration
      description: language === 'hi'
        ? 'सड़क के सीधे धुएं से कोई सुरक्षा नहीं। N95 मास्क अनिवार्य है।'
        : 'Zero protection against tailpipe soot. Breathing directly behind buses and trucks.'
    },
    cycling: {
      name: language === 'hi' ? 'साइकिल / पैदल यात्रा' : 'Bicycle / Walking',
      icon: '🚴',
      indoorPM25: adjustedOutdoorPM25,
      durationMins: Math.round(routeDistanceKm * 4.5),
      ventilationMultiplier: 3.2, // heavy aerobic exertion (25-30 L/min)
      description: language === 'hi'
        ? 'गंभीर स्मॉग में अत्यधिक जोखिम। गहरी सांस से जहरीले कण सीधे फेफड़ों में जाते हैं।'
        : 'Extreme lung hazard during smog episodes. Aerobic breathing sucks particulates into alveoli.'
    }
  };

  const selectedMode = transitModes[transitMode];

  // Inhaled particulate dose formula:
  // Inhaled Dose (µg) = Concentration (µg/m³) * Breathing Rate (m³/min) * Time (mins)
  // Baseline resting breathing rate = 0.008 m³/min (8 L/min)
  const breathingRate = 0.008 * selectedMode.ventilationMultiplier;
  const inhaledDoseMicrograms = Math.round(selectedMode.indoorPM25 * breathingRate * selectedMode.durationMins);

  // Cigarette equivalent of this single commute (1 cigarette = ~22 µg/m³ for 24h = ~253 µg total inhaled dose)
  const commuteCigaretteEquiv = (inhaledDoseMicrograms / 180).toFixed(1);

  const handleExportRoute = () => {
    const data = {
      timestamp: new Date().toISOString(),
      origin: originStation.name,
      destination: destStation.name,
      distanceKm: routeDistanceKm,
      transitMode: selectedMode.name,
      departureWindow: departureTime,
      estimatedDurationMinutes: selectedMode.durationMins,
      estimatedInhaledPM25_ug: inhaledDoseMicrograms,
      commuteCigaretteBurden: commuteCigaretteEquiv,
      maskRequired: transitMode !== 'metro'
    };
    exportToJSON(`commute_exposure_plan_${originId}_to_${destinationId}`, data);
    addToast(language === 'hi' ? 'यात्रा जोखिम योजना JSON में डाउनलोड की गई' : 'Commute exposure plan exported to JSON', 'success');
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '6px' }}>
              {t('route.tag', 'Clean Air Transit Optimizer')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
              {t('route.title', 'Delhi NCR Commute Air Exposure Planner')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('route.subtitle', 'Compare particulate inhalation dosimetry across Delhi Metro, AC Cabs, Two-Wheelers, and Cycling to select the safest travel option.')}
            </p>
          </div>

          <button onClick={handleExportRoute} className="btn btn-outline btn-sm">
            {language === 'hi' ? '📥 यात्रा योजना डाउनलोड करें' : '📥 Save Route Plan'}
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Route Exposure Analysis */}
      <div className="grid-2" style={{ gap: '20px', alignItems: 'start' }}>
        {/* Route Configuration Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>{language === 'hi' ? '1. दिल्ली यात्रा मार्ग चुनें' : '1. PLAN YOUR DELHI COMMUTE ROUTE'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Origin */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('route.origin', 'Departure Station (Origin):')}
              </label>
              <select
                className="input-select"
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {stations.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({t('common.aqi', 'AQI')} {s.aqi})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('route.destination', 'Arrival Station (Destination):')}
              </label>
              <select
                className="input-select"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {stations.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({t('common.aqi', 'AQI')} {s.aqi})
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Time */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('route.departureTime', 'Planned Travel Time:')}
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[
                  { id: 'morning', label: language === 'hi' ? '🌅 सुबह (08:00 - भारी स्मॉग)' : '🌅 Morning (08:00 - Heavy Smog)' },
                  { id: 'afternoon', label: language === 'hi' ? '☀️ दोपहर (14:00 - अपेक्षाकृत सुरक्षित)' : '☀️ Afternoon (14:00 - Safer)' },
                  { id: 'evening', label: language === 'hi' ? '🌆 शाम (19:00 - स्मॉग ट्रैपिंग)' : '🌆 Evening (19:00 - Smog Trap)' }
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => setDepartureTime(w.id)}
                    className="btn btn-outline btn-sm"
                    style={{
                      fontSize: '11px',
                      padding: '5px 8px',
                      backgroundColor: departureTime === w.id ? 'var(--accent-primary)' : 'transparent',
                      color: departureTime === w.id ? '#ffffff' : 'var(--text-main)',
                      borderColor: departureTime === w.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      fontWeight: departureTime === w.id ? 700 : 500
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transit Mode Selection */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('route.selectMode', 'Select Mode of Transport:')}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {Object.entries(transitModes).map(([key, mode]) => {
                  const isSel = transitMode === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setTransitMode(key)}
                      style={{
                        padding: '10px 14px',
                        border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSel ? 'var(--bg-panel-subtle)' : 'var(--bg-page)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px' }}>
                          {mode.icon} {mode.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {mode.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '70px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>~{mode.durationMins}m</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {mode.indoorPM25} µg/m³
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Route Cumulative Inhalation Analysis */}
        <div className="panel" style={{ border: '2px solid var(--accent-primary)', backgroundColor: 'var(--bg-page)' }}>
          <div className="panel-header">
            <div className="panel-title">
              <span>{language === 'hi' ? '2. फेफड़ों में जाने वाले विषैले कणों की मात्रा' : '2. ESTIMATED LUNG INHALATION DOSE'}</span>
            </div>
            <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
              {language === 'hi' ? `दूरी: ${routeDistanceKm} किमी` : `Distance: ${routeDistanceKm} km`}
            </span>
          </div>

          {/* Hero Inhaled Dose Box */}
          <div style={{
            backgroundColor: transitMode === 'cycling' || transitMode === 'two-wheeler' ? 'var(--aqi-unhealthy-bg)' : 'var(--aqi-good-bg)',
            border: `2px solid ${transitMode === 'cycling' || transitMode === 'two-wheeler' ? 'var(--aqi-unhealthy-border)' : 'var(--aqi-good-border)'}`,
            color: transitMode === 'cycling' || transitMode === 'two-wheeler' ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-good-text)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
              {language === 'hi' ? 'अनुमानित कुल श्वसन विषैला PM2.5 डोज:' : 'Estimated Total Inhaled Toxic PM2.5 Dose:'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {inhaledDoseMicrograms}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{language === 'hi' ? 'माइक्रोग्राम (µg)' : 'micrograms (µg)'}</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '6px' }}>
              {language === 'hi' 
                ? `🚬 सिगरेट समतुल्य नुकसान: इस एकल यात्रा के दौरान ~${commuteCigaretteEquiv} सिगरेट पीने के बराबर धुआं अंदर लिया।`
                : `🚬 Commute lung impact equivalent: smoking ~${commuteCigaretteEquiv} cigarettes during this single trip.`}
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid-3" style={{ gap: '10px', marginBottom: '16px' }}>
            <div className="metric-box">
              <div className="metric-label">{language === 'hi' ? 'यात्रा समय' : 'Route Duration'}</div>
              <div className="metric-value">{selectedMode.durationMins}<span className="metric-unit">{language === 'hi' ? 'मिनट' : 'mins'}</span></div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{language === 'hi' ? 'केबिन / सड़क PM2.5' : 'Cabin / Street PM2.5'}</div>
              <div className="metric-value">{selectedMode.indoorPM25}<span className="metric-unit">µg/m³</span></div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{language === 'hi' ? 'श्वसन दर कारक' : 'Ventilation Rate'}</div>
              <div className="metric-value">{selectedMode.ventilationMultiplier}x</div>
              <div className="metric-sub">{transitMode === 'cycling' ? (language === 'hi' ? 'भारी एरोबिक सांस' : 'Aerobic breathing') : (language === 'hi' ? 'सामान्य' : 'Normal')}</div>
            </div>
          </div>

          {/* Commute Recommendations */}
          <div className="panel-subtle" style={{ backgroundColor: 'var(--bg-panel-subtle)', padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {language === 'hi' ? 'AeroAI सुरक्षित यात्रा सलाह:' : 'AeroAI Transit Safety Recommendations:'}
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
              {transitMode === 'metro' && (
                <>
                  <li><strong>{language === 'hi' ? 'सबसे सुरक्षित विकल्प:' : 'Safest Choice:'}</strong> {language === 'hi' ? 'दिल्ली मेट्रो हवा के जहरीले कणों से 80% तक सुरक्षा देती है।' : 'Delhi Metro provides optimal particulate shielding. Inhaled soot is reduced by ~80% compared to road traffic.'}</li>
                  <li>{language === 'hi' ? 'स्टेशनों के बाहरी गेट से गुजरते समय साधारण मास्क पहनें।' : 'Wear a simple mask while walking through above-ground station gates.'}</li>
                </>
              )}
              {transitMode === 'cab' && (
                <>
                  <li><strong>{language === 'hi' ? 'एसी रीसर्कुलेशन चालू रखें:' : 'Keep AC Recirculation ON:'}</strong> {language === 'hi' ? 'दिल्ली के ट्रैफिक जाम में कार की खिड़कियां नीचे न करें।' : 'Do NOT roll down car windows in Delhi traffic jams.'}</li>
                  <li>{language === 'hi' ? 'केबिन के कार्बन फिल्टर कणों को लगभग 60% तक कम कर देते हैं।' : 'Cabin carbon filters reduce particulate intrusion by ~60%.'}</li>
                </>
              )}
              {transitMode === 'two-wheeler' && (
                <>
                  <li><strong style={{ color: 'var(--aqi-unhealthy-text)' }}>{language === 'hi' ? 'N95 मास्क अनिवार्य:' : 'MANDATORY N95 MASK:'}</strong> {language === 'hi' ? 'डीजल वाहनों के धुएं के सीधे संपर्क हेतु सर्टिफाइड N95 मास्क पहनें।' : 'Direct exposure to diesel truck exhaust requires a certified N95 mask with a tight nose clip.'}</li>
                  <li>{language === 'hi' ? 'यदि संभव हो तो यात्रा दोपहर 2 बजे करें जब धूप से प्रदूषण कुछ कम होता है।' : 'Consider shifting departure to 2:00 PM when boundary layer expansion lowers PM2.5 by ~25%.'}</li>
                </>
              )}
              {transitMode === 'cycling' && (
                <>
                  <li><strong style={{ color: 'var(--aqi-unhealthy-text)' }}>{language === 'hi' ? 'उच्च चिकित्सा जोखिम:' : 'HIGH MEDICAL RISK:'}</strong> {language === 'hi' ? `इस AQI में साइकिल चलाने से फेफड़ों में सीधे ${inhaledDoseMicrograms} µg जहरीले कण जमा होंगे।` : `Cycling in current AQI will suck over ${inhaledDoseMicrograms} µg of soot directly into deep alveoli.`}</li>
                  <li>{language === 'hi' ? 'मेट्रो का उपयोग करें या हवा साफ होने तक आउटडोर व्यायाम स्थगित करें।' : 'Switch to Metro or defer outdoor workout until wind speed improves.'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
