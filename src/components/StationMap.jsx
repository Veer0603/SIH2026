import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/useApp';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import SpringCheck from './SpringCheck';

// Default Mapbox public token from environment or user-configured token
const DEFAULT_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// NASA FIRMS Stubble Fire Hotspots in Punjab / Haryana agricultural fire belt
const NASA_FIRMS_HOTSPOTS = [
  { id: 'sangrur-fire-1', name: 'Sangrur Agricultural Belt (Punjab)', lat: 30.2458, lng: 75.8421, frp: 512, fires: 38, plumeDirection: 'SE -> Delhi Corridor' },
  { id: 'patiala-fire-1', name: 'Patiala Paddy Field Clusters (Punjab)', lat: 30.3398, lng: 76.3869, frp: 468, fires: 29, plumeDirection: 'SE -> Delhi Corridor' },
  { id: 'kaithal-fire-1', name: 'Kaithal Stubble Hotspot (Haryana)', lat: 29.8015, lng: 76.3996, frp: 385, fires: 22, plumeDirection: 'SE -> North Delhi' },
  { id: 'karnal-fire-1', name: 'Karnal Stubble Burning Zone (Haryana)', lat: 29.6857, lng: 76.9905, frp: 310, fires: 17, plumeDirection: 'S -> Delhi GT Road' },
  { id: 'jind-fire-1', name: 'Jind Harvest Residue Cluster (Haryana)', lat: 29.3160, lng: 76.3140, frp: 275, fires: 14, plumeDirection: 'SE -> West Delhi' },
  { id: 'fatehabad-fire-1', name: 'Fatehabad Fire Line (Haryana)', lat: 29.5160, lng: 75.4540, frp: 340, fires: 19, plumeDirection: 'E-SE -> Delhi Corridor' }
];

