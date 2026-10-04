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
    { id: 'all', label: isHindi ? 'सभी मॉड्यूल' : 'All Modules' },
    { id: 'live', label: isHindi ? 'लाइव व मैप' : 'Live & Geo' },
    { id: 'citizen', label: isHindi ? 'नागरिक स्वास्थ्य' : 'Citizen Health' },
    { id: 'science', label: isHindi ? 'विज्ञान व लैब' : 'Science Labs' },
    { id: 'trust', label: isHindi ? 'ऑडिट व ब्लॉकचेन' : 'Trust & Audit' }
  ];

  const pages = [
    // Live & Geo
    { id: 'overview', category: 'live', label: t('nav.overview', 'Overview & Live AQI') },
    { id: 'map', category: 'live', label: t('nav.map', 'Mapbox Grid & Matrix') },

    // Citizen Health
    { id: 'ai-advisor', category: 'citizen', label: t('nav.aiAdvisor', 'AeroAI Health Advisor') },
    { id: 'route-planner', category: 'citizen', label: t('nav.routePlanner', 'Commute Exposure Planner') },
    { id: 'layman', category: 'citizen', label: t('nav.layman', 'Air Simplified (Bilingual)') },
    { id: 'chatbot', category: 'citizen', label: t('nav.chatbot', 'AI AQI Chatbot') },

    // Science Labs
    { id: 'forecast', category: 'science', label: t('nav.forecast', '72h Forecast & Policy') },
    { id: 'inversion', category: 'science', label: t('nav.inversion', 'Inversion Physics') },
    { id: 'ai-lab', category: 'science', label: t('nav.aiLab', 'AI/ML Neural Studio') },

    // Trust & Audit
    { id: 'blockchain', category: 'trust', label: t('nav.blockchain', 'AeroLedger Audit') }
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
      backgroundColor: 'var(--bg-glass)',
      borderBottom: '1px solid var(--border-color)',
      padding: '10px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-xs)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => { setCurrentPage('overview'); setMobileMenuOpen(false); }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: 'var(--radius-btn)',
              letterSpacing: '-0.02em',
              flexShrink: 0
            }}>
              AE
            </div>
            <div>
              <div style={{
                fontSize: '17px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--text-main)',
                fontFamily: 'var(--font-heading)'
              }}>
                {t('common.appName', 'AERIS DELHI')}
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('common.appTagline', 'Coupled Weather-Chemistry 72h Engine')}
              </div>
            </div>
          </div>

          {/* Center Navigation Shortcuts: Flow Guide & Quick Jump (Ctrl+K) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Interactive Flow Guide Button */}
            <button
              onClick={onOpenFlowGuide}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                fontWeight: 600,
                borderRadius: 'var(--radius-btn)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={isHindi ? 'वेबसाइट का संपूर्ण नेविगेशन रोडमैप और सभी वैज्ञानिक विषयों का विवरण' : 'Open complete step-by-step navigation roadmap and topic guide'}
            >
              <span>{isHindi ? 'फ्लो गाइड' : 'Flow Guide'}</span>
            </button>

            {/* Quick Search Palette (Ctrl+K) */}
            <button
              onClick={onOpenQuickJump}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-btn)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-panel-subtle)',
                color: 'var(--text-main)'
              }}
              title={isHindi ? 'त्वरित खोज (Ctrl+K)' : 'Quick search topic or jump to feature (Ctrl+K)'}
            >
              <span>{isHindi ? 'खोजें...' : 'Search...'}</span>
              <span style={{
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}>
                ⌘K
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
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <span
                onClick={() => setLiveSimulation(prev => !prev)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: liveSimulation ? '#10b981' : '#816c61',
                  display: 'inline-block',
                  cursor: 'pointer',
                  boxShadow: liveSimulation ? '0 0 6px #10b981' : 'none',
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
                  color: 'var(--text-muted)',
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
                fontSize: '11.5px',
                padding: '5px 10px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: 'var(--radius-btn)',
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-panel-subtle)',
                color: 'var(--text-main)'
              }}
              title={language === 'en' ? 'Switch website to Hindi (हिन्दी)' : 'Switch website to English'}
            >
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Compare Modal Button */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11.5px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-btn)',
                borderColor: comparisonList.length > 0 ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: comparisonList.length > 0 ? 'var(--color-primary-soft)' : 'transparent',
                color: comparisonList.length > 0 ? 'var(--accent-primary)' : 'var(--text-main)',
                fontWeight: comparisonList.length > 0 ? 600 : 500
              }}
            >
              {t('common.compare', 'Compare')} ({comparisonList.length})
            </button>

            {/* Sound Synthesizer Toggle */}
            <button
              onClick={handleToggleSound}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11.5px', padding: '5px 8px', borderRadius: 'var(--radius-btn)' }}
              title={soundEnabled ? 'Atmospheric audio sonification active (Click to mute)' : 'Muted (Click to enable audio sonification)'}
            >
              {soundEnabled ? 'Audio On' : 'Mute'}
            </button>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11.5px', padding: '5px 9px', borderRadius: 'var(--radius-btn)' }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>

            {/* Add Station Button */}
            <button
              onClick={onOpenAddModal}
              className="btn btn-sm"
              style={{ fontSize: '11.5px', padding: '5px 10px', borderRadius: 'var(--radius-btn)', fontWeight: 600 }}
            >
              {t('common.addStation', '+ Station')}
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="btn btn-outline btn-sm mobile-only"
              style={{ display: 'none', padding: '5px 9px', fontSize: '13px' }}
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
          paddingTop: '8px',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Category Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em', marginRight: '4px' }}>
              {isHindi ? 'श्रेणी:' : 'HUB:'}
            </span>
            {categories.map(cat => {
              const isSelected = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  style={{
                    fontSize: '11.5px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-btn)',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'var(--color-surface-2)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 600 : 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Current Page Navigation Tabs */}
          <nav
            className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              display: 'flex',
              gap: '6px',
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
                    backgroundColor: isActive ? 'var(--color-primary-soft)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-btn)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'none',
                    transition: 'all 0.18s ease'
                  }}
                >
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
