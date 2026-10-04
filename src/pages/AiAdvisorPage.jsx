import React, { useState, useId } from 'react';
import { getAIHealthAdvice, findSafeOutdoorWindows, calculatePurifierRequirements } from '../utils/mlEngine';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';
import { exportToJSON, getIsoTimestamp } from '../utils/exportUtils';
import SpringCheck from '../components/SpringCheck';

export default function AiAdvisorPage() {
  const { selectedStation, setSelectedStation, userProfile, setUserProfile, addToast, language, t, stations } = useApp();

  // Dynamic Personal Bio-Parameters
  const [userAge, setUserAge] = useState(32);
  const [outdoorHours, setOutdoorHours] = useState(2);
  const [activityExertion, setActivityExertion] = useState('moderate'); // sedentary, moderate, heavy
  const [maskType, setMaskType] = useState('n95'); // none, cloth, surgical, n95
  const [indoorPurification, setIndoorPurification] = useState('room'); // none, room, whole

  // Selected hour for 24-hr timeline inspection
  const [selectedHourOffset, setSelectedHourOffset] = useState(null);

  // Air Purifier calculator state
  const [roomSqFt, setRoomSqFt] = useState(250);
  const [ceilingHeightFt, setCeilingHeightFt] = useState(9);

  // User action compliance checklist
  const [completedActions, setCompletedActions] = useState({});

  // Generate unique IDs for form accessibility
  const roomAreaId = useId();
  const ceilingHeightId = useId();
  const ageSliderId = useId();
  const outdoorHoursSliderId = useId();
  const activityExertionId = useId();
  const maskTypeId = useId();
  const indoorPurificationId = useId();

  // Reactive computations from mlEngine - fully coupled to personal parameters and language!
  const advice = getAIHealthAdvice(
    selectedStation.aqi,
    userProfile,
    { userAge, outdoorHours, activityExertion, maskType, pm25: selectedStation.pm25 },
    language
  );
  const safeWindows = findSafeOutdoorWindows(selectedStation, userProfile);
  const purifierInfo = calculatePurifierRequirements(roomSqFt, ceilingHeightFt, selectedStation.pm25);

  // Profile metadata (bilingual)
  const profiles = [
    {
      id: 'general',
      title: t('advisor.profiles.general.title', '👤 General Public (Adult)'),
      desc: t('advisor.profiles.general.desc', 'Standard adult with no chronic respiratory issues'),
      defaultAge: 32,
      defaultExertion: 'moderate'
    },
    {
      id: 'children',
      title: t('advisor.profiles.children.title', '👶 Children & Elderly'),
      desc: t('advisor.profiles.children.desc', 'Developing lungs or senior citizens vulnerable to PM2.5'),
      defaultAge: 70,
      defaultExertion: 'sedentary'
    },
    {
      id: 'asthma',
      title: t('advisor.profiles.asthma.title', '🫁 Asthma / COPD Sensitivity'),
      desc: t('advisor.profiles.asthma.desc', 'Pre-existing respiratory conditions, bronchitis, or inhaler reliance'),
      defaultAge: 38,
      defaultExertion: 'sedentary'
    },
    {
      id: 'athlete',
      title: t('advisor.profiles.athlete.title', '🏃 Outdoor Athlete / Runner'),
      desc: t('advisor.profiles.athlete.desc', 'Heavy ventilation during outdoor sports, running, or cycling'),
      defaultAge: 25,
      defaultExertion: 'heavy'
    },
    {
      id: 'pregnant',
      title: t('advisor.profiles.pregnant.title', '🤰 Expectant Mothers'),
      desc: t('advisor.profiles.pregnant.desc', 'Foetal cardiovascular protection from micro-particle penetration'),
      defaultAge: 29,
      defaultExertion: 'sedentary'
    },
    {
      id: 'commuter',
      title: t('advisor.profiles.commuter.title', '🛵 Daily Commuter / Delivery Worker'),
      desc: t('advisor.profiles.commuter.desc', 'Prolonged exposure in roadside diesel smoke corridors'),
      defaultAge: 30,
      defaultExertion: 'moderate'
    }
  ];

  const handleSelectProfile = (profileId) => {
    setUserProfile(profileId);
    const target = profiles.find(p => p.id === profileId);
    if (target) {
      setUserAge(target.defaultAge);
      setActivityExertion(target.defaultExertion);
    }
    // Reset checklist items to fresh profile recommendations
    setCompletedActions({});
    addToast(
      language === 'hi'
        ? `स्वास्थ्य प्रोफाइल बदल कर '${target?.title || profileId}' कर दी गई`
        : `Switched health profile to ${target?.title || profileId}`,
      'info'
    );
  };

  const toggleAction = (idx) => {
    setCompletedActions(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      const newDone = Object.values(next).filter(Boolean).length;
      if (newDone === (advice.actions?.length || 0)) {
        addToast(
          language === 'hi'
            ? '🎉 आज के सभी व्यक्तिगत सुरक्षा प्रोटोकॉल पूरे हुए!'
            : '🎉 All protective safety protocols completed for today!',
          'success'
        );
      }
      return next;
    });
  };

  const actionKeys = advice.actions || [];
  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const progressPercent = actionKeys.length > 0 ? Math.round((completedCount / actionKeys.length) * 100) : 0;

  const handleCheckAll = () => {
    const all = {};
    actionKeys.forEach((_, i) => { all[i] = true; });
    setCompletedActions(all);
    addToast(
      language === 'hi'
        ? '✓ सभी सुरक्षा प्रोटोकॉल पूरे किए गए (+20% सुरक्षा शील्ड)'
        : '✓ All safety protocols completed (+20% protection shield bonus)',
      'success'
    );
  };

  const handleResetChecklist = () => {
    setCompletedActions({});
    addToast(
      language === 'hi'
        ? 'सुरक्षा प्रोटोकॉल चेकलिस्ट रीसेट की गई'
        : 'Safety protocols checklist reset',
      'info'
    );
  };

  // Real-time Dynamic Bio-Dosimetry Calculations
  // Real-world field protection factors (accounting for facial fit, movement & speech)
  const maskEfficiencies = { none: 0.0, cloth: 0.20, surgical: 0.45, n95: 0.80 };
  const maskEfficiency = maskEfficiencies[maskType] ?? 0.45;

  const exertionRates = { sedentary: 0.55, moderate: 1.15, heavy: 2.8 }; // m3/h ventilation
  const baseRate = exertionRates[activityExertion] || 1.15;

  // Continuous physiological age multiplier for respiratory ventilation & alveolar particulate deposition
  // (Based on EPA Inhalation Reference & ICRP Human Respiratory Tract Model)
  let ageFactor = 1.0;
  if (userAge < 18) {
    // Pediatric elevation: from 1.35 at age 4 down to 1.0 at age 18
    ageFactor = 1.0 + Math.max(0, (18 - userAge) * 0.025);
  } else if (userAge > 30) {
    // Senior pulmonary dead space & retention: smoothly scales from 1.0 at age 30 to 1.38 at age 85
    ageFactor = 1.0 + ((userAge - 30) * 0.007);
  }
  ageFactor = Math.round(ageFactor * 100) / 100;

  const personalBreathingRate = baseRate * ageFactor; // m3/h

  // Outdoor vs indoor PM2.5 calculation
  const outdoorPM25 = selectedStation.pm25 || (selectedStation.aqi * 0.7);
  const indoorReductionFactors = { none: 0.65, room: 0.22, whole: 0.08 };
  const indoorPM25 = outdoorPM25 * (indoorReductionFactors[indoorPurification] ?? 0.30);

  // Indoor hourly resting dose (resting breathing rate ~0.45 m3/h)
  const indoorRatePerHour = (0.45 * ageFactor) * indoorPM25;
  // Outdoor hourly dose: accounts for ambient concentration, higher exertion breathing rate, and mask filtration
  const rawOutdoorRatePerHour = personalBreathingRate * outdoorPM25 * (1 - maskEfficiency);
  // Stepping outdoors into Delhi smog always delivers higher particulate deposition than staying indoors in that same hour
  const outdoorRatePerHour = Math.max(rawOutdoorRatePerHour, indoorRatePerHour * 1.25);

  const outdoorDoseUg = outdoorHours * outdoorRatePerHour;
  const indoorHours = Math.max(0, 24 - outdoorHours);
  const indoorDoseUg = indoorHours * indoorRatePerHour;
  const totalInhaledDoseUg = Math.round(outdoorDoseUg + indoorDoseUg);

  // Equivalent cigarettes per day (Berkeley Earth: 1 cigarette ≈ 22 µg/m³ 24h ambient exposure ≈ 238 µg total inhaled lung dose)
  const equivalentCigarettes = Math.max(0.1, Number((totalInhaledDoseUg / 238).toFixed(1)));

  // Vulnerability & Risk Mitigation Score
  const profileVulnerabilityWeights = {
    general: 1.0,
    children: 1.6,
    asthma: 1.85,
    athlete: 1.45,
    pregnant: 1.7,
    commuter: 1.4
  };
  const profileWeight = profileVulnerabilityWeights[userProfile] || 1.0;

  // Unmitigated baseline: reference daily ambient dose if citizen spent 24h outdoors with zero protection
  const referenceAmbientDoseUg = 24 * personalBreathingRate * outdoorPM25;
  const doseMitigatedUg = Math.max(0, referenceAmbientDoseUg - totalInhaledDoseUg);
  const rawRiskReduction = referenceAmbientDoseUg > 0 ? Math.round((doseMitigatedUg / referenceAmbientDoseUg) * 100) : 0;
  
  // Checklist contribution adds up to +15% extra behavioral mitigation
  const checklistBonus = Math.round((completedCount / (actionKeys.length || 1)) * 15);
  // Total Personal Shield Level decreases as outdoor hours increase (loss of indoor sanctuary), and increases with masks, purifiers, and protocol
  const totalProtectionScore = Math.min(99, Math.max(5, Math.round(rawRiskReduction * (1 - (outdoorHours / 24) * 0.15) + checklistBonus)));

  // Determine whether this is a high alert state
  const isHighAlert = advice.outdoorScoreNum < 4.0 || selectedStation.aqi > 200;
  const alertBg = isHighAlert ? 'var(--aqi-unhealthy-bg)' : 'var(--aqi-mod-bg)';
  const alertBorder = isHighAlert ? 'var(--aqi-unhealthy-border)' : 'var(--aqi-mod-border)';
  const alertText = isHighAlert ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-mod-text)';

  // Handle Export Plan
  const handleExportAdvice = () => {
    const data = {
      timestamp: getIsoTimestamp(),
      station: selectedStation.name,
      aqi: selectedStation.aqi,
      category: selectedStation.category,
      pm25: selectedStation.pm25,
      profile: userProfile,
      bioParameters: {
        age: userAge,
        outdoorHours,
        activityExertion,
        maskType,
        indoorPurification,
        estimatedInhaledPM25Micrograms: totalInhaledDoseUg,
        equivalentCigarettesToday: equivalentCigarettes,
        activeProtectionScore: `${totalProtectionScore}%`
      },
      advisory: advice,
      recommendedOutdoorWindow: safeWindows.recommendation,
      airPurifierRequirements: purifierInfo
    };
    exportToJSON(`aeroai_health_plan_${selectedStation.id}_${userProfile}`, data);
    addToast(
      language === 'hi'
        ? '✓ स्वास्थ्य योजना JSON में सफलतापूर्वक सेव की गई'
        : '✓ Personalized health advisory & dosimetry exported to JSON',
      'success'
    );
  };

  // Selected hour for 24-hr window timeline
  const activeInspectionWindow = selectedHourOffset !== null
    ? safeWindows.windows.find(w => w.hourOffset === selectedHourOffset) || safeWindows.bestWindow
    : safeWindows.bestWindow;

  return (
    <div>
      {/* Top Banner */}
      <div className="panel" style={{
        background: 'var(--color-surface)',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', marginBottom: '8px', fontWeight: 600 }}>
              {t('advisor.tag', 'AeroAI Neural Health & Dosimetry Engine')}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('advisor.title', 'Personalized Health, Dosimetry & Purifier Advisor')}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('advisor.subtitle', 'Real-time biological lung deposition modeling calibrated to Delhi ambient PM2.5 at')}{' '}
              <strong>{selectedStation.name}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportAdvice}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: 'var(--radius-btn)', fontWeight: 600 }}
              title="Export complete personalized advisory to JSON"
            >
              {t('advisor.savePlan', 'Save Health Plan')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                {t('common.station', 'Station')}:
              </span>
              <select
                className="input-select"
                value={selectedStation.id}
                onChange={(e) => {
                  const stationList = (stations && stations.length > 0) ? stations : DELHI_STATIONS;
                  const found = stationList.find(s => s.id === e.target.value);
                  if (found) {
                    setSelectedStation(found);
                    addToast(`Updated monitoring station to ${found.shortName} (AQI ${found.aqi})`, 'info');
                  }
                }}
                style={{ padding: '7px 12px', fontSize: '12.5px', fontWeight: 600, borderRadius: 'var(--radius-btn)' }}
              >
                {((stations && stations.length > 0) ? stations : DELHI_STATIONS).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.shortName} (AQI {s.aqi})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Selection + Dynamic Bio-Dosimetry Controls */}
      <div className="grid-2" style={{ gap: '20px', alignItems: 'start', marginBottom: '24px' }}>
        {/* Left Column: Health Profile & Bio Parameters */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>{t('advisor.section1Title', '1. SELECT PROFILE & BIO-PARAMETERS')}</span>
            </div>
            <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)', fontSize: '10px' }}>
              {language === 'hi' ? 'लाइव कैलिब्रेटर' : 'Dynamic Calibrator'}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {t('advisor.section1Desc', 'Select vulnerability tier, then fine-tune your personal exposure variables:')}
          </p>

          {/* Profile Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {profiles.map((p) => {
              const isSelected = userProfile === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProfile(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
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
                      <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                        {p.title}
                      </span>
                      {isSelected && (
                        <span className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '9px', padding: '2px 6px' }}>
                          {t('common.active', 'ACTIVE')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {p.desc}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SpringCheck
                      checked={isSelected}
                      onChange={() => handleSelectProfile(p.id)}
                      strike="none"
                      boxSize={20}
                      boxRadius={10}
                      color="var(--accent-primary)"
                      fillColor="var(--accent-primary)"
                      checkColor="#ffffff"
                      bounce={0.28}
                      ariaLabel={p.title}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Interactive Sliders */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              {t('advisor.calibrationTitle', '⚡ LIVE PERSONAL EXPOSURE CALIBRATION')}
            </div>

            {/* Age Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <label htmlFor={ageSliderId} style={{ cursor: 'pointer' }}>{t('advisor.ageLabel', 'Citizen Age:')}</label>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 800 }}>
                  {userAge} {language === 'hi' ? 'वर्ष' : 'years'}
                </span>
              </div>
              <input
                id={ageSliderId}
                type="range"
                min="4"
                max="85"
                step="1"
                value={userAge}
                onChange={(e) => setUserAge(Number(e.target.value))}
                onInput={(e) => setUserAge(Number(e.target.value))}
                className="range-slider"
                aria-label="Citizen Age"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', userSelect: 'none', pointerEvents: 'none', marginTop: '4px' }}>
                <span>{t('advisor.pediatricAge', '4 yrs (Pediatric)')}</span>
                <span>40 {language === 'hi' ? 'वर्ष' : 'yrs'}</span>
                <span>{t('advisor.geriatricAge', '85 yrs (Geriatric)')}</span>
              </div>
            </div>

            {/* Planned Outdoor Hours Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <label htmlFor={outdoorHoursSliderId} style={{ cursor: 'pointer' }}>{t('advisor.outdoorHoursLabel', 'Outdoor Exposure Today:')}</label>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 800 }}>
                  {outdoorHours} {language === 'hi' ? 'घंटे' : 'hours'}
                </span>
              </div>
              <input
                id={outdoorHoursSliderId}
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={outdoorHours}
                onChange={(e) => setOutdoorHours(Number(e.target.value))}
                onInput={(e) => setOutdoorHours(Number(e.target.value))}
                className="range-slider"
                aria-label="Outdoor Exposure Today"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', userSelect: 'none', pointerEvents: 'none', marginTop: '4px' }}>
                <span>{t('advisor.strictQuarantine', '0h (Strict Quarantine)')}</span>
                <span>4h</span>
                <span>{t('advisor.fieldCommute', '12h (Field / Commute)')}</span>
              </div>
            </div>

            {/* Activity Level and Mask Selection Grid */}
            <div className="grid-2" style={{ gap: '10px' }}>
              <div>
                <label htmlFor={activityExertionId} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  {t('advisor.exertionLabel', 'Exertion Level:')}
                </label>
                <select
                  id={activityExertionId}
                  className="input-select"
                  value={activityExertion}
                  onChange={(e) => setActivityExertion(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
                >
                  <option value="sedentary">{t('advisor.exertionOptions.sedentary', 'Resting / Sedentary (0.5 m³/h)')}</option>
                  <option value="moderate">{t('advisor.exertionOptions.moderate', 'Walking / Commuting (1.1 m³/h)')}</option>
                  <option value="heavy">{t('advisor.exertionOptions.heavy', 'Running / Heavy Exertion (2.8 m³/h)')}</option>
                </select>
              </div>

              <div>
                <label htmlFor={maskTypeId} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  {t('advisor.maskLabel', 'Mask Protection:')}
                </label>
                <select
                  id={maskTypeId}
                  className="input-select"
                  value={maskType}
                  onChange={(e) => setMaskType(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
                >
                  <option value="none">{t('advisor.maskOptions.none', 'No Mask (0% filtration)')}</option>
                  <option value="cloth">{t('advisor.maskOptions.cloth', 'Cloth Mask (20% filtration)')}</option>
                  <option value="surgical">{t('advisor.maskOptions.surgical', 'Surgical Mask (45% filtration)')}</option>
                  <option value="n95">{t('advisor.maskOptions.n95', 'Certified N95 / FFP2 (95% filtration)')}</option>
                </select>
              </div>
            </div>

            {/* Indoor HEPA Status */}
            <div>
              <label htmlFor={indoorPurificationId} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {t('advisor.filtrationLabel', 'Indoor Air Filtration Status:')}
              </label>
              <select
                id={indoorPurificationId}
                className="input-select"
                value={indoorPurification}
                onChange={(e) => setIndoorPurification(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
              >
                <option value="none">{t('advisor.purificationOptions.none', 'Standard Unfiltered Room (70% outdoor smog enters)')}</option>
                <option value="room">{t('advisor.purificationOptions.room', 'Single Room HEPA Purifier (78% indoor smog filtered)')}</option>
                <option value="whole">{t('advisor.purificationOptions.whole', 'Sealed Whole-Home HEPA Filtration (92% filtered)')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Personalized AeroAI Output & Dynamic Dosimetry */}
        <div className="panel" style={{ border: '2px solid var(--accent-primary)', backgroundColor: 'var(--bg-page)' }}>
          <div className="panel-header" style={{ marginBottom: '14px' }}>
            <div className="panel-title">
              <span>{t('advisor.section2Title', '2. PERSONALIZED AeroAI OUTPUT')}</span>
            </div>
            <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)', borderColor: 'var(--border-dark)', fontSize: '10px' }}>
              {advice.status}
            </span>
          </div>

          {/* Theme-Aware High-Contrast Advisory Headline Box */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: alertBg,
            border: `2px solid ${alertBorder}`,
            color: alertText,
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {advice.title}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.3, color: alertText }}>
              "{advice.simpleHeadline}"
            </div>
          </div>

          <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '16px' }}>
            {advice.advice}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid-3" style={{ gap: '10px', marginBottom: '16px' }}>
            <div className="metric-box" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="metric-label">{t('advisor.outdoorScore', 'Outdoor Score')}</div>
              <div className="metric-value" style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span>{advice.outdoorScore}</span>
                {advice.outdoorRating && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: advice.outdoorRatingBg,
                    color: advice.outdoorRatingColor
                  }}>
                    {advice.outdoorRating}
                  </span>
                )}
              </div>
              {/* Mini visual safety progress bar */}
              <div style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'var(--border-color)',
                borderRadius: '2px',
                marginTop: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.max(5, Math.min(100, (advice.outdoorScoreNum / 10) * 100))}%`,
                  backgroundColor: advice.outdoorRatingColor,
                  transition: 'width 0.4s ease, background-color 0.4s ease'
                }} />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{t('advisor.maskRequired', 'Mask Required?')}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 800,
                color: advice.maskRecommended ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-good-text)',
                backgroundColor: advice.maskRecommended ? 'var(--aqi-unhealthy-bg)' : 'var(--aqi-good-bg)',
                padding: '4px 6px',
                marginTop: '4px'
              }}>
                {advice.maskRecommended
                  ? (language === 'hi' ? '😷 हाँ (N95 अनिवार्य)' : '😷 YES (N95)')
                  : (language === 'hi' ? '✓ वैकल्पिक' : '✓ OPTIONAL')}
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{t('advisor.ventilateWindows', 'Ventilate Windows?')}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 800,
                color: advice.ventilateHome ? 'var(--aqi-good-text)' : 'var(--aqi-unhealthy-text)',
                backgroundColor: advice.ventilateHome ? 'var(--aqi-good-bg)' : 'var(--aqi-unhealthy-bg)',
                padding: '4px 6px',
                marginTop: '4px'
              }}>
                {advice.ventilateHome
                  ? (language === 'hi' ? '✓ खुली रख सकते हैं' : '✓ ALLOWED')
                  : (language === 'hi' ? '🔒 बंद रखें' : '🔒 KEEP SHUT')}
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Inhalation Dosimetry Box */}
          <div style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            padding: '14px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t('advisor.dosimetryTitle', '⚡ Real-Time Lung Deposition Dosimetry')}
              </span>
              <span className="tag" style={{
                fontSize: '10px',
                backgroundColor: totalProtectionScore > 75 ? 'var(--aqi-good-bg)' : 'var(--aqi-poor-bg)',
                color: totalProtectionScore > 75 ? 'var(--aqi-good-text)' : 'var(--aqi-poor-text)',
                borderColor: totalProtectionScore > 75 ? 'var(--aqi-good-border)' : 'var(--aqi-poor-border)'
              }}>
                {totalProtectionScore}% {language === 'hi' ? 'सुरक्षा शील्ड' : 'Protection Shield'}
              </span>
            </div>

            <div className="grid-3" style={{ gap: '8px' }}>
              <div style={{ padding: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('advisor.inhaledPM25', '24H PM2.5 INHALED')}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginTop: '2px' }}>
                  {totalInhaledDoseUg} <span style={{ fontSize: '11px' }}>µg</span>
                </div>
              </div>

              <div style={{ padding: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('advisor.cigaretteEquiv', 'CIGARETTE EQUIVALENT')}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: equivalentCigarettes > 5 ? 'var(--aqi-unhealthy-text)' : 'var(--text-main)', marginTop: '2px' }}>
                  🚬 {equivalentCigarettes} <span style={{ fontSize: '10px' }}>{language === 'hi' ? 'सिगरेट' : 'cigs'}</span>
                </div>
              </div>

              <div style={{ padding: '8px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('advisor.bioVulnerability', 'BIO-VULNERABILITY')}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginTop: '2px' }}>
                  {profileWeight}x <span style={{ fontSize: '10px' }}>Index</span>
                </div>
              </div>
            </div>

            {/* Dynamic Mitigation Bar */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('advisor.shieldLevel', 'Personal Shield Level (from mask, HEPA & protocol):')}</span>
                <strong style={{ color: 'var(--accent-primary)' }}>
                  {totalProtectionScore}% {language === 'hi' ? 'सुरक्षित' : 'Mitigated'}
                </strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-sharp)' }}>
                <div style={{
                  width: `${totalProtectionScore}%`,
                  height: '100%',
                  backgroundColor: totalProtectionScore > 75 ? 'var(--aqi-good-border)' : totalProtectionScore > 40 ? 'var(--accent-highlight)' : 'var(--aqi-unhealthy-border)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Interactive Compliance Checklist */}
          <div className="panel-subtle" style={{
            backgroundColor: 'var(--bg-panel-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-card, 8px)',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  {t('advisor.checklistTitle', "DAILY PERSONAL SAFETY PROTOCOL")}:
                </span>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {t('advisor.checklistSubtitle', 'Actionable medical measures calibrated for')} {profiles.find(p => p.id === userProfile)?.title || userProfile}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCheckAll}
                  className="btn btn-outline btn-xs"
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px' }}
                  title="Mark all safety actions completed"
                >
                  {language === 'hi' ? '✓ सब चुनें' : '✓ Check All'}
                </button>
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  className="btn btn-outline btn-xs"
                  style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px' }}
                  title="Reset checklist"
                >
                  {language === 'hi' ? '↺ रीसेट' : '↺ Reset'}
                </button>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: progressPercent === 100 ? '#10b981' : 'var(--accent-primary)',
                  backgroundColor: progressPercent === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 180, 216, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  {completedCount}/{actionKeys.length} {language === 'hi' ? 'पूरा' : 'Done'} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-primary)',
                transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>

            {/* 100% Complete Banner */}
            {progressPercent === 100 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                <span>🛡️</span>
                <span>
                  {language === 'hi'
                    ? 'शानदार! 100% सुरक्षा शील्ड सक्रिय (+20% व्यवहारिक जोखिम न्यूनीकरण)'
                    : '100% Maximum Protection Active (+20% behavioral risk mitigation added)'}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {actionKeys.map((act, i) => {
                const isChecked = !!completedActions[i];
                return (
                  <SpringCheck
                    key={i}
                    className="spring-check--card"
                    checked={isChecked}
                    onChange={() => toggleAction(i)}
                    color="var(--text-main)"
                    fillColor="var(--accent-primary)"
                    checkColor="#ffffff"
                    boxSize={22}
                    boxRadius={6}
                    fontSize={13}
                    bounce={0.25}
                    strikeLag={0.10}
                    doneOpacity={0.45}
                    strike="left"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            backgroundColor: isChecked ? 'var(--accent-primary)' : 'var(--border-color)',
                            color: isChecked ? '#ffffff' : 'var(--text-muted)',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ lineHeight: 1.4 }}>{act}</span>
                        </div>
                        {isChecked && (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            color: 'var(--accent-primary)',
                            backgroundColor: 'rgba(0, 180, 216, 0.12)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}>
                            {language === 'hi' ? '✓ सुरक्षित' : '✓ DONE'}
                          </span>
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Feature 1: Safe Outdoor Window Finder (Interactive 24-hr Timeline) */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span>{t('advisor.safeWindowsTitle', '24-HOUR OPTIMAL OUTDOOR TIME WINDOWS')}</span>
            </div>
            <span className="subtitle">
              {t('advisor.safeWindowsSubtitle', 'AI scans planetary boundary layer expansion to locate hours with lowest PM2.5 entrapment.')}
            </span>
          </div>
          <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
            WRF-Chem Diurnal Analysis
          </span>
        </div>

        {/* Current Recommendation Summary */}
        <div style={{
          backgroundColor: 'var(--bg-page)',
          border: '1px solid var(--border-color)',
          padding: '14px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'AeroAI अनुशंसित सुरक्षित समय:' : 'AeroAI Optimal Timing Recommendation:'}
            </span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
              {safeWindows.recommendation}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {language === 'hi' ? 'सर्वश्रेष्ठ समय:' : 'Peak Dispersal Hour:'} <strong>{safeWindows.bestWindow.timeLabel}</strong> | AQI: <strong>{safeWindows.bestWindow.aqi}</strong> | PBL: <strong>{safeWindows.bestWindow.pblHeight}m</strong>
          </div>
        </div>

        {/* Interactive 24-Hour Timeline Grid */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
          {language === 'hi' ? 'किसी भी घंटे पर क्लिक करके वायुमंडलीय स्थिति देखें:' : 'CLICK ANY HOUR TO INSPECT DIURNAL ATMOSPHERIC DYNAMICS:'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))', gap: '6px', marginBottom: '14px' }}>
          {safeWindows.windows.map((w, idx) => {
            let bg = 'var(--aqi-unhealthy-bg)';
            let text = 'var(--aqi-unhealthy-text)';
            let border = 'var(--aqi-unhealthy-border)';

            if (w.safetyScore >= 60) {
              bg = 'var(--aqi-good-bg)';
              text = 'var(--aqi-good-text)';
              border = 'var(--aqi-good-border)';
            } else if (w.safetyScore >= 40) {
              bg = 'var(--aqi-poor-bg)';
              text = 'var(--aqi-poor-text)';
              border = 'var(--aqi-poor-border)';
            }

            const isBest = w.hourOffset === safeWindows.bestWindow.hourOffset;
            const isCurrentlyInspected = (selectedHourOffset === w.hourOffset) || (selectedHourOffset === null && isBest);

            return (
              <div
                key={idx}
                onClick={() => setSelectedHourOffset(w.hourOffset)}
                style={{
                  backgroundColor: bg,
                  color: text,
                  border: isCurrentlyInspected ? '2px solid var(--accent-primary)' : `1px solid ${border}`,
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transform: isCurrentlyInspected ? 'scale(1.04)' : 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: isCurrentlyInspected ? '0 2px 8px rgba(0,0,0,0.18)' : 'none'
                }}
                title={`Click to inspect ${w.timeLabel}: AQI ${w.aqi}, PBL ${w.pblHeight}m`}
              >
                <div style={{ fontWeight: 700 }}>
                  {w.timeLabel.split(',')[1] || w.timeLabel}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {w.aqi}
                </div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', marginTop: '2px' }}>
                  {isBest ? '⭐ BEST' : `${w.safetyScore}% Safe`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hour Detailed Inspector */}
        <div style={{
          backgroundColor: 'var(--bg-panel-subtle)',
          border: '1px solid var(--border-color)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? 'चयनित समय विवरण' : 'Inspected Diurnal Window'} ({activeInspectionWindow.timeLabel}):
            </span>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
              AQI: <span style={{ color: 'var(--accent-primary)' }}>{activeInspectionWindow.aqi}</span> | Planetary Boundary Layer: <span style={{ color: 'var(--accent-primary)' }}>{activeInspectionWindow.pblHeight} meters</span> | Safety Rating: <strong>{activeInspectionWindow.safetyScore}%</strong>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {activeInspectionWindow.pblHeight < 300
              ? (language === 'hi' ? '⚠️ वायुमंडलीय ढक्कन बहुत नीचा है। धुआं ऊपर नहीं जा पा रहा।' : '⚠️ Ground inversion lid is rigid. Smog cannot dilute vertically.')
              : (language === 'hi' ? '🌤️ दोपहर की धूप से सीमा परत फैली है, धुआं छंट रहा है।' : '🌤️ Thermal updrafts expand boundary layer, diluting ground smoke.')}
          </div>
        </div>
      </div>

      {/* Feature 2: HEPA Air Purifier Sizing Calculator */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span>{t('advisor.purifierTitle', 'ROOM AIR PURIFIER CADR & HEPA CALCULATOR')}</span>
            </div>
            <span className="subtitle">
              {t('advisor.purifierSubtitle', 'Calculate exact mechanical clean air delivery rate needed to keep indoor PM2.5 below 25 µg/m³.')}
            </span>
          </div>
          <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
            AHAM Standard AC-1
          </span>
        </div>

        <div className="grid-2" style={{ gap: '24px', alignItems: 'center' }}>
          {/* Controls */}
          <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <label htmlFor={roomAreaId} style={{ cursor: 'pointer' }}>{t('advisor.roomArea', 'Room Floor Area:')}</label>
                <strong>{roomSqFt} sq ft ({(roomSqFt * 0.0929).toFixed(1)} m²)</strong>
              </div>
              <input
                id={roomAreaId}
                type="range"
                min="80"
                max="800"
                step="20"
                value={roomSqFt}
                onChange={(e) => setRoomSqFt(Number(e.target.value))}
                onInput={(e) => setRoomSqFt(Number(e.target.value))}
                className="range-slider"
                aria-label="Room Floor Area"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', userSelect: 'none', pointerEvents: 'none', marginTop: '4px' }}>
                <span>80 sq ft ({language === 'hi' ? 'छोटा बेडरूम' : 'Small Bedroom'})</span>
                <span>800 sq ft ({language === 'hi' ? 'बड़ा लिविंग हॉल' : 'Large Living Hall'})</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <label htmlFor={ceilingHeightId} style={{ cursor: 'pointer' }}>{t('advisor.ceilingHeight', 'Ceiling Height:')}</label>
                <strong>{ceilingHeightFt} {language === 'hi' ? 'फुट' : 'feet'}</strong>
              </div>
              <input
                id={ceilingHeightId}
                type="range"
                min="8"
                max="14"
                step="1"
                value={ceilingHeightFt}
                onChange={(e) => setCeilingHeightFt(Number(e.target.value))}
                onInput={(e) => setCeilingHeightFt(Number(e.target.value))}
                className="range-slider"
                aria-label="Ceiling Height"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', userSelect: 'none', pointerEvents: 'none', marginTop: '4px' }}>
                <span>8 ft ({language === 'hi' ? 'सामान्य छत' : 'Standard Flat'})</span>
                <span>14 ft ({language === 'hi' ? 'ऊंची छत / डुप्लेक्स' : 'High Ceiling / Duplex'})</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid-3" style={{ gap: '10px' }}>
            <div className="metric-box">
              <div className="metric-label">{t('advisor.requiredCADR', 'Required CADR')}</div>
              <div className="metric-value">{purifierInfo.requiredCADR_m3h}<span className="metric-unit">m³/h</span></div>
              <div className="metric-sub">{purifierInfo.requiredCADR_CFM} CFM (5 ACH)</div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{t('advisor.cleanDownTime', '80% Smog Reduction Time')}</div>
              <div className="metric-value">{purifierInfo.cleanupTimeMinutes}<span className="metric-unit">{language === 'hi' ? 'मिनट' : 'mins'}</span></div>
              <div className="metric-sub">&lt;25 µg/m³</div>
            </div>

            <div className="metric-box">
              <div className="metric-label">{t('advisor.estimatedHEPALife', 'HEPA Filter Lifespan')}</div>
              <div className="metric-value">{purifierInfo.filterLifeMonths}<span className="metric-unit">{language === 'hi' ? 'महीने' : 'months'}</span></div>
              <div className="metric-sub">HEPA H13/H14</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
