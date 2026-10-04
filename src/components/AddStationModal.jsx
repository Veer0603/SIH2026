import React, { useState, useEffect } from 'react';
import { generateBlockHeader } from '../utils/blockchainLedger';

export default function AddStationModal({ isOpen, onClose, onAddStation }) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('South Delhi');
  const [lat, setLat] = useState('28.5300');
  const [lng, setLng] = useState('77.1500');
  const [pm25, setPm25] = useState('180');
  const [pm10, setPm10] = useState('290');
  const [temp, setTemp] = useState('22.0');
  const [windSpeed, setWindSpeed] = useState('5.5');
  const [sourceType, setSourceType] = useState('Community IoT Sensor');
  const [error, setError] = useState('');

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a station or locality name.');
      return;
    }

    const numPm25 = parseFloat(pm25) || 100;
    const numPm10 = parseFloat(pm10) || 180;
    const numLat = parseFloat(lat) || 28.6139;
    const numLng = parseFloat(lng) || 77.2090;

    // Calculate Indian CPCB AQI approximation
    let aqi = Math.round(numPm25 * 1.25);
    if (numPm25 > 250) aqi = Math.round(300 + (numPm25 - 250) * 0.8);

    let category = "Moderate";
    if (aqi > 400) category = "Hazardous";
    else if (aqi > 300) category = "Severe";
    else if (aqi > 200) category = "Very Unhealthy";
    else if (aqi > 100) category = "Poor";
    else if (aqi > 50) category = "Moderate";
    else category = "Good";

    const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const newStation = {
      id,
      name: `${name.trim()} (${sourceType})`,
      shortName: name.trim().slice(0, 18),
      zone,
      lat: numLat,
      lng: numLng,
      aqi,
      category,
      dominantPollutant: numPm25 > numPm10 ? 'PM2.5' : 'PM10',
      pm25: numPm25,
      pm10: numPm10,
      o3: Math.round((35 + Math.random() * 25) * 10) / 10,
      nox: Math.round(75 + Math.random() * 40),
      so2: 12.5,
      co: 1.8,
      temp: parseFloat(temp) || 22.0,
      humidity: 75,
      windSpeed: parseFloat(windSpeed) || 5.0,
      windDirectionDeg: 310,
      windDirectionText: 'NW',
      pblHeight: Math.max(220, Math.round(550 - (numPm25 * 0.8))),
      inversionStrength: Math.min(95, Math.round(50 + (numPm25 * 0.12))),
      stubbleFlux: Math.min(95, Math.round(40 + (numPm25 * 0.15))),
      solarSuppression: Math.round((numPm25 / 350) * 25 * 10) / 10,
      blockchainHash: generateBlockHeader({ id, aqi, pm25: numPm25, pblHeight: 400 })
    };

    onAddStation(newStation);
    onClose();

    // Reset form
    setName('');
    setError('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(24, 27, 29, 0.65)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-page)',
        border: '2px solid var(--accent-primary)',
        borderRadius: 'var(--radius-sharp)',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '18px', textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '-0.02em' }}>
            + Add New Station / Report Air Reading
          </h2>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Close ✕
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Add a new air quality monitoring point or report a community IoT sensor reading in Delhi NCR. Telemetry will be timestamped and committed to the AeroLedger blockchain.
        </p>

        {error && (
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--aqi-unhealthy-bg)', border: '1px solid var(--aqi-unhealthy-border)', color: 'var(--aqi-unhealthy-text)', fontSize: '13px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2" style={{ gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Station / Locality Name *
              </label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Vasant Kunj Sector C"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Delhi NCR Zone
              </label>
              <select
                className="input-select"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px' }}
              >
                <option value="South Delhi">South Delhi</option>
                <option value="North Delhi">North Delhi</option>
                <option value="East Delhi">East Delhi</option>
                <option value="West Delhi">West Delhi</option>
                <option value="Central Delhi">Central Delhi</option>
                <option value="North-West Delhi">North-West Delhi</option>
                <option value="South-West Delhi">South-West Delhi</option>
                <option value="NCR East">NCR East (Noida/Greater Noida)</option>
                <option value="NCR West">NCR West (Gurugram)</option>
                <option value="NCR North-East">NCR North-East (Ghaziabad)</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                className="input-text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                className="input-text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                PM2.5 Concentration (µg/m³)
              </label>
              <input
                type="number"
                className="input-text"
                value={pm25}
                onChange={(e) => setPm25(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                PM10 Concentration (µg/m³)
              </label>
              <input
                type="number"
                className="input-text"
                value={pm10}
                onChange={(e) => setPm10(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                className="input-text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Wind Speed (km/h)
              </label>
              <input
                type="number"
                step="0.1"
                className="input-text"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Data Source Type
            </label>
            <select
              className="input-select"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              style={{ width: '100%', padding: '10px 12px' }}
            >
              <option value="Community IoT Sensor">Community IoT Air Monitor</option>
              <option value="Stubble Smoke Observation">Field Biomass Fire Spotter Report</option>
              <option value="Vehicular Hotspot Audit">Traffic Hotspot Telemetry</option>
              <option value="Industrial Sensor">Industrial Emissions Node</option>
            </select>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn">
              Commit & Submit Station Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
