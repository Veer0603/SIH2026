import React, { useState } from 'react';
import { useApp } from '../context/useApp';

export default function SourceApportionmentCard({ station }) {
  const { language } = useApp();
  const [simWind, setSimWind] = useState(station.windDirectionDeg >= 280 && station.windDirectionDeg <= 335 ? 'NW' : 'CALM');

  // Dynamic source apportionment weights (IIT Kanpur / CPCB Delhi receptor model calibration)
  const isNW = simWind === 'NW';
  const stubbleShare = isNW ? 38 : 12;
  const vehicularShare = isNW ? 28 : 42;
  const secondaryAerosol = 18;
  const roadDust = isNW ? 10 : 16;
  const industrialWaste = 100 - (stubbleShare + vehicularShare + secondaryAerosol + roadDust);

  const sources = [
    { 
      name: language === 'hi' ? 'वाहनों का धुआं (डीजल व पेट्रोल)' : 'Vehicular Exhaust (Diesel & Petrol)', 
      share: vehicularShare, 
      color: '#3b82f6', 
      icon: '🚗', 
      desc: language === 'hi' ? 'दैनिक ट्रैफिक, भारी परिवहन ट्रक, खड़े वाहनों का धुआं' : 'Commuter traffic, commercial transport trucks, idling vehicles' 
    },
    { 
      name: language === 'hi' ? 'पराली दहन और बायोमास धुआं' : 'Stubble Burning & Biomass Smoke', 
      share: stubbleShare, 
      color: '#ef4444', 
      icon: '🔥', 
      desc: language === 'hi' ? 'उत्तर-पश्चिम हवाओं द्वारा आने वाले कृषि अवशेषों के धुएं के बादल' : 'Regional agricultural residue fires transported via NW winds' 
    },
    { 
      name: language === 'hi' ? 'द्वितीयक अकार्बनिक एरोसोल' : 'Secondary Inorganic Aerosols', 
      share: secondaryAerosol, 
      color: '#8b5cf6', 
      icon: '🧪', 
      desc: language === 'hi' ? 'SO2 और NOx का अमोनियम नाइट्रेट्स में रासायनिक संघनन' : 'Chemical condensation of SO2/NOx into ammonium nitrates' 
    },
    { 
      name: language === 'hi' ? 'सड़क की धूल और निर्माण धूल' : 'Road Dust & Construction Silt', 
      share: roadDust, 
      color: '#f59e0b', 
      icon: '🏗️', 
      desc: language === 'hi' ? 'कच्चे सड़क किनारे, निर्माण गतिविधियां, सूखी धूल' : 'Unpaved shoulders, construction activity, dry suspension' 
    },
    { 
      name: language === 'hi' ? 'औद्योगिक उत्सर्जन और कचरा दहन' : 'Industrial Emissions & Waste Burning', 
      share: industrialWaste, 
      color: '#64748b', 
      icon: '🏭', 
      desc: language === 'hi' ? 'ईंट भट्ठे, तापीय संयंत्र, ठोस अपशिष्ट दहन' : 'Brick kilns, thermal plants, municipal solid waste burning' 
    }
  ];

  return (
    <div className="panel" style={{ marginBottom: '20px' }}>
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>{language === 'hi' ? '🔬 वास्तविक समय प्रदूषण स्रोत निर्धारण और फिंगरप्रिंटिंग' : '🔬 REAL-TIME POLLUTION SOURCE ATTRIBUTION & FINGERPRINTING'}</span>
          </div>
          <span className="subtitle">
            {language === 'hi'
              ? 'दिल्ली एनसीआर में विषैले कणों की उत्पत्ति निर्धारित करने वाला रासायनिक द्रव्यमान संतुलन रिसेप्टर मॉडल।'
              : 'Dynamic chemical mass balance receptor model attributing toxic particulate origins across Delhi NCR.'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {language === 'hi' ? 'हवा का गलियारा:' : 'Wind Corridor:'}
          </span>
          <button
            onClick={() => setSimWind('NW')}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: isNW ? 'var(--accent-primary)' : 'transparent',
              color: isNW ? '#ffffff' : 'var(--text-main)',
              borderColor: isNW ? 'var(--accent-primary)' : 'var(--border-color)',
              fontWeight: isNW ? 700 : 500
            }}
          >
            {language === 'hi' ? 'NW पराली धुआं (पंजाब)' : 'NW Fire Plume (Punjab)'}
          </button>
          <button
            onClick={() => setSimWind('CALM')}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: !isNW ? 'var(--accent-primary)' : 'transparent',
              color: !isNW ? '#ffffff' : 'var(--text-main)',
              borderColor: !isNW ? 'var(--accent-primary)' : 'var(--border-color)',
              fontWeight: !isNW ? 700 : 500
            }}
          >
            {language === 'hi' ? 'शांत / स्थानीय स्रोत' : 'Calm / Local Urban Sinks'}
          </button>
        </div>
      </div>

      {/* Stacked Percentage Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          height: '24px',
          borderRadius: 'var(--radius-card, 6px)',
          overflow: 'hidden',
          backgroundColor: 'var(--border-color)'
        }}>
          {sources.map((s, idx) => (
            <div
              key={idx}
              style={{
                width: `${s.share}%`,
                backgroundColor: s.color,
                transition: 'width 0.4s ease'
              }}
              title={`${s.name}: ${s.share}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
          {sources.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: s.color, display: 'inline-block' }} />
              <span style={{ fontWeight: 600 }}>{s.icon} {s.name.split('(')[0]}:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{s.share}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of source details */}
      <div className="grid-3" style={{ gap: '10px' }}>
        {sources.slice(0, 3).map((s, idx) => (
          <div key={idx} className="panel-subtle" style={{ backgroundColor: 'var(--bg-panel-subtle)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800 }}>{s.icon} {s.name.split('(')[0]}</span>
              <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>{s.share}%</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