export default function StationMap({ onOpenAddModal }) {
  const {
    stations,
    selectedStation,
    setSelectedStation,
    toggleComparison,
    comparisonList,
    favorites,
    toggleFavorite,
    addToast,
    theme,
    language,
    t
  } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const plumeLayerRef = useRef(null);
  const heatLayerRef = useRef(null);
  const firmsLayerRef = useRef(null);
  const userLocationLayerRef = useRef(null);

  // Mapbox Token (configured securely via environment)
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || DEFAULT_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState('auto'); // 'auto' | 'dark-v11' | 'light-v11' | 'satellite-streets-v12' | 'outdoors-v12' | 'streets-v12' | 'navigation-night-v1'
  const [tileProvider, setTileProvider] = useState('mapbox'); // 'mapbox' | 'cartodb' | 'osm'
  const [retinaResolution, setRetinaResolution] = useState(true);

  // Atmospheric Layers
  const [showPlumeOverlay, setShowPlumeOverlay] = useState(true);
  const [plumeOpacity, setPlumeOpacity] = useState(0.65);
  const [showHeatCircles, setShowHeatCircles] = useState(true);
  const [heatRadius, setHeatRadius] = useState(3800); // meters
  const [heatOpacity, setHeatOpacity] = useState(0.18);
  const [showFirmsHotspots, setShowFirmsHotspots] = useState(true);
  const [markerPinStyle, setMarkerPinStyle] = useState('detailed'); // 'detailed' | 'compact'
  const [enableBeaconPulse, setEnableBeaconPulse] = useState(true);

  // Filter & UI States
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'severe' | 'unhealthy' | 'moderate'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('style'); // 'style' | 'layers'

  // Resolve actual mapbox style string
  const activeStyleId = useMemo(() => {
    if (mapStyle === 'auto') {
      return theme === 'dark' ? 'dark-v11' : 'light-v11';
    }
    return mapStyle;
  }, [mapStyle, theme]);

  // Construct Tile Layer URL
  const getTileUrl = useCallback((provider, style, token, retina) => {
    if (provider === 'cartodb' || (provider === 'mapbox' && !token)) {
      return theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
    if (provider === 'osm') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    // Default Mapbox HD Tiles
    const retinaFlag = retina ? '@2x' : '';
    return `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/512/{z}/{x}/{y}${retinaFlag}?access_token=${token}`;
  }, [theme]);

  // Filter stations based on on-map category filter
  const visibleStations = useMemo(() => {
    if (categoryFilter === 'severe') return stations.filter(s => s.aqi >= 301);
    if (categoryFilter === 'unhealthy') return stations.filter(s => s.aqi >= 201 && s.aqi <= 300);
    if (categoryFilter === 'moderate') return stations.filter(s => s.aqi <= 200);
    return stations;
  }, [stations, categoryFilter]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090], // Delhi Center
        zoom: 11,
        zoomControl: false, // Custom position
        attributionControl: false
      });

      // Add custom attribution bottom right
      L.control.attribution({ position: 'bottomright' })
        .addAttribution('&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a> &copy; OpenStreetMap &copy; CPCB')
        .addTo(map);

      // Add top-right zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      const tileLayer = L.tileLayer(getTileUrl(tileProvider, activeStyleId, mapboxToken, retinaResolution), {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19
      });

      tileLayer.on('tileerror', () => {
        if (tileProvider === 'mapbox') {
          const fallbackUrl = theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
          tileLayer.setUrl(fallbackUrl);
        }
      });

      tileLayer.addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(getTileUrl(tileProvider, activeStyleId, mapboxToken, retinaResolution));
    }

    const map = mapInstanceRef.current;

    // Clear previous layers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    if (plumeLayerRef.current) {
      map.removeLayer(plumeLayerRef.current);
      plumeLayerRef.current = null;
    }

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (firmsLayerRef.current) {
      map.removeLayer(firmsLayerRef.current);
      firmsLayerRef.current = null;
    }

    // 1. ANIMATED STUBBLE SMOKE PLUME CORRIDOR
    if (showPlumeOverlay) {
      const plumeGroup = L.layerGroup();
      const corridors = [
        [[30.24, 75.84], [28.64, 77.21]],
        [[30.33, 76.38], [28.66, 77.35]],
        [[29.80, 76.39], [28.72, 77.12]],
        [[29.68, 76.99], [28.56, 77.15]],
        [[29.31, 76.31], [28.62, 77.30]],
        [[29.51, 75.45], [28.58, 77.05]]
      ];

      corridors.forEach(([start, end], idx) => {
        const polyline = L.polyline([start, end], {
          color: idx % 2 === 0 ? '#ea580c' : '#dc2626',
          weight: 3.5,
          opacity: plumeOpacity,
          dashArray: '12, 10',
          className: 'animated-wind-plume'
        });
        polyline.bindTooltip(
          language === 'hi' 
            ? '🔥 उत्तर-पश्चिम पराली धुआं प्रवाह गलियारा (पंजाब/हरियाणा ➔ दिल्ली)' 
            : '🔥 NW Stubble Agricultural Smoke Advection Corridor (Punjab/Haryana ➔ Delhi NCR)',
          { sticky: true }
        );
        plumeGroup.addLayer(polyline);
      });

      plumeGroup.addTo(map);
      plumeLayerRef.current = plumeGroup;
    }

    // 2. SMOG DISPERSION HEAT CIRCLES
    if (showHeatCircles) {
      const heatGroup = L.layerGroup();
      visibleStations.forEach(st => {
        let circleColor = '#059669';
        if (st.aqi > 400) circleColor = '#581c87';
        else if (st.aqi > 300) circleColor = '#831843';
        else if (st.aqi > 200) circleColor = '#991b1b';
        else if (st.aqi > 100) circleColor = '#ea580c';
        else if (st.aqi > 50) circleColor = '#d97706';

        const circle = L.circle([st.lat, st.lng], {
          radius: heatRadius,
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: heatOpacity,
          weight: 1.5
        });

        circle.bindTooltip(
          `<strong>${st.shortName}</strong>: AQI ${st.aqi} • PM2.5 ${st.pm25} µg/m³ • PBL ${st.pblHeight}m`,
          { sticky: true }
        );

        heatGroup.addLayer(circle);
      });
      heatGroup.addTo(map);
      heatLayerRef.current = heatGroup;
    }

    // 3. NASA FIRMS STUBBLE FIRE HOTSPOTS
    if (showFirmsHotspots) {
      const firmsGroup = L.layerGroup();
      NASA_FIRMS_HOTSPOTS.forEach(fire => {
        const fireIcon = L.divIcon({
          className: 'nasa-firms-icon',
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              background: radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.6) 70%, transparent 100%);
              border-radius: 50%;
              cursor: pointer;
            ">
              <span style="font-size: 18px; filter: drop-shadow(0 0 6px #ef4444);">🔥</span>
              <div class="beacon-pulse-ring" style="border: 2px solid #ef4444;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const fireMarker = L.marker([fire.lat, fire.lng], { icon: fireIcon });
        fireMarker.bindPopup(`
          <div style="padding: 6px; min-width: 220px;">
            <div style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase;">
              🛰️ NASA FIRMS Thermal Satellite Hotspot
            </div>
            <div style="font-size: 13.5px; font-weight: 800; margin: 4px 0;">${fire.name}</div>
            <div style="font-size: 12px; margin-bottom: 4px;">
              Fire Radiative Power (FRP): <strong>${fire.frp} MW</strong>
            </div>
            <div style="font-size: 12px; margin-bottom: 4px;">
              Active Fire Points: <strong>${fire.fires} clusters</strong>
            </div>
            <div style="font-size: 11px; color: #64748b; font-style: italic;">
              ${fire.plumeDirection}
            </div>
          </div>
        `);
        firmsGroup.addLayer(fireMarker);
      });
      firmsGroup.addTo(map);
      firmsLayerRef.current = firmsGroup;
    }

    // 4. MODERN HIGH-CONTRAST STATION PIN MARKERS
    visibleStations.forEach((st) => {
      const isSelected = st.id === selectedStation.id;
      const isCompared = comparisonList.some(s => s.id === st.id);
      const isFav = favorites.includes(st.id);

      let bg = '#065f46';
      let border = '#10b981';
      let textColor = '#ffffff';

      if (st.aqi > 400) { bg = '#581c87'; border = '#c084fc'; }
      else if (st.aqi > 300) { bg = '#831843'; border = '#f472b6'; }
      else if (st.aqi > 200) { bg = '#991b1b'; border = '#f87171'; }
      else if (st.aqi > 100) { bg = '#9a3412'; border = '#fb923c'; }
      else if (st.aqi > 50) { bg = '#854d0e'; border = '#facc15'; }

      const isSevere = st.aqi > 300;

      let iconHtml = '';
      if (markerPinStyle === 'compact') {
        iconHtml = `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            background-color: ${bg};
            border: 2px solid ${isSelected ? '#ffffff' : border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${textColor};
            font-family: monospace;
            font-size: 11px;
            font-weight: 800;
            box-shadow: ${isSelected ? '0 0 0 4px rgba(37, 99, 235, 0.5), 0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)'};
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1.0)'};
            transition: transform 0.15s ease;
            cursor: pointer;
          ">
            ${isSevere && enableBeaconPulse ? `<div class="beacon-pulse-ring" style="border: 2px solid ${border};"></div>` : ''}
            <span>${st.aqi}</span>
          </div>
        `;
      } else {
        iconHtml = `
          <div style="
            position: relative;
            background-color: ${bg};
            color: ${textColor};
            border: ${isSelected ? '2.5px solid #ffffff' : `1.5px solid ${border}`};
            padding: 5px 9px;
            font-family: var(--font-sans, sans-serif);
            font-size: 11px;
            font-weight: 700;
            border-radius: 8px;
            box-shadow: ${isSelected ? '0 0 0 4px rgba(37, 99, 235, 0.45), 0 8px 16px rgba(0,0,0,0.35)' : '0 3px 10px rgba(0,0,0,0.25)'};
            text-align: center;
            white-space: nowrap;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.12)' : 'scale(1.0)'};
            transition: all 0.15s ease;
          ">
            ${isSevere && enableBeaconPulse ? `<div class="beacon-pulse-ring" style="border: 2px solid ${border};"></div>` : ''}
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span>${isFav ? '⭐' : ''}</span>
              <span>${st.shortName}</span>
            </div>
            <div style="font-family: monospace; font-size: 13.5px; font-weight: 800; margin-top: 1px;">
              AQI ${st.aqi}
            </div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: iconHtml,
        iconSize: markerPinStyle === 'compact' ? [28, 28] : [105, 42],
        iconAnchor: markerPinStyle === 'compact' ? [14, 14] : [52, 21]
      });

      const marker = L.marker([st.lat, st.lng], { icon: customIcon }).addTo(map);

      // Rich Interactive Popup
      const catMeta = AQI_CATEGORIES[st.category] || AQI_CATEGORIES["Moderate"];
      const popupDiv = document.createElement('div');
      popupDiv.style.minWidth = '230px';
      popupDiv.style.padding = '8px 4px';

      popupDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div>
            <div style="font-size: 14.5px; font-weight: 800; color: var(--text-main);">${st.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${st.zone} • ${st.lat.toFixed(3)}°N, ${st.lng.toFixed(3)}°E</div>
          </div>
          <span class="tag" style="background-color: ${bg}; color: #ffffff; border: none; font-size: 10px; font-weight: 800;">
            ${language === 'hi' && catMeta.labelHi ? catMeta.labelHi.split(' ')[0] : st.category}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: rgba(0,0,0,0.04); padding: 8px; border-radius: 6px; margin: 8px 0; font-family: monospace; font-size: 11px;">
          <div>
            <div style="font-size: 9.5px; color: #64748b; text-transform: uppercase;">AQI</div>
            <div style="font-size: 14px; font-weight: 800; color: ${bg};">${st.aqi}</div>
          </div>
          <div>
            <div style="font-size: 9.5px; color: #64748b; text-transform: uppercase;">PM2.5</div>
            <div style="font-weight: 700;">${st.pm25} µg</div>
          </div>
          <div>
            <div style="font-size: 9.5px; color: #64748b; text-transform: uppercase;">PBL Lid</div>
            <div style="font-weight: 700;">${st.pblHeight}m</div>
          </div>
        </div>

        <div style="font-size: 11.5px; line-height: 1.35; margin-bottom: 10px; color: var(--text-muted);">
          ${language === 'hi' && catMeta.laymanHi ? catMeta.laymanHi : catMeta.layman}
        </div>
      `;

      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '6px';
      btnRow.style.flexWrap = 'wrap';

      const selectBtn = document.createElement('button');
      selectBtn.className = 'btn btn-sm';
      selectBtn.style.fontSize = '11px';
      selectBtn.style.padding = '5px 9px';
      selectBtn.innerText = isSelected 
        ? (language === 'hi' ? '✓ सक्रिय' : '✓ Active') 
        : (language === 'hi' ? 'सक्रिय चुनें' : 'Select Active');
      selectBtn.onclick = () => {
        setSelectedStation(st);
        map.closePopup();
      };
      btnRow.appendChild(selectBtn);

      const compareBtn = document.createElement('button');
      compareBtn.className = 'btn btn-outline btn-sm';
      compareBtn.style.fontSize = '11px';
      compareBtn.style.padding = '5px 9px';
      compareBtn.innerText = isCompared 
        ? (language === 'hi' ? 'तुलना हटाएं' : 'Remove Compare') 
        : (language === 'hi' ? '+ तुलना' : '+ Compare');
      compareBtn.onclick = () => {
        toggleComparison(st);
        map.closePopup();
      };
      btnRow.appendChild(compareBtn);

      const pinBtn = document.createElement('button');
      pinBtn.className = 'btn btn-outline btn-sm';
      pinBtn.style.fontSize = '11px';
      pinBtn.style.padding = '5px 9px';
      pinBtn.innerText = isFav ? '⭐' : '☆';
      pinBtn.title = language === 'hi' ? 'पिन टॉगल करें' : 'Pin Station';
      pinBtn.onclick = () => {
        toggleFavorite(st.id);
        map.closePopup();
      };
      btnRow.appendChild(pinBtn);

      popupDiv.appendChild(btnRow);
      marker.bindPopup(popupDiv);

      marker.on('click', () => {
        setSelectedStation(st);
      });

      markersRef.current.push(marker);
    });

  }, [
    visibleStations,
    selectedStation,
    setSelectedStation,
    activeStyleId,
    tileProvider,
    mapboxToken,
    retinaResolution,
    showPlumeOverlay,
    plumeOpacity,
    showHeatCircles,
    heatRadius,
    heatOpacity,
    showFirmsHotspots,
    markerPinStyle,
    enableBeaconPulse,
    comparisonList,
    favorites,
    language,
    theme,
    getTileUrl,
    toggleComparison,
    toggleFavorite
  ]);

  // Fly to selected station smoothly
  useEffect(() => {
    if (mapInstanceRef.current && selectedStation) {
      mapInstanceRef.current.flyTo([selectedStation.lat, selectedStation.lng], 12.5, { duration: 0.8 });
    }
  }, [selectedStation]);

  // Clean up Leaflet map instance on component unmount to prevent container re-initialization errors
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Map Controls Helpers
  const fitAllStations = () => {
    if (!mapInstanceRef.current || stations.length === 0) return;
    const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  };

  const resetDelhiCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([28.6139, 77.2090], 11, { duration: 0.8 });
    }
  };

  const flyToZone = (lat, lng, zoom = 12.5) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 0.8 });
    }
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      addToast(language === 'hi' ? 'ब्राउज़र में जियोलोकेशन समर्थित नहीं है' : 'Geolocation not supported in this browser', 'error');
      return;
    }

    addToast(language === 'hi' ? 'वर्तमान स्थिति का पता लगाया जा रहा है...' : 'Acquiring GPS location in Delhi NCR...', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        if (userLocationLayerRef.current) {
          map.removeLayer(userLocationLayerRef.current);
        }

        const userMarker = L.circleMarker([latitude, longitude], {
          radius: 9,
          color: '#2563eb',
          fillColor: '#38bdf8',
          fillOpacity: 0.9,
          weight: 3
        }).addTo(map);

        userMarker.bindPopup(`
          <div style="font-size: 13px; font-weight: 700; padding: 4px;">
            📍 ${language === 'hi' ? 'आपकी वर्तमान स्थिति' : 'Your Detected Location'}
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</div>
          </div>
        `).openPopup();

        userLocationLayerRef.current = userMarker;
        map.flyTo([latitude, longitude], 13.5, { duration: 1.0 });
        addToast(language === 'hi' ? 'आपकी स्थिति मैप पर प्रदर्शित की गई!' : 'Found your location in Delhi NCR!', 'success');
      },
      () => {
        addToast(language === 'hi' ? 'जियोलोकेशन अनुमति अस्वीकृत या उपलब्ध नहीं' : 'GPS location permission denied or timed out', 'error');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      className={`panel ${isFullscreen ? 'mapbox-container-fullscreen' : ''}`}
      id="map-section"
      style={{
        position: 'relative',
        transition: 'all 0.2s ease',
        marginBottom: isFullscreen ? 0 : '20px',
        padding: isFullscreen ? '12px' : undefined
      }}
    >
      {/* Top Header / Bar */}
      <div className="panel-header" style={{ marginBottom: '12px' }}>
        <div>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{t('map.title', 'DELHI NCR MAPBOX MONITORING GRID & DATA MATRIX')}</span>
            <span className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', fontSize: '10px' }}>
              Mapbox GL HD
            </span>
          </div>
          <span className="subtitle">
            {t('map.subtitle', 'Inspect and compare all active monitoring nodes across Delhi NCR on high-resolution maps with stubble wind vectors.')}
          </span>
        </div>

        {/* Action Buttons Top Header */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Configure basemap styles, resolution, and atmospheric layers"
          >
            <span>⚙️</span>
            <span>{t('map.settings', 'Mapbox Settings')}</span>
          </button>

          {/* Locate Me GPS */}
          <button
            onClick={handleLocateUser}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
            title="Locate my position in Delhi NCR"
          >
            🎯 {t('map.locateMe', 'Locate Me')}
          </button>

          {/* Fit All */}
          <button
            onClick={fitAllStations}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            📏 {language === 'hi' ? 'सभी स्टेशन फिट करें' : 'Fit All'}
          </button>

          {/* Reset Delhi */}
          <button
            onClick={resetDelhiCenter}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            🔄 {t('map.resetView', 'Reset Delhi')}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '11px', padding: '5px 10px' }}
          >
            {isFullscreen ? `✕ ${t('map.exitFullscreen', 'Exit Fullscreen')}` : `⛶ ${t('map.fullscreen', 'Fullscreen')}`}
          </button>

          {/* Add Station */}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="btn btn-sm"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {t('map.addReading', '+ Add Station')}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Quick Bar: Category Filters & Fly-To Zones */}
      <div style={{
        backgroundColor: 'var(--bg-panel-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card)',
        padding: '10px 14px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {language === 'hi' ? 'फ़िल्टर:' : 'Filter:'}
          </span>
          {[
            { id: 'all', label: language === 'hi' ? `सभी (${stations.length})` : `All (${stations.length})` },
            { id: 'severe', label: language === 'hi' ? '🔥 गंभीर (300+)' : '🔥 Severe (300+)' },
            { id: 'unhealthy', label: language === 'hi' ? '⚠️ अस्वस्थ (200-300)' : '⚠️ Unhealthy (200-300)' },
            { id: 'moderate', label: language === 'hi' ? '🟢 मध्यम (<200)' : '🟢 Moderate (<200)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setCategoryFilter(f.id)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                backgroundColor: categoryFilter === f.id ? 'var(--accent-primary)' : 'transparent',
                color: categoryFilter === f.id ? '#ffffff' : 'var(--text-main)',
                borderColor: categoryFilter === f.id ? 'var(--accent-primary)' : 'var(--border-color)',
                fontWeight: categoryFilter === f.id ? 700 : 500
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Quick Fly-To Zones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
            {t('map.flyTo', 'Fly To:')}
          </span>
          {[
            { label: language === 'hi' ? 'सेंट्रल दिल्ली' : 'Central', lat: 28.6315, lng: 77.2167 },
            { label: language === 'hi' ? 'पूर्वी दिल्ली' : 'East Delhi', lat: 28.6469, lng: 77.3162 },
            { label: language === 'hi' ? 'दक्षिणी दिल्ली' : 'South Delhi', lat: 28.5300, lng: 77.2000 },
            { label: 'नोएडा (Noida)', lat: 28.6243, lng: 77.3649 },
            { label: 'गुरुग्राम (Gurugram)', lat: 28.4950, lng: 77.0895 }
          ].map(z => (
            <button
              key={z.label}
              onClick={() => flyToZone(z.lat, z.lng)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '10.5px', padding: '2px 7px' }}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container Wrapper with Overlay HUD */}
      <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
        {/* Leaflet Map DOM Element */}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: isFullscreen ? 'calc(100vh - 120px)' : '520px',
            backgroundColor: 'var(--bg-page)',
            transition: 'height 0.2s ease'
          }}
        />

        {/* Floating Bottom-Left HUD: Active Station Telemetry */}
        <div
          className="map-hud-glass"
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 1000,
            padding: '12px 16px',
            borderRadius: 'var(--radius-card)',
            maxWidth: '310px',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
              {language === 'hi' ? 'सक्रिय नोड टेलीमेट्री' : 'Active Node Telemetry'}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: selectedStation.aqi > 300 ? '#7a1d1d' : selectedStation.aqi > 200 ? '#7c3514' : '#1e3a8a',
              color: '#ffffff'
            }}>
              AQI {selectedStation.aqi}
            </span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '4px' }}>
            {selectedStation.shortName}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
            <div>PM2.5: <strong>{selectedStation.pm25} µg</strong></div>
            <div>PBL: <strong>{selectedStation.pblHeight}m</strong></div>
            <div>Wind: <strong>{selectedStation.windSpeed} km/h</strong></div>
            <div>Dir: <strong>{selectedStation.windDirectionText}</strong></div>
          </div>
        </div>

        {/* Floating Top-Left Layer Indicator Badge */}
        <div
          className="map-hud-glass"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulseDot 2s infinite' }}></span>
          <span>{mapStyle === 'auto' ? `Mapbox (${theme === 'dark' ? 'Dark' : 'Light'})` : `Mapbox ${mapStyle}`}</span>
          {showPlumeOverlay && <span>• 🔥 NW Plumes</span>}
          {showFirmsHotspots && <span>• 🛰️ NASA FIRMS</span>}
        </div>
      </div>

      {/* MAPBOX SETTINGS MODAL */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div
            className="panel"
            style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: 'var(--bg-panel)',
              borderRadius: 'var(--radius-panel)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
                  ⚡ Mapbox GL Architecture &amp; Telemetry
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 4px 0' }}>
                  {t('map.settingsTitle', 'Mapbox Configuration & Visual Overlays')}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                  {t('map.settingsSubtitle', 'Customize vector tile styles, resolution, and atmospheric overlay layers.')}
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '13px', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              {[
                { id: 'style', label: language === 'hi' ? '🎨 बेसमेप शैली' : '🎨 Basemap Style' },
                { id: 'layers', label: language === 'hi' ? '🌪️ वायुमंडलीय परतें' : '🌪️ Layers & Smoke' }
              ].map(tb => (
                <button
                  key={tb.id}
                  onClick={() => setActiveSettingsTab(tb.id)}
                  className="btn btn-outline btn-sm"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    backgroundColor: activeSettingsTab === tb.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeSettingsTab === tb.id ? '#ffffff' : 'var(--text-main)',
                    borderColor: activeSettingsTab === tb.id ? 'var(--accent-primary)' : 'var(--border-color)',
                    fontWeight: activeSettingsTab === tb.id ? 700 : 500
                  }}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* TAB 1: BASEMAP STYLES */}
            {activeSettingsTab === 'style' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Tile Provider Fallback Selector */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {language === 'hi' ? 'टाइल प्रदाता सेवा:' : 'Tile Provider Service:'}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {[
                      { id: 'mapbox', label: 'Mapbox API (High-Res Vector)' },
                      { id: 'cartodb', label: 'CartoDB (Dark/Light Matter)' },
                      { id: 'osm', label: 'OpenStreetMap' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setTileProvider(p.id)}
                        className="btn btn-outline btn-sm"
                        style={{
                          flex: 1,
                          backgroundColor: tileProvider === p.id ? 'var(--accent-primary)' : 'transparent',
                          color: tileProvider === p.id ? '#ffffff' : 'var(--text-main)',
                          borderColor: tileProvider === p.id ? 'var(--accent-primary)' : 'var(--border-color)',
                          fontSize: '11px'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {t('map.tileStyleLabel', 'Mapbox Basemap Style:')}
                  </label>
                  <div className="grid-2" style={{ gap: '10px', marginTop: '8px' }}>
                    {[
                      { id: 'auto', label: '🔄 Auto Theme Sync', desc: 'Syncs Dark/Light with app mode' },
                      { id: 'dark-v11', label: '🌙 Mapbox Dark v11', desc: 'Sleek night obsidian palette' },
                      { id: 'light-v11', label: '☀️ Mapbox Light v11', desc: 'High-clarity architectural paper' },
                      { id: 'satellite-streets-v12', label: '🛰️ Satellite Streets', desc: 'Photorealistic satellite vector tiles' },
                      { id: 'outdoors-v12', label: '🌲 Outdoors / Topo', desc: 'Elevation contours & natural terrain' },
                      { id: 'streets-v12', label: '🏙️ Mapbox Streets v12', desc: 'Comprehensive road & transit network' },
                      { id: 'navigation-night-v1', label: '🌃 Navigation Night', desc: 'Ultra-contrast vehicular night view' }
                    ].map(st => {
                      const isSel = mapStyle === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setMapStyle(st.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-card)',
                            border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            backgroundColor: isSel ? 'var(--bg-panel-subtle)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '13px', color: isSel ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                            {st.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {st.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Retina Resolution Toggle */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <div
                    className="spring-check-setting-card"
                    data-active={retinaResolution}
                    onClick={() => setRetinaResolution(prev => !prev)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {t('map.retinaTiles', 'Retina @2x HD 512px Tiles')}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {language === 'hi' ? 'उच्च घनत्व वाले डिस्प्ले हेतु 512px टाइल्स' : 'Double pixel resolution for crystal clear road & text rendering'}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpringCheck
                        checked={retinaResolution}
                        onChange={(checked) => setRetinaResolution(checked)}
                        strike="none"
                        boxSize={22}
                        boxRadius={6}
                        color="var(--accent-primary)"
                        fillColor="var(--accent-primary)"
                        checkColor="#ffffff"
                        bounce={0.25}
                        ariaLabel={t('map.retinaTiles', 'Retina @2x HD 512px Tiles')}
                      />
                    </div>
                  </div>
                </div>

                {/* Marker Pin Style */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {t('map.pinStyleLabel', 'Station Marker Pin Style:')}
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      onClick={() => setMarkerPinStyle('detailed')}
                      className="btn btn-outline btn-sm"
                      style={{
                        flex: 1,
                        backgroundColor: markerPinStyle === 'detailed' ? 'var(--accent-primary)' : 'transparent',
                        color: markerPinStyle === 'detailed' ? '#ffffff' : 'var(--text-main)',
                        borderColor: markerPinStyle === 'detailed' ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      🏷️ {t('map.pinDetailed', 'Detailed Badge (AQI + Name)')}
                    </button>
                    <button
                      onClick={() => setMarkerPinStyle('compact')}
                      className="btn btn-outline btn-sm"
                      style={{
                        flex: 1,
                        backgroundColor: markerPinStyle === 'compact' ? 'var(--accent-primary)' : 'transparent',
                        color: markerPinStyle === 'compact' ? '#ffffff' : 'var(--text-main)',
                        borderColor: markerPinStyle === 'compact' ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      🔘 {t('map.pinMinimal', 'Compact Glowing Beacon')}
                    </button>
                  </div>
                </div>

                {/* Beacon Pulse Toggle */}
                <div>
                  <div
                    className="spring-check-setting-card"
                    data-active={enableBeaconPulse}
                    onClick={() => setEnableBeaconPulse(prev => !prev)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {language === 'hi' ? 'गंभीर हॉटस्पॉट हेतु चमकता रडार बीकन' : 'Severe Hotspot Radar Pulse Glow'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {language === 'hi' ? 'AQI 300+ वाले गंभीर स्टेशनों पर एनिमेटेड पल्स' : 'Animated radar pulse on stations exceeding AQI 300'}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpringCheck
                        checked={enableBeaconPulse}
                        onChange={(checked) => setEnableBeaconPulse(checked)}
                        strike="none"
                        boxSize={22}
                        boxRadius={6}
                        color="var(--accent-primary)"
                        fillColor="var(--accent-primary)"
                        checkColor="#ffffff"
                        bounce={0.25}
                        ariaLabel="Severe Hotspot Radar Pulse Glow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ATMOSPHERIC LAYERS */}
            {activeSettingsTab === 'layers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Stubble Wind Plumes */}
                <div style={{
                  padding: '12px 14px',
                  border: showPlumeOverlay ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: showPlumeOverlay ? 'rgba(0, 180, 216, 0.06)' : 'var(--bg-panel-subtle)',
                  transition: 'all 0.2s ease'
                }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }}
                    onClick={() => setShowPlumeOverlay(prev => !prev)}
                  >
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                      🔥 {t('map.stubblePlumes', 'NW Stubble Smoke Vector Corridor')}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpringCheck
                        checked={showPlumeOverlay}
                        onChange={(checked) => setShowPlumeOverlay(checked)}
                        strike="none"
                        boxSize={22}
                        boxRadius={6}
                        color="var(--accent-primary)"
                        fillColor="var(--accent-primary)"
                        checkColor="#ffffff"
                        bounce={0.25}
                        ariaLabel={t('map.stubblePlumes', 'NW Stubble Smoke Vector Corridor')}
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0' }}>
                    {language === 'hi'
                      ? 'पंजाब और हरियाणा से दिल्ली में प्रवेश करने वाले पराली धुएं के हवा के तीरों का लाइव एनिमेशन।'
                      : 'Animated vector streamlines tracing Northwest crop residue smoke advection from Punjab/Haryana into Delhi NCR.'}
                  </p>
                  {showPlumeOverlay && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>{t('map.overlayOpacity', 'Overlay Opacity:')}</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{Math.round(plumeOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={plumeOpacity}
                        onChange={(e) => setPlumeOpacity(parseFloat(e.target.value))}
                        className="range-slider"
                      />
                    </div>
                  )}
                </div>

                {/* NASA FIRMS Hotspots */}
                <div
                  className="spring-check-setting-card"
                  data-active={showFirmsHotspots}
                  onClick={() => setShowFirmsHotspots(prev => !prev)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                      🛰️ {t('map.firmsHotspots', 'NASA FIRMS Stubble Fire Hotspots')}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {language === 'hi' ? 'नासा उपग्रह द्वारा संसूचक सक्रिय पराली आग के बिंदु और थर्मल विकिरण (MW)' : 'Real-time MODIS/VIIRS thermal satellite detections along Punjab & Haryana borders'}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SpringCheck
                      checked={showFirmsHotspots}
                      onChange={(checked) => setShowFirmsHotspots(checked)}
                      strike="none"
                      boxSize={22}
                      boxRadius={6}
                      color="var(--accent-primary)"
                      fillColor="var(--accent-primary)"
                      checkColor="#ffffff"
                      bounce={0.25}
                      ariaLabel={t('map.firmsHotspots', 'NASA FIRMS Stubble Fire Hotspots')}
                    />
                  </div>
                </div>

                {/* Smog Dispersion Radii */}
                <div style={{
                  padding: '12px 14px',
                  border: showHeatCircles ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-card)',
                  backgroundColor: showHeatCircles ? 'rgba(0, 180, 216, 0.06)' : 'var(--bg-panel-subtle)',
                  transition: 'all 0.2s ease'
                }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }}
                    onClick={() => setShowHeatCircles(prev => !prev)}
                  >
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-main)' }}>
                      ⭕ {t('map.smogDispersion', 'Smog Dispersion Heat Radii')}
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpringCheck
                        checked={showHeatCircles}
                        onChange={(checked) => setShowHeatCircles(checked)}
                        strike="none"
                        boxSize={22}
                        boxRadius={6}
                        color="var(--accent-primary)"
                        fillColor="var(--accent-primary)"
                        checkColor="#ffffff"
                        bounce={0.25}
                        ariaLabel={t('map.smogDispersion', 'Smog Dispersion Heat Radii')}
                      />
                    </div>
                  </div>
                  {showHeatCircles && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          <span>{t('map.dispersionRadius', 'Smog Radius (km):')}</span>
                          <span>{(heatRadius / 1000).toFixed(1)} km</span>
                        </div>
                        <input
                          type="range"
                          min="1500"
                          max="7000"
                          step="500"
                          value={heatRadius}
                          onChange={(e) => setHeatRadius(parseInt(e.target.value))}
                          className="range-slider"
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          <span>{t('map.overlayOpacity', 'Overlay Opacity:')}</span>
                          <span>{Math.round(heatOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.45"
                          step="0.05"
                          value={heatOpacity}
                          onChange={(e) => setHeatOpacity(parseFloat(e.target.value))}
                          className="range-slider"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-sm"
                style={{ padding: '6px 18px' }}
              >
                {t('common.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
