import React, { useState } from 'react';
import InversionCanvasGraphic from './InversionCanvasGraphic';
import { classifyStubblePlume } from '../utils/mlEngine';

export default function InversionFeedbackSimulator({ station }) {
  const [pblInput, setPblInput] = useState(station.pblHeight || 340);
  const [stubbleFluxInput, setStubbleFluxInput] = useState(station.stubbleFlux || 80);
  const [windSpeedInput, setWindSpeedInput] = useState(station.windSpeed || 4.5);
  const [activeMitigation, setActiveMitigation] = useState('none'); // 'none' | 'smog-gun' | 'thermal-cannon'

  const plumeAnalysis = classifyStubblePlume(station);

  // Preset Meteorological Events
  const applyPreset = (preset) => {
    if (preset === 'november-smog') {
      setPblInput(210);
      setStubbleFluxInput(95);
      setWindSpeedInput(2.2);
    } else if (preset === 'diwali-fog') {
      setPblInput(240);
      setStubbleFluxInput(85);
      setWindSpeedInput(3.0);
    } else if (preset === 'western-disturbance') {
      setPblInput(780);
      setStubbleFluxInput(15);
      setWindSpeedInput(12.5);
    } else if (preset === 'summer-mixing') {
      setPblInput(850);
      setStubbleFluxInput(5);
      setWindSpeedInput(10.0);
    }
  };

  // Coupled Meteorology-Chemistry Feedback Physics
  const inversionFactor = (800 - pblInput) / 600; // 0 to 1
  const stagnationFactor = (12 - windSpeedInput) / 12; // 0 to 1

  // Mitigation impact
  let mitigationCut = 1.0;
  if (activeMitigation === 'smog-gun') mitigationCut = 0.75;
  else if (activeMitigation === 'thermal-cannon') mitigationCut = 0.60;

  const simulatedPM25 = Math.round(
    (60 + (stubbleFluxInput * 2.8 * inversionFactor) + (stagnationFactor * 80)) * mitigationCut
  );

  const simulatedAQI = Math.min(500, Math.round(simulatedPM25 * 1.3));
  const solarBlockedPercent = Math.round(Math.min(32, (simulatedPM25 / 350) * 28) * 10) / 10;
  const localTempCooling = Math.round((simulatedPM25 / 250) * 1.6 * 10) / 10;

  // Richardson Number approximation (Ri > 0.25 indicates laminar/stable inversion suppression)
  const richardsonNumber = (0.28 * (1000 - pblInput) / (Math.pow(windSpeedInput, 1.8) + 0.1)).toFixed(2);
  const isAtmosphereStable = parseFloat(richardsonNumber) > 0.25;

  return (
    <div className="panel" id="inversion-section">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>COUPLED METEOROLOGY-CHEMISTRY FEEDBACK & INVERSION SIMULATOR</span>
          </div>
          <span className="subtitle">
            Simulate how thermal inversions trap biomass fire plumes and how aerosol sunlight blocking cools the surface.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="tag" style={{
            backgroundColor: plumeAnalysis.riskLevel.includes('HIGH') ? 'var(--aqi-unhealthy-bg)' : 'var(--bg-panel-subtle)',
            color: plumeAnalysis.riskLevel.includes('HIGH') ? 'var(--aqi-unhealthy-text)' : 'inherit',
            borderColor: plumeAnalysis.riskLevel.includes('HIGH') ? 'var(--aqi-unhealthy-border)' : 'var(--border-color)'
          }}>
            Stubble Risk: {plumeAnalysis.riskLevel}
          </span>
          <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
            WRF-Chem Feedback Engine
          </span>
        </div>
      </div>

      {/* Preset Meteorological Scenarios */}
      <div style={{
        backgroundColor: 'var(--bg-page)',
        border: '1px solid var(--border-color)',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Preset Meteorological Scenarios:
        </span>
        <button onClick={() => applyPreset('november-smog')} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }}>
          🔥 Severe November Night Inversion
        </button>
        <button onClick={() => applyPreset('diwali-fog')} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }}>
          🌫️ Cold Winter Fog Smog Trapping
        </button>
        <button onClick={() => applyPreset('western-disturbance')} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }}>
          💨 Breezy Western Disturbance
        </button>
        <button onClick={() => applyPreset('summer-mixing')} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '4px 8px' }}>
          ☀️ Summer High Solar Convection
        </button>
      </div>

      {/* 2D Animated Atmospheric Physics Cross-Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Interactive 2D Atmospheric Boundary Layer Cross-Section (Delhi Urban Canopy):
        </div>
        <InversionCanvasGraphic
          pblHeight={pblInput}
          stubbleFlux={stubbleFluxInput}
          activeMitigation={activeMitigation}
        />
      </div>

      {/* Interactive Controls & Feedback Matrix */}
      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Controls */}
        <div style={{ backgroundColor: 'var(--bg-page)', padding: '18px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Adjust Physical Boundary Parameters:
          </div>

          {/* Slider 1: PBL Height */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Planetary Boundary Layer (PBL) Height:</span>
              <strong>{pblInput} meters</strong>
            </div>
            <input
              type="range"
              min="180"
              max="900"
              step="10"
              value={pblInput}
              onChange={(e) => setPblInput(parseFloat(e.target.value))}
              className="range-slider"
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span>180m (Extreme Ground Lid)</span>
              <span>900m (Free Convective Mixing)</span>
            </div>
          </div>

          {/* Slider 2: Stubble Biomass Flux */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Regional Stubble Burning Smoke Flux:</span>
              <strong>{stubbleFluxInput}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={stubbleFluxInput}
              onChange={(e) => setStubbleFluxInput(parseFloat(e.target.value))}
              className="range-slider"
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span>0% (No Farm Fires)</span>
              <span>100% (Peak Fire Episodes)</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Surface Wind Speed (NW Corridor):</span>
              <strong>{windSpeedInput} km/h</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="15.0"
              step="0.5"
              value={windSpeedInput}
              onChange={(e) => setWindSpeedInput(parseFloat(e.target.value))}
              className="range-slider"
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span>1.0 km/h (Calm/Stagnant)</span>
              <span>15.0 km/h (High Dispersion)</span>
            </div>
          </div>

          {/* Active Mitigation Testing Buttons */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Test Engineering Mitigation Interventions:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'none', label: 'None (Natural Physics)' },
                { id: 'smog-gun', label: '💧 Anti-Smog Mist Guns' },
                { id: 'thermal-cannon', label: '🔥 Thermal Updraft Cannon' }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setActiveMitigation(btn.id)}
                  className="btn btn-outline btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '5px 10px',
                    backgroundColor: activeMitigation === btn.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeMitigation === btn.id ? '#ffffff' : 'var(--text-main)',
                    borderColor: activeMitigation === btn.id ? 'var(--accent-primary)' : 'var(--border-color)'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Physics Feedback Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="metric-box" style={{ backgroundColor: 'var(--bg-panel-subtle)', padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Coupled Simulation Output
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <div className="metric-label">Simulated AQI</div>
                <div className="metric-value">{simulatedAQI}</div>
              </div>
              <div>
                <div className="metric-label">Trapped PM2.5</div>
                <div className="metric-value">{simulatedPM25} <span className="metric-unit">µg/m³</span></div>
              </div>
            </div>
          </div>

          {/* Thermodynamic Stability Metrics */}
          <div className="grid-3" style={{ gap: '10px' }}>
            <div className="metric-box">
              <div className="metric-label">Richardson No (Ri)</div>
              <div className="metric-value">{richardsonNumber}</div>
              <div className="metric-sub" style={{ color: isAtmosphereStable ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-good-text)' }}>
                {isAtmosphereStable ? 'Stable Inversion (Trapped)' : 'Turbulent (Mixing)'}
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Sunlight Blocked</div>
              <div className="metric-value">{solarBlockedPercent}%</div>
              <div className="metric-sub">Surface dimming</div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Surface Cooling</div>
              <div className="metric-value">-{localTempCooling}°C</div>
              <div className="metric-sub">Weakens convection</div>
            </div>
          </div>

          {/* Explanations of Feedback Loops */}
          <div className="grid-2" style={{ gap: '12px' }}>
            <div className="panel-subtle" style={{ backgroundColor: 'var(--bg-page)', padding: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Feedback 1: Weather ➔ Chemistry
              </div>
              <p style={{ fontSize: '12px', marginBottom: 0, color: 'var(--text-main)', lineHeight: 1.5 }}>
                Low boundary layer ceiling ({pblInput}m) compresses pollutants into a shallow ground volume, multiplying aerosol density by <strong>{(1 + inversionFactor * 0.8).toFixed(2)}x</strong>.
              </p>
            </div>

            <div className="panel-subtle" style={{ backgroundColor: 'var(--bg-page)', padding: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Feedback 2: Chemistry ➔ Weather
              </div>
              <p style={{ fontSize: '12px', marginBottom: 0, color: 'var(--text-main)', lineHeight: 1.5 }}>
                Dense PM2.5 ({simulatedPM25}µg/m³) scatters <strong>{solarBlockedPercent}%</strong> of incoming sunlight back into space, lowering surface warmth by <strong>-{localTempCooling}°C</strong> and worsening the inversion trap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
