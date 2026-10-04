import React, { useState, useEffect } from 'react';
import { searchDelhiLocality } from '../utils/geocoding';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { useApp } from '../context/useApp';

export default function SearchGeocoding({ onSelectStation, onCustomLocationSelect }) {
  const { selectedStation, favorites, toggleFavorite, language, stations } = useApp();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeZoneFilter, setActiveZoneFilter] = useState('ALL');

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_recent_searches');
      return saved ? JSON.parse(saved) : ['Anand Vihar', 'Connaught Place', 'Saket'];
    } catch {
      return ['Anand Vihar', 'Connaught Place'];
    }
  });

  const saveRecentSearch = (name) => {
    setRecentSearches(prev => {
      const updated = [name, ...prev.filter(item => item !== name)].slice(0, 5);
      try {
        localStorage.setItem('aeris_recent_searches', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchDelhiLocality(query);
      setSuggestions(res);
      setLoading(false);
      setShowDropdown(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val || val.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.displayName);
    setShowDropdown(false);
    saveRecentSearch(item.displayName.split(',')[0]);
    const matchedStation = (stations && stations.find(s => s.id === item.nearestStation.id)) || item.nearestStation;
    onSelectStation(matchedStation);
    if (onCustomLocationSelect) {
      onCustomLocationSelect(item);
    }
  };

  const zones = ['ALL', 'South Delhi', 'East Delhi', 'Central Delhi', 'West Delhi', 'North-West Delhi', 'Satellite NCR'];

  const stationList = (stations && stations.length > 0) ? stations : DELHI_STATIONS;
  const filteredPresetStations = stationList.filter(s => {
    if (activeZoneFilter === 'ALL') return true;
    return s.zone.toLowerCase().includes(activeZoneFilter.toLowerCase());
  });

  const isCurrentFavorite = favorites.includes(selectedStation.id);

  return (
    <div className="panel" style={{ marginBottom: '20px' }}>
      <div className="panel-header" style={{ marginBottom: '12px', paddingBottom: '8px' }}>
        <div>
          <div className="panel-title">
            <span>{language === 'hi' ? 'दिल्ली एनसीआर इलाका खोज व जियोकोडिंग इंजन' : 'DELHI NCR LOCALITY SEARCH & GEOCODING ENGINE'}</span>
          </div>
          <span className="subtitle">
            {language === 'hi' ? 'निकटतम सेंसर मिलान के साथ वास्तविक समय पता खोज' : 'Real-time address lookup with instant nearest sensor matching'}
          </span>
        </div>
        <button
          onClick={() => toggleFavorite(selectedStation.id)}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>{isCurrentFavorite ? (language === 'hi' ? '⭐ पसंदीदा में शामिल' : '⭐ Pinned to Favs') : (language === 'hi' ? '☆ इलाका पिन करें' : '☆ Pin Locality')}</span>
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="input-text"
            placeholder={language === 'hi' ? 'कोई भी पता, मेट्रो स्टेशन, कॉलोनी या लैंडमार्क खोजें (उदा. रोहिणी, साकेत, द्वारका)...' : 'Type any address, metro station, colony, or landmark (e.g. Saket, Hauz Khas, Noida Sec 62)...'}
            value={query}
            onChange={handleInputChange}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            style={{ fontSize: '14px', padding: '12px 16px' }}
          />
          {query && (
            <button
              className="btn btn-outline"
              onClick={() => { setQuery(''); setSuggestions([]); setShowDropdown(false); }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {language === 'hi' ? 'हटाएं' : 'Clear'}
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-card, 12px)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 999,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-input)',
                  transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-panel-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                  {item.displayName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                  <span>{language === 'hi' ? 'निकटतम सेंसर:' : 'Nearest Sensor:'} <strong>{item.nearestStation.shortName}</strong></span>
                  <span>{language === 'hi' ? 'दूरी:' : 'Distance:'} {item.distanceKm} km</span>
                  <span style={{ fontStyle: 'italic' }}>({item.source})</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ position: 'absolute', right: '16px', top: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {language === 'hi' ? 'दिल्ली जियोस्पेशियल नेटवर्क खोजा जा रहा है...' : 'Searching Delhi geospatial network...'}
          </div>
        )}
      </div>

      {/* Zone Filter Tabs */}
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {language === 'hi' ? 'जोन त्वरित फ़िल्टर:' : 'Zone Quick Filter:'}
        </span>
        {zones.map(z => (
          <button
            key={z}
            onClick={() => setActiveZoneFilter(z)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: activeZoneFilter === z ? 'var(--accent-primary)' : 'transparent',
              color: activeZoneFilter === z ? '#ffffff' : 'var(--text-main)',
              borderColor: activeZoneFilter === z ? 'var(--accent-primary)' : 'var(--border-color)'
            }}
          >
            {z === 'ALL' && language === 'hi' ? 'सभी' : z}
          </button>
        ))}
      </div>

      {/* Quick Locality Presets */}
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {language === 'hi' ? `जोन में स्टेशन (${filteredPresetStations.length}):` : `Stations in Zone (${filteredPresetStations.length}):`}
        </span>
        {filteredPresetStations.slice(0, 8).map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setQuery(st.shortName);
              setShowDropdown(false);
              saveRecentSearch(st.shortName);
              const latest = (stations && stations.find(s => s.id === st.id)) || st;
              onSelectStation(latest);
            }}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: selectedStation.id === st.id ? 'var(--bg-panel-subtle)' : 'var(--bg-page)',
              borderColor: selectedStation.id === st.id ? 'var(--accent-primary)' : 'var(--border-color)',
              fontWeight: selectedStation.id === st.id ? 700 : 500
            }}
          >
            {st.shortName} (AQI {st.aqi})
          </button>
        ))}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>{language === 'hi' ? 'हालिया:' : 'Recent:'}</span>
          {recentSearches.map((term, i) => (
            <span
              key={i}
              onClick={() => { setQuery(term); }}
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              {term}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
