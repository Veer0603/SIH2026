import React, { useState, useMemo, useEffect, useRef } from 'react';
import { generateML72hForecast } from '../utils/mlEngine';
import { AQI_CATEGORIES } from '../data/delhiStationsData';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { useApp } from '../context/useApp';

export default function Forecast72h({ station }) {
  const { addToast, theme, language, t } = useApp();
  const [selectedHour, setSelectedHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x, 2x, 4x
  const [activeMetric, setActiveMetric] = useState('aqi'); // 'aqi' | 'pm25' | 'pblHeight' | 'temp' | 'windSpeed'
  const canvasRef = useRef(null);

  // Policy Scenarios State
  const [scenarios, setScenarios] = useState({
    stubbleBan: false,
    oddEven: false,
    smogGuns: false,
    rainWashout: false
  });

  const toggleScenario = (key) => {
    setScenarios(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const forecastData = useMemo(() => {
    return generateML72hForecast(station, scenarios);
  }, [station, scenarios]);

  const currentPoint = forecastData[selectedHour] || forecastData[0];
  const pointCategory = AQI_CATEGORIES[currentPoint.category] || AQI_CATEGORIES["Moderate"];

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 300 / playSpeed;
    const interval = setInterval(() => {
      setSelectedHour(prev => {
        if (prev >= 72) {
          setIsPlaying(false);
          return 72;
        }
        return prev + 1;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  // Canvas drawing for multi-track 72-hour chart
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Theme-aware grid lines
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e0dad0';
    ctx.lineWidth = 1;
    for (let y = 30; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    const paddingLeft = 45;
    const paddingBottom = 30;
    const chartWidth = width - paddingLeft - 20;
    const chartHeight = height - paddingBottom - 20;

    // Get max value and theme-aware line colors based on activeMetric
    let maxVal = 500;
    let label = 'AQI';
    let lineColor = isDark ? '#58a6ff' : '#1b2e4b';

    if (activeMetric === 'pm25') {
      maxVal = 400;
      label = 'PM2.5 (µg/m³)';
      lineColor = isDark ? '#ff7b72' : '#7a1d1d';
    } else if (activeMetric === 'pblHeight') {
      maxVal = 1000;
      label = 'PBL Height (m)';
      lineColor = isDark ? '#f08c35' : '#b87333';
    } else if (activeMetric === 'temp') {
      maxVal = 40;
      label = 'Temp (°C)';
      lineColor = isDark ? '#f2cc60' : '#d97724';
    } else if (activeMetric === 'windSpeed') {
      maxVal = 20;
      label = 'Wind (km/h)';
      lineColor = isDark ? '#7ee787' : '#2b7a3e';
    }

    // Y Axis labels
    ctx.fillStyle = isDark ? '#9aa0a6' : '#5e6368';
    ctx.font = '10px monospace';
    ctx.fillText(`${maxVal}`, 6, 25);
    ctx.fillText(`${Math.round(maxVal / 2)}`, 6, height / 2);
    ctx.fillText('0', 16, height - paddingBottom);

    // Plot Line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;

    forecastData.forEach((pt, index) => {
      const val = pt[activeMetric] || 0;
      const x = paddingLeft + (index / 72) * chartWidth;
      const y = height - paddingBottom - (val / maxVal) * chartHeight;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot secondary comparison line: PBL boundary layer (dashed amber) if not already active
    if (activeMetric !== 'pblHeight') {
      ctx.beginPath();
      ctx.strokeStyle = isDark ? '#f08c35' : '#b87333';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      forecastData.forEach((pt, index) => {
        const x = paddingLeft + (index / 72) * chartWidth;
        const y = height - paddingBottom - (pt.pblHeight / 1000) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Highlight Selected Hour vertical crosshair
    const selX = paddingLeft + (selectedHour / 72) * chartWidth;
    ctx.beginPath();
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.moveTo(selX, 10);
    ctx.lineTo(selX, height - paddingBottom);
    ctx.stroke();

    // Selected point circle
    const currVal = currentPoint[activeMetric] || 0;
    const selY = height - paddingBottom - (currVal / maxVal) * chartHeight;
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.arc(selX, selY, 5.5, 0, 2 * Math.PI);
    ctx.fill();

    // Legend in chart
    ctx.fillStyle = lineColor;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`— Active: ${label}`, paddingLeft + 10, 20);
    if (activeMetric !== 'pblHeight') {
      ctx.fillStyle = isDark ? '#f08c35' : '#b87333';
      ctx.fillText('- - PBL Ceiling (0-1000m)', paddingLeft + 160, 20);
    }

  }, [forecastData, selectedHour, currentPoint, activeMetric, isDark]);

  const handleExportCSV = () => {
    const rows = forecastData.map(f => ({
      Hour_Offset: `+${f.hourOffset}h`,
      Time: f.timeLabel,
      AQI: f.aqi,
      Category: f.category,
      PM25_ugm3: f.pm25,
      PBL_Ceiling_m: f.pblHeight,
      Inversion_Pct: f.inversionStrength,
      Temperature_C: f.temp,
      Ozone_ugm3: f.o3,
      Wind_kmh: f.windSpeed,
      Model_Confidence_Pct: f.modelConfidence
    }));
    exportToCSV(`forecast_72h_${station.id}`, rows);
    addToast('72-hour forecast exported to CSV', 'success');
  };

  const handleExportJSON = () => {
    exportToJSON(`forecast_72h_${station.id}`, {
      station: station.name,
      generatedAt: new Date().toISOString(),
      activeScenarios: scenarios,
      hourlyForecast: forecastData
    });
    addToast('72-hour forecast exported to JSON', 'success');
  };

  return (
    <div className="panel" id="forecast-section">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>{language === 'hi' ? `72-घंटे WRF-CHEM + PINN ML दृष्टिकोण — ${station.shortName}` : `72-HOUR COUPLED WRF-CHEM + PINN ML OUTLOOK — ${station.shortName}`}</span>
          </div>
          <span className="subtitle">
            {language === 'hi'
              ? 'एरोसोल फीडबैक, सीमा परत दमन और नीतिगत हस्तक्षेपों का प्रति घंटा भौतिकी-आधारित सिमुलेशन।'
              : 'Hourly physics-informed trajectory simulating aerosol feedback, boundary layer suppression, and policy interventions.'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            📥 CSV
          </button>
          <button onClick={handleExportJSON} className="btn btn-outline btn-sm">
            📥 JSON
          </button>
        </div>
      </div>

      {/* Policy Intervention Scenarios Box */}
      <div style={{
        backgroundColor: 'var(--bg-page)',
        border: '1px solid var(--border-color)',
        padding: '14px 18px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {language === 'hi' ? 'नीतिगत हस्तक्षेप और मौसम परिदृश्य सिमुलेशन (काल्पनिक विश्लेषण):' : 'Simulate Policy Interventions & Weather Events (What-If Analysis):'}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { 
              id: 'stubbleBan', 
              label: language === 'hi' ? '🔥 पराली दहन रोकथाम (-65% धुआं)' : '🔥 Stubble Burning Crackdown (-65% Smoke)', 
              desc: language === 'hi' ? 'पंजाब व हरियाणा में अंतरराज्यीय प्रवर्तन' : 'Inter-state enforcement in Punjab/Haryana' 
            },
            { 
              id: 'oddEven', 
              label: language === 'hi' ? '🚗 ऑड-ईवन वाहन व्यवस्था (-15% ट्रैफिक)' : '🚗 Odd-Even Vehicle Rationing (-15% Traffic)', 
              desc: language === 'hi' ? 'वाहनों से होने वाले उत्सर्जन में कमी' : 'Vehicular emission reduction' 
            },
            { 
              id: 'smogGuns', 
              label: language === 'hi' ? '💧 एंटी-स्मॉग वाटर स्प्रिंकलर (-22% धूल)' : '💧 Anti-Smog Water Sprinklers (-22% Dust)', 
              desc: language === 'hi' ? 'यांत्रिक जल छिड़काव द्वारा धूल बैठाना' : 'Mechanical particulate washing' 
            },
            { 
              id: 'rainWashout', 
              label: language === 'hi' ? '🌧️ पश्चिमी विक्षोभ वर्षा (-70% धुलाई)' : '🌧️ Western Disturbance Rain (-70% Washout)', 
              desc: language === 'hi' ? 'प्राकृतिक मौसम विज्ञानिक सफाई' : 'Natural meteorological cleansing' 
            }
          ].map(sc => (
            <button
              key={sc.id}
              onClick={() => toggleScenario(sc.id)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '6px 12px',
                backgroundColor: scenarios[sc.id] ? 'var(--accent-primary)' : 'transparent',
                color: scenarios[sc.id] ? '#ffffff' : 'var(--text-main)',
                borderColor: scenarios[sc.id] ? 'var(--accent-primary)' : 'var(--border-color)',
                fontWeight: scenarios[sc.id] ? 700 : 500
              }}
              title={sc.desc}
            >
              {scenarios[sc.id] ? `✓ ${sc.label}` : sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Time Horizon Bar & Animation Controls */}
      <div style={{ marginBottom: '16px', backgroundColor: 'var(--bg-panel-subtle)', padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className="btn btn-sm"
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              {isPlaying ? (language === 'hi' ? '⏸ रोकें' : '⏸ Pause') : (language === 'hi' ? '▶ टाइमलाइन चलाएं' : '▶ Play Timeline')}
            </button>

            {/* Play speed selector */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 4].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaySpeed(spd)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '3px 6px',
                    fontSize: '10px',
                    backgroundColor: playSpeed === spd ? 'var(--accent-primary)' : 'transparent',
                    color: playSpeed === spd ? '#fff' : 'var(--text-main)'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {language === 'hi' ? `समय सीमा: +${selectedHour} घंटे (${currentPoint.timeLabel})` : `Horizon: +${selectedHour} Hours (${currentPoint.timeLabel})`}
            </span>
          </div>

          <span className={`tag ${pointCategory.bgClass}`} style={{ fontSize: '12px', fontWeight: 800 }}>
            {t('common.aqi', 'AQI')} {currentPoint.aqi} — {language === 'hi' && pointCategory.labelHi ? pointCategory.labelHi.split(' ')[0] : currentPoint.category}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="72"
          value={selectedHour}
          onChange={(e) => {
            setSelectedHour(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="range-slider"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>{language === 'hi' ? 'अभी (+0घं)' : 'Now (+0h)'}</span>
          <span>{language === 'hi' ? '+24घं (कल)' : '+24h (Tomorrow)'}</span>
          <span>{language === 'hi' ? '+48h (परसों)' : '+48h (Day After)'}</span>
          <span>{language === 'hi' ? '+72घं दृष्टिकोण' : '+72h Outlook'}</span>
        </div>
      </div>

      {/* Metric Selector for Canvas Chart */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', alignSelf: 'center' }}>
          {language === 'hi' ? 'चार्ट चर:' : 'Chart Variable:'}
        </span>
        {[
          { id: 'aqi', label: language === 'hi' ? 'वायु गुणवत्ता सूचकांक (AQI)' : 'Air Quality Index (AQI)' },
          { id: 'pm25', label: 'PM2.5 (µg/m³)' },
          { id: 'pblHeight', label: language === 'hi' ? 'सीमा परत ऊंचाई (PBL m)' : 'PBL Ceiling Height (m)' },
          { id: 'temp', label: language === 'hi' ? 'तापमान (°C)' : 'Temperature (°C)' },
          { id: 'windSpeed', label: language === 'hi' ? 'हवा की गति (km/h)' : 'Wind Velocity (km/h)' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: activeMetric === m.id ? 'var(--accent-primary)' : 'transparent',
              color: activeMetric === m.id ? '#ffffff' : 'var(--text-main)',
              borderColor: activeMetric === m.id ? 'var(--accent-primary)' : 'var(--border-color)'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Canvas 72h Chart */}
      <div style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
        <canvas
          ref={canvasRef}
          width={840}
          height={260}
          style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)' }}
        />
      </div>

      {/* Point Telemetry Metrics at Selected Hour */}
      <div className="grid-4" style={{ gap: '12px', marginBottom: '20px' }}>
        <div className="metric-box">
          <div className="metric-label">{language === 'hi' ? 'पूर्वानुमानित AQI' : 'Predicted AQI'}</div>
          <div className="metric-value">{currentPoint.aqi}</div>
          <div className="metric-sub">{language === 'hi' && pointCategory.labelHi ? pointCategory.labelHi.split(' ')[0] : currentPoint.category}</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">{language === 'hi' ? 'PM2.5 एरोसोल' : 'PM2.5 Aerosol'}</div>
          <div className="metric-value">{currentPoint.pm25}<span className="metric-unit">µg/m³</span></div>
          <div className="metric-sub">{currentPoint.pm25 > 60 ? (language === 'hi' ? 'खतरनाक सांद्रता' : 'Hazardous Concentration') : (language === 'hi' ? 'स्वीकार्य' : 'Acceptable')}</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">{language === 'hi' ? 'इनवर्जन सीमा (PBL)' : 'Inversion Ceiling (PBL)'}</div>
          <div className="metric-value">{currentPoint.pblHeight}<span className="metric-unit">m</span></div>
          <div className="metric-sub">{currentPoint.pblHeight < 350 ? (language === 'hi' ? 'दबी हुई स्मॉग चादर' : 'Compressed Smog Cap') : (language === 'hi' ? 'वायुमंडलीय फैलाव' : 'Atmospheric Dilution')}</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">{language === 'hi' ? 'सतह तापमान' : 'Surface Temperature'}</div>
          <div className="metric-value">{currentPoint.temp}<span className="metric-unit">°C</span></div>
          <div className="metric-sub">{language === 'hi' ? `हवा: ${currentPoint.windSpeed} km/h` : `Wind: ${currentPoint.windSpeed} km/h`}</div>
        </div>
      </div>
    </div>
  );
}
