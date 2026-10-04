import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import { playAtmosphereTone } from '../utils/audioSynthesizer';

export default function Navigation({ currentPage, setCurrentPage, onOpenAddModal, onOpenFlowGuide, onOpenQuickJump }) {
  const {
    language,
    toggleLanguage,
    t,
    theme,
    toggleTheme,
    liveSimulation,
    setLiveSimulation,
    refreshTelemetry,
    soundEnabled,
    setSoundEnabled,
    comparisonList,
    setIsCompareModalOpen,
    lastUpdated,
    selectedStation
  } = useApp();

  const isHindi = language === 'hi';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all'); // 'all' | 'live' | 'citizen' | 'science' | 'trust'

  const categories = [
    { id: 'all', label: isHindi ? 'सभी मॉड्यूल' : 'All Modules', icon: '✨' },
    { id: 'live', label: isHindi ? 'लाइव व मैप' : 'Live & Geo', icon: '⚡' },
    { id: 'citizen', label: isHindi ? 'नागरिक स्वास्थ्य' : 'Citizen Health', icon: '🛡️' },
    { id: 'science', label: isHindi ? 'विज्ञान व लैब' : 'Science Labs', icon: '🔬' },
    { id: 'trust', label: isHindi ? 'ऑडिट व ब्लॉकचेन' : 'Trust & Audit', icon: '⛓️' }
  ];

  const pages = [
    // Live & Geo
    { id: 'overview', category: 'live', label: t('nav.overview', 'Overview & Live AQI'), icon: '⚡' },
    { id: 'map', category: 'live', label: t('nav.map', 'Mapbox Grid & Matrix'), icon: '🗺️' },

    // Citizen Health
    { id: 'ai-advisor', category: 'citizen', label: t('nav.aiAdvisor', 'AeroAI Health Advisor'), icon: '🤖' },
    { id: 'route-planner', category: 'citizen', label: t('nav.routePlanner', 'Commute Exposure Planner'), icon: '🧭' },
    { id: 'layman', category: 'citizen', label: t('nav.layman', 'Air Simplified (Bilingual)'), icon: '📖' },
    { id: 'chatbot', category: 'citizen', label: t('nav.chatbot', 'AI AQI Chatbot'), icon: '💬' },

    // Science Labs
    { id: 'forecast', category: 'science', label: t('nav.forecast', '72h Forecast & Policy'), icon: '⏳' },
    { id: 'inversion', category: 'science', label: t('nav.inversion', 'Inversion Physics'), icon: '🧪' },
    { id: 'ai-lab', category: 'science', label: t('nav.aiLab', 'AI/ML Neural Studio'), icon: '🧠' },

    // Trust & Audit
    { id: 'blockchain', category: 'trust', label: t('nav.blockchain', 'AeroLedger Audit'), icon: '⛓️' }
  ];

  const filteredPages = activeCategoryFilter === 'all'
    ? pages
    : pages.filter(p => p.category === activeCategoryFilter);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshTelemetry();
    if (soundEnabled) {
      playAtmosphereTone(selectedStation.aqi, 600);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playAtmosphereTone(selectedStation.aqi, 800);
    }
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border-color)',
      padding: '8px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Top Row: Brand Identity + Flow Guide / Quick Jump + Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Brand Identity */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => { setCurrentPage('overview'); setMobileMenuOpen(false); }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              borderRadius: 'var(--radius-card, 10px)',
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)',
              letterSpacing: '-0.02em'
            }}>
              AE
            </div>
            <div>
              <div style={{
                fontSize: '17px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-main)',
                fontFamily: 'var(--font-heading)'
              }}>
                {t('common.appName', 'AERIS DELHI')}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('common.appTagline', 'Coupled Weather-Chemistry 72h Engine')}
              </div>
            </div>
          </div>

          {/* Center Navigation Shortcuts: Flow Guide & Quick Jump (Ctrl+K) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Interactive Flow Guide Button */}
            <button
              onClick={onOpenFlowGuide}
              className="btn btn-sm"
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                fontWeight: 800,
                borderRadius: '20px',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={isHindi ? 'वेबसाइट का संपूर्ण नेविगेशन रोडमैप और सभी वैज्ञानिक विषयों का विवरण' : 'Open complete step-by-step navigation roadmap and topic guide'}
            >
              <span>🧭</span>
              <span>{isHindi ? 'फ्लो गाइड व रोडमैप' : 'Flow Guide & Sitemap'}</span>
            </button>

            {/* Quick Search Palette (Ctrl+K) */}
            <button
              onClick={onOpenQuickJump}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11.5px',
                padding: '5px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-panel-subtle)',
                color: 'var(--text-main)',
                borderColor: 'var(--border-color)'
              }}
              title={isHindi ? 'त्वरित खोज (Ctrl+K)' : 'Quick search topic or jump to feature (Ctrl+K)'}
            >
              <span>🔍</span>
              <span>{isHindi ? 'खोजें...' : 'Quick Jump...'}</span>
              <span style={{
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}>
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Global Utility Controls: Live status, Language, Theme, Sound, Add Station */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Live Status Indicator & Refresh */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-panel-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <span
                onClick={() => setLiveSimulation(prev => !prev)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: liveSimulation ? '#10b981' : '#64748b',
                  display: 'inline-block',
                  cursor: 'pointer',
                  animation: liveSimulation ? 'pulseDot 1.6s infinite' : 'none'
                }}
                title={liveSimulation ? 'Telemetry Simulation Live (Click to pause)' : 'Simulation Paused (Click to resume)'}
              />
              <span
                onClick={() => setLiveSimulation(prev => !prev)}
                style={{ cursor: 'pointer', color: liveSimulation ? '#059669' : 'var(--text-muted)' }}
              >
                {liveSimulation ? t('common.live', 'LIVE') : t('common.paused', 'PAUSED')}
              </span>
              <button
                onClick={handleManualRefresh}
                title="Force sync latest telemetry"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: '11px',
                  transform: isRefreshing ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.4s ease'
                }}
              >
                🔄
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            {/* Bilingual Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderColor: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-panel-subtle)',
                color: 'var(--text-main)'
              }}
              title={language === 'en' ? 'Switch website to Hindi (हिन्दी)' : 'Switch website to English'}
            >
              <span>🌐</span>
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Compare Modal Button */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderColor: comparisonList.length > 0 ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: comparisonList.length > 0 ? 'var(--bg-panel-subtle)' : 'transparent',
                fontWeight: comparisonList.length > 0 ? 700 : 500
              }}
            >
              ⚖️ {t('common.compare', 'Compare')} ({comparisonList.length})
            </button>

            {/* Sound Synthesizer Toggle */}
            <button
              onClick={handleToggleSound}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title={soundEnabled ? 'Atmospheric audio sonification active (Click to mute)' : 'Muted (Click to enable audio sonification)'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title={`Switch to ${theme === 'light' ? 'Dark Carbon' : 'Warm Slate'} Mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Add Station Button */}
            <button
              onClick={onOpenAddModal}
              className="btn btn-sm"
              style={{ fontSize: '11px', padding: '5px 10px', borderRadius: 'var(--radius-sm)' }}
            >
              {t('common.addStation', '+ Add Station')}
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="btn btn-outline btn-sm mobile-only"
              style={{ display: 'none', padding: '4px 8px', fontSize: '13px' }}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Bottom Row: Thematic Category Pills & Active Page Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '6px',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginRight: '4px' }}>
              {isHindi ? 'श्रेणी:' : 'HUB:'}
            </span>
            {categories.map(cat => {
              const isSelected = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-panel-subtle)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>

          {/* Current Page Navigation Tabs */}
          <nav
            className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            {filteredPages.map((p) => {
              const isActive = currentPage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentPage(p.id);
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '11.5px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
