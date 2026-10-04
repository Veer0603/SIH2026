import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/useApp';

export default function QuickJumpModal({ isOpen, onClose, onNavigate }) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Searchable topics and feature links
  const searchableItems = [
    {
      pageId: 'overview',
      category: isHindi ? 'लाइव व मैप' : 'Live & Geo',
      title: isHindi ? 'लाइव CPCB AQI व दिल्ली औसत' : 'Overview & Live CPCB AQI',
      icon: '⚡',
      keywords: ['live', 'aqi', 'cpcb', 'overview', 'delhi', 'hotspot', 'cleanest', 'realtime', 'telemetry', 'average', 'লাইভ']
    },
    {
      pageId: 'overview',
      category: isHindi ? 'नागरिक सुरक्षा' : 'Citizen Safety',
      title: isHindi ? 'आपातकालीन आवाज़ चेतावनी व दिशा-निर्देश' : 'Voice Safety Alert & Emergency Directive',
      icon: '📢',
      keywords: ['voice', 'sound', 'audio', 'alert', 'speech', 'directive', 'ध्वनि', 'आवाज']
    },
    {
      pageId: 'overview',
      category: isHindi ? 'स्वास्थ्य' : 'Health',
      title: isHindi ? 'सिगरेट-तुल्य डोज़ व सुरक्षित समय' : 'Cigarette Equivalence & Safe Outdoor Window',
      icon: '🚬',
      keywords: ['cigarette', 'smoke', 'dose', 'safe', 'window', 'outdoor', 'diurnal', 'exercise', 'jogging', 'सिगरेट', 'समय']
    },
    {
      pageId: 'overview',
      category: isHindi ? 'ऑडिट' : 'Audit',
      title: isHindi ? 'आधिकारिक पर्यावरण ऑडिट रिपोर्ट (Print Certificate)' : 'Official Environmental Audit Certificate Modal',
      icon: '📜',
      keywords: ['audit', 'certificate', 'report', 'official', 'print', 'pdf', 'legal', 'cpcb', 'प्रमाणपत्र', 'ऑडिट']
    },
    {
      pageId: 'map',
      category: isHindi ? 'लाइव व मैप' : 'Live & Geo',
      title: isHindi ? 'मैपबॉक्स ग्रिड व पराली धुआं वेक्टर्स' : 'Mapbox Grid & Stubble Wind Plumes',
      icon: '🗺️',
      keywords: ['map', 'mapbox', 'grid', 'stations', 'wind', 'plume', 'stubble', 'vector', 'satellite', 'नक्शा', 'मैप']
    },
    {
      pageId: 'ai-advisor',
      category: isHindi ? 'स्वास्थ्य व व्यक्तिगत' : 'Personal Health',
      title: isHindi ? 'AeroAI स्वास्थ्य सलाहकार व बायो-डोसिमेट्री' : 'AeroAI Health Advisor & Vulnerability Profiles',
      icon: '🤖',
      keywords: ['advisor', 'health', 'bio', 'dosimetry', 'profile', 'asthma', 'child', 'elderly', 'athlete', 'pregnant', 'स्वास्थ्य', 'सलाहकार']
    },
    {
      pageId: 'ai-advisor',
      category: isHindi ? 'कमरे की सुरक्षा' : 'Indoor Clean Air',
      title: isHindi ? 'कमरे का HEPA एयर प्यूरीफायर CADR कैलकुलेटर' : 'Room HEPA Air Purifier CADR Sizing Calculator',
      icon: '💨',
      keywords: ['purifier', 'cadr', 'hepa', 'room', 'cleaner', 'filter', 'cfm', 'air changes', 'प्यूरीफायर', 'कमरा']
    },
    {
      pageId: 'route-planner',
      category: isHindi ? 'यात्रा योजना' : 'Commute Transit',
      title: isHindi ? 'कम्यूट एक्सपोज़र प्लानर: मेट्रो बनाम कैब बनाम बाइक' : 'Commute Exposure Planner (Metro vs Cab vs Bike)',
      icon: '🧭',
      keywords: ['route', 'commute', 'planner', 'metro', 'cab', 'car', 'bike', 'travel', 'transit', 'exposure', 'dose', 'यात्रा', 'मेट्रो']
    },
    {
      pageId: 'layman',
      category: isHindi ? 'नागरिक गाइड' : 'Citizen Education',
      title: isHindi ? 'प्रदूषण की आसान गाइड व N95 मास्क विज़ार्ड' : 'Air Simplified Guide & Mask Filtration Wizard',
      icon: '📖',
      keywords: ['layman', 'guide', 'simplified', 'mask', 'n95', 'surgical', 'cloth', 'symptoms', 'myth', 'color', 'मास्क', 'गाइड']
    },
    {
      pageId: 'chatbot',
      category: isHindi ? 'एआई सहायक' : 'AI Assistant',
      title: isHindi ? 'AERIS दिल्ली एआई चैटबॉट (द्विभाषी संवाद)' : 'AERIS Delhi Air Quality AI Chatbot',
      icon: '💬',
      keywords: ['chat', 'chatbot', 'ai', 'assistant', 'ask', 'question', 'faqs', 'help', 'चैटबॉट', 'प्रश्न']
    },
    {
      pageId: 'forecast',
      category: isHindi ? 'विज्ञान व नीतियां' : 'Science & Policy',
      title: isHindi ? '72-घंटे पूर्वानुमान व ऑड-ईवन/पराली नीति सिमुलेटर' : '72h WRF-Chem Forecast & Policy Simulator',
      icon: '⏳',
      keywords: ['forecast', '72h', 'wrf', 'chem', 'policy', 'oddeven', 'stubble', 'ban', 'rain', 'simulation', 'पूर्वानुमान', 'नीति']
    },
    {
      pageId: 'inversion',
      category: isHindi ? 'वायुमंडलीय भौतिकी' : 'Atmospheric Physics',
      title: isHindi ? '2D वायुमंडलीय इनवर्जन व स्मॉग ट्रैपिंग सिमुलेटर' : '2D Atmospheric Inversion & Nocturnal Cooling Sandbox',
      icon: '🧪',
      keywords: ['inversion', 'physics', 'pbl', 'boundary layer', 'cooling', 'richardson', 'smog gun', 'feedback', 'भौतिकी', 'इनवर्जन']
    },
    {
      pageId: 'ai-lab',
      category: isHindi ? 'AI न्यूरल लैब' : 'Neural Labs',
      title: isHindi ? 'AI/ML न्यूरल स्टूडियो: IIT कानपुर मॉडल व PINN' : 'AI/ML Neural Studio (Receptor Model & PINN)',
      icon: '🧠',
      keywords: ['lab', 'neural', 'pinn', 'receptor', 'chemical mass balance', 'anomaly', 'sensor', 'counterfactual', 'न्यूरल', 'मॉडल']
    },
    {
      pageId: 'blockchain',
      category: isHindi ? 'ब्लॉकचेन ऑडिट' : 'Blockchain Trust',
      title: isHindi ? 'AeroLedger क्रिप्टोग्राफिक ब्लॉकचेन व एंटी-टैम्पर टेस्ट' : 'AeroLedger Blockchain & Tamper-Proof Merkle Tree',
      icon: '⛓️',
      keywords: ['blockchain', 'ledger', 'merkle', 'sha256', 'hash', 'tamper', 'fraud', 'crypto', 'proof', 'ब्लॉकचेन', 'लेजर']
    }
  ];

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        setSelectedIndex(0);
        setQuery('');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const filteredItems = searchableItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item) => {
    onNavigate(item.pageId);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderRadius: 'var(--radius-panel, 14px)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '640px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder={isHindi ? 'किसी भी विषय, टूल या फीचर को खोजें (जैसे N95, प्यूरीफायर, मेट्रो, इनवर्जन)...' : 'Search any topic, tool, or feature (e.g., N95, Purifier, Metro, Inversion)...'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500
            }}
          />
          <span style={{
            fontSize: '11px',
            backgroundColor: 'var(--bg-panel-subtle)',
            border: '1px solid var(--border-color)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
              {isHindi ? 'कोई परिणाम नहीं मिला। कृपया अन्य शब्द आज़माएं।' : 'No matching features or topics found. Try another term.'}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    transition: 'background-color 0.1s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11.5px', opacity: 0.85 }}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    opacity: 0.8,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {isSelected ? 'Enter ↵' : '➔'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-panel-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: 'var(--text-muted)'
        }}>
          <div>
            ↑↓ {isHindi ? 'नेविगेट करें' : 'Navigate'} • ↵ {isHindi ? 'चुनें' : 'Select'}
          </div>
          <div>
            {filteredItems.length} {isHindi ? 'उपलब्ध परिणाम' : 'results'}
          </div>
        </div>
      </div>
    </div>
  );
}
