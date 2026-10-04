import React, { useState } from 'react';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';
import { exportToCSV } from '../utils/exportUtils';

export default function StationTable({ onOpenAddModal }) {
  const {
    stations,
    selectedStation,
    setSelectedStation,
    comparisonList,
    toggleComparison,
    favorites,
    toggleFavorite,
    addToast
  } = useApp();

  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('aqi');

  const filtered = stations.filter((s) =>
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    s.zone.toLowerCase().includes(filterText.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'aqi') return b.aqi - a.aqi;
    if (sortBy === 'pm25') return b.pm25 - a.pm25;
    if (sortBy === 'inversion') return b.inversionStrength - a.inversionStrength;
    if (sortBy === 'pbl') return a.pblHeight - b.pblHeight; // lowest PBL is worst
    return 0;
  });

  const handleExportCSV = () => {
    const rows = sorted.map(st => ({
      Station_Name: st.name,
      Zone: st.zone,
      AQI: st.aqi,
      Category: st.category,
      Dominant_Pollutant: st.dominantPollutant,
      PM25_ugm3: st.pm25,
      PM10_ugm3: st.pm10,
      Ozone_ugm3: st.o3,
      NOx_ppb: st.nox,
      PBL_Height_m: st.pblHeight,
      Inversion_Pct: st.inversionStrength,
      Stubble_Flux_Pct: st.stubbleFlux,
      Wind_kmh: st.windSpeed,
      Wind_Direction: st.windDirectionText
    }));
    exportToCSV(`delhi_cpcb_stations_${Date.now()}`, rows);
    addToast('Station matrix data exported to CSV', 'success');
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>DELHI NCR SENSOR DATA MATRIX ({stations.length} ACTIVE STATIONS)</span>
          </div>
          <span className="subtitle">
            Comprehensive tabular registry of real-time CPCB telemetry, inversion lids, and chemical gas concentrations.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm" style={{ fontSize: '11px', padding: '5px 10px' }}>
            📥 Export CSV
          </button>
          <button
            onClick={onOpenAddModal}
            className="btn btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            + Add Station
          </button>
          <input
            type="text"
            className="input-text"
            placeholder="Filter stations..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: '150px', padding: '5px 10px', fontSize: '12px' }}
          />
          <select
            className="input-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '5px 8px', fontSize: '12px' }}
          >
            <option value="aqi">Sort: Highest AQI</option>
            <option value="pm25">Sort: Highest PM2.5</option>
            <option value="inversion">Sort: Highest Inversion</option>
            <option value="pbl">Sort: Lowest PBL Lid</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
        <table className="data-table">
          <thead>
            <tr style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <th style={{ width: '40px' }}>Fav</th>
              <th>Station / Locality</th>
              <th>Zone</th>
              <th>AQI</th>
              <th>PM2.5 (µg/m³)</th>
              <th>PM10 (µg/m³)</th>
              <th>PBL Lid (m)</th>
              <th>Inversion %</th>
              <th>Wind Vector</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((st) => {
              const isSelected = st.id === selectedStation.id;
              const isCompared = comparisonList.some(s => s.id === st.id);
              const isFav = favorites.includes(st.id);
              const catMeta = AQI_CATEGORIES[st.category] || AQI_CATEGORIES["Moderate"];

              return (
                <tr
                  key={st.id}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-panel-subtle)' : 'transparent',
                    fontWeight: isSelected ? 700 : 400
                  }}
                >
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleFavorite(st.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{st.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {st.lat.toFixed(3)}°N, {st.lng.toFixed(3)}°E
                    </div>
                  </td>
                  <td>{st.zone}</td>
                  <td>
                    <span className={`tag ${catMeta.bgClass}`} style={{ fontSize: '11px' }}>
                      {st.aqi} — {st.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.pm25}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.pm10}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.pblHeight}m</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{st.inversionStrength}%</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {st.windSpeed} km/h {st.windDirectionText}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setSelectedStation(st)}
                        className="btn btn-outline btn-sm"
                        style={{
                          padding: '3px 8px',
                          fontSize: '11px',
                          backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)'
                        }}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                      <button
                        onClick={() => toggleComparison(st)}
                        className="btn btn-outline btn-sm"
                        style={{
                          padding: '3px 8px',
                          fontSize: '11px',
                          borderColor: isCompared ? 'var(--accent-primary)' : 'var(--border-color)',
                          backgroundColor: isCompared ? 'var(--bg-panel-subtle)' : 'transparent'
                        }}
                      >
                        {isCompared ? '✓ Compare' : '+ Compare'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
