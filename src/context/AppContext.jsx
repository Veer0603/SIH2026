import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { soundFX } from '../utils/audioFeedback';
import { AppContext } from './context';
import { getTranslation } from '../utils/translations';
import { calculateCompleteCPCB_AQI, fetchLiveStationTelemetry } from '../utils/cpcbAqiEngine';

export function AppProvider({ children }) {
  // 0. Language state ('en' | 'hi')
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_language');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  // 1. Stations state (persisting custom added stations)
  // Helper to ensure any station object has authenticated CPCB NAQI fields
  const normalizeStationCPCB = (s) => {
    const cpcb = calculateCompleteCPCB_AQI(s);
    return {
      ...s,
      aqi: cpcb.aqi,
      category: cpcb.category,
      categoryHi: cpcb.categoryHi,
      categoryColor: cpcb.categoryColor,
      dominantPollutant: cpcb.dominantPollutant,
      subIndices: cpcb.subIndices
    };
  };

  // 1. Stations state (persisting custom added stations)
  const [stations, setStations] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_custom_stations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const officialIds = new Set(DELHI_STATIONS.map(s => s.id));
          const uniqueCustom = parsed.filter(s => !officialIds.has(s.id));
          return [...uniqueCustom, ...DELHI_STATIONS].map(normalizeStationCPCB);
        }
      }
    } catch {
      // Fallback
    }
    return DELHI_STATIONS.map(normalizeStationCPCB);
  });

  // 2. Selected Station
  const [selectedStation, setSelectedStationState] = useState(() => {
    try {
      const savedId = localStorage.getItem('aeris_selected_station_id');
      if (savedId) {
        const found = DELHI_STATIONS.find(s => s.id === savedId);
        if (found) return normalizeStationCPCB(found);
      }
    } catch {
      // Fallback
    }
    return normalizeStationCPCB(DELHI_STATIONS[0]);
  });

  const [customLocality, setCustomLocality] = useState(null);

  // 3. Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_favorites');
      return saved ? JSON.parse(saved) : ['anand-vihar', 'connaught-place', 'rohini'];
    } catch {
      return ['anand-vihar', 'connaught-place'];
    }
  });

  // 4. Theme ('light' | 'dark') — Dark mode is the primary AERIS experience
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_theme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // 5. Live Simulation Engine
  const [liveSimulation, setLiveSimulation] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  // 6. Sound Effects
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // 7. Toast Notifications
  const [toasts, setToasts] = useState([]);

  // 8. Station Comparison List
  const [comparisonList, setComparisonList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // 9. User Profile
  const [userProfile, setUserProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('aeris_user_profile');
      return saved || 'general';
    } catch {
      return 'general';
    }
  });

  // Add toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);

    if (type === 'alert') soundFX.playAlert();
    else if (type === 'success') soundFX.playSuccess();
    else soundFX.playClick();

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync theme with body data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('aeris_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // Sync sound setting
  useEffect(() => {
    soundFX.enabled = soundEnabled;
    try {
      localStorage.setItem('aeris_sound', JSON.stringify(soundEnabled));
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Select station with persistence & instant live API telemetry fetch
  const setSelectedStation = useCallback((station) => {
    // 1. Authentically normalize CPCB AQI immediately so it never mismatches
    const cpcb = calculateCompleteCPCB_AQI(station);
    const normalized = {
      ...station,
      aqi: cpcb.aqi,
      category: cpcb.category,
      categoryHi: cpcb.categoryHi,
      categoryColor: cpcb.categoryColor,
      dominantPollutant: cpcb.dominantPollutant,
      subIndices: cpcb.subIndices
    };

    setSelectedStationState(normalized);
    setStations(prev => prev.map(s => s.id === normalized.id ? normalized : s));
    setCustomLocality(null);
    soundFX.playClick();
    try {
      localStorage.setItem('aeris_selected_station_id', station.id);
    } catch {
      // Ignore
    }

    // 2. Fetch 100% authentic live telemetry from Open-Meteo & CPCB for this specific station's coordinates
    fetchLiveStationTelemetry(station).then(live => {
      if (live) {
        setSelectedStationState(live);
        setStations(prev => prev.map(s => s.id === live.id ? live : s));
      }
    }).catch(() => {});

    if (normalized.aqi >= 350) {
      addToast(`Switched to ${normalized.shortName} — CRITICAL AQI ${normalized.aqi}`, 'alert');
    } else {
      addToast(`Selected ${normalized.shortName} (AQI ${normalized.aqi})`, 'info');
    }
  }, [addToast]);

  // Toggle favorite
  const toggleFavorite = useCallback((stationId) => {
    setFavorites(prev => {
      const isFav = prev.includes(stationId);
      const next = isFav ? prev.filter(id => id !== stationId) : [...prev, stationId];
      try {
        localStorage.setItem('aeris_favorites', JSON.stringify(next));
      } catch {
        // Ignore
      }
      soundFX.playSuccess();
      addToast(isFav ? 'Removed from pinned favorites' : 'Pinned to favorites ⭐', 'success');
      return next;
    });
  }, [addToast]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      soundFX.playClick();
      return next;
    });
  }, []);

  // Set user profile
  const setUserProfile = useCallback((prof) => {
    setUserProfileState(prof);
    try {
      localStorage.setItem('aeris_user_profile', prof);
    } catch {
      // Ignore
    }
    soundFX.playClick();
    addToast(`Health profile updated: ${prof.toUpperCase()}`, 'info');
  }, [addToast]);

  // Add custom station
  const addStation = useCallback((newStation) => {
    setStations(prev => {
      const next = [newStation, ...prev];
      try {
        const customStations = next.filter(s => s.id.startsWith('custom-'));
        localStorage.setItem('aeris_custom_stations', JSON.stringify(customStations));
      } catch {
        // Ignore
      }
      return next;
    });
    setSelectedStation(newStation);
    soundFX.playSuccess();
    addToast(`Station '${newStation.shortName}' added to network!`, 'success');
  }, [setSelectedStation, addToast]);

  // Comparison list helpers
  const toggleComparison = useCallback((station) => {
    setComparisonList(prev => {
      const exists = prev.some(s => s.id === station.id);
      if (exists) {
        soundFX.playClick();
        addToast(`Removed ${station.shortName} from comparison`, 'info');
        return prev.filter(s => s.id !== station.id);
      }
      if (prev.length >= 4) {
        addToast('Maximum 4 stations can be compared at once', 'alert');
        return prev;
      }
      soundFX.playSuccess();
      addToast(`Added ${station.shortName} to comparison (${prev.length + 1}/4)`, 'success');
      return [...prev, station];
    });
  }, [addToast]);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
    soundFX.playClick();
    addToast('Cleared station comparison', 'info');
  }, [addToast]);

  const setComparisonStations = useCallback((stationsList) => {
    const clamped = (stationsList || []).slice(0, 4);
    setComparisonList(clamped);
    soundFX.playSuccess();
    addToast(`Loaded ${clamped.length} stations into comparison`, 'success');
  }, [addToast]);

  // Synchronize station with authentic CPCB NAQI calculation & Live API telemetry
  const refreshTelemetry = useCallback(async () => {
    // 1. Try to fetch 100% authentic live telemetry from Open-Meteo & CPCB
    let liveData = null;
    try {
      liveData = await fetchLiveStationTelemetry(selectedStation);
    } catch {
      // Offline fallback
    }

    if (liveData) {
      setSelectedStationState(liveData);
      setStations(prev => prev.map(s => s.id === liveData.id ? liveData : s));
      setLastUpdated(new Date());
      return;
    }

    // 2. If API is offline, execute physically coupled CPCB NAQI dynamic calculation across all pollutants
    setStations(prev => prev.map(st => {
      const deltaFactor = 1 + (Math.random() - 0.48) * 0.035;
      const newPM25 = Math.max(15, Math.round(st.pm25 * deltaFactor * 10) / 10);
      const newPM10 = Math.max(25, Math.round(st.pm10 * deltaFactor * 10) / 10);
      const newNOx = Math.max(5, Math.round(st.nox * deltaFactor * 10) / 10);
      const newSO2 = Math.max(2, Math.round(st.so2 * deltaFactor * 10) / 10);
      const newCO = Math.max(0.2, Math.round(st.co * deltaFactor * 10) / 10);
      const newO3 = Math.max(5, Math.round(st.o3 * (2 - deltaFactor) * 10) / 10);

      const cpcbResult = calculateCompleteCPCB_AQI({
        pm25: newPM25,
        pm10: newPM10,
        nox: newNOx,
        so2: newSO2,
        co: newCO,
        o3: newO3
      });

      return {
        ...st,
        aqi: cpcbResult.aqi,
        category: cpcbResult.category,
        categoryHi: cpcbResult.categoryHi,
        dominantPollutant: cpcbResult.dominantPollutant,
        pm25: newPM25,
        pm10: newPM10,
        nox: newNOx,
        so2: newSO2,
        co: newCO,
        o3: newO3,
        subIndices: cpcbResult.subIndices,
        cigarettes: cpcbResult.cigarettes,
        whoMultiplier: cpcbResult.whoMultiplier,
        temp: Math.round((st.temp + (Math.random() - 0.5) * 0.2) * 10) / 10
      };
    }));

    setSelectedStationState(curr => {
      const deltaFactor = 1 + (Math.random() - 0.48) * 0.035;
      const newPM25 = Math.max(15, Math.round(curr.pm25 * deltaFactor * 10) / 10);
      const newPM10 = Math.max(25, Math.round(curr.pm10 * deltaFactor * 10) / 10);
      const newNOx = Math.max(5, Math.round(curr.nox * deltaFactor * 10) / 10);
      const newSO2 = Math.max(2, Math.round(curr.so2 * deltaFactor * 10) / 10);
      const newCO = Math.max(0.2, Math.round(curr.co * deltaFactor * 10) / 10);
      const newO3 = Math.max(5, Math.round(curr.o3 * (2 - deltaFactor) * 10) / 10);

      const cpcbResult = calculateCompleteCPCB_AQI({
        pm25: newPM25,
        pm10: newPM10,
        nox: newNOx,
        so2: newSO2,
        co: newCO,
        o3: newO3
      });

      return {
        ...curr,
        aqi: cpcbResult.aqi,
        category: cpcbResult.category,
        categoryHi: cpcbResult.categoryHi,
        dominantPollutant: cpcbResult.dominantPollutant,
        pm25: newPM25,
        pm10: newPM10,
        nox: newNOx,
        so2: newSO2,
        co: newCO,
        o3: newO3,
        subIndices: cpcbResult.subIndices,
        cigarettes: cpcbResult.cigarettes,
        whoMultiplier: cpcbResult.whoMultiplier
      };
    });

    setLastUpdated(new Date());
  }, [selectedStation]);

  // Initial live telemetry sync on mount
  useEffect(() => {
    fetchLiveStationTelemetry(selectedStation).then(live => {
      if (live) {
        setSelectedStationState(live);
        setStations(prev => prev.map(s => s.id === live.id ? live : s));
        setLastUpdated(new Date());
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatic periodic live simulation interval
  useEffect(() => {
    if (!liveSimulation) return;
    const interval = setInterval(() => {
      refreshTelemetry();
    }, 12000); // refresh every 12 seconds
    return () => clearInterval(interval);
  }, [liveSimulation, refreshTelemetry]);

  // 10. Language Switcher Helpers
  const setLanguage = useCallback((lang) => {
    const valid = lang === 'hi' ? 'hi' : 'en';
    setLanguageState(valid);
    try {
      localStorage.setItem('aeris_language', valid);
    } catch {
      // Ignore
    }
    soundFX.playClick();
    addToast(valid === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है 🇮🇳' : 'Language switched to English 🌐', 'info');
  }, [addToast]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  const t = useCallback((path, fallback = '') => {
    return getTranslation(language, path, fallback);
  }, [language]);

  // Context value
  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
    stations,
    selectedStation,
    setSelectedStation,
    customLocality,
    setCustomLocality,
    favorites,
    toggleFavorite,
    theme,
    toggleTheme,
    liveSimulation,
    setLiveSimulation,
    lastUpdated,
    refreshTelemetry,
    soundEnabled,
    setSoundEnabled,
    toasts,
    addToast,
    removeToast,
    comparisonList,
    toggleComparison,
    clearComparison,
    setComparisonStations,
    isCompareModalOpen,
    setIsCompareModalOpen,
    userProfile,
    setUserProfile,
    addStation
  }), [
    language,
    setLanguage,
    toggleLanguage,
    t,
    stations,
    selectedStation,
    setSelectedStation,
    customLocality,
    favorites,
    toggleFavorite,
    theme,
    toggleTheme,
    liveSimulation,
    lastUpdated,
    refreshTelemetry,
    soundEnabled,
    toasts,
    addToast,
    removeToast,
    comparisonList,
    toggleComparison,
    clearComparison,
    setComparisonStations,
    isCompareModalOpen,
    userProfile,
    setUserProfile,
    addStation
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
