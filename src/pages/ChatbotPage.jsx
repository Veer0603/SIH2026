import React from 'react';
import AIAQIChatbot from '../components/AIAQIChatbot';
import { useApp } from '../context/useApp';

export default function ChatbotPage({ onNavigate }) {
  const { selectedStation, language } = useApp();

  const isHindi = language === 'hi';

  const faqs = [
    {
      q: isHindi ? 'क्या N95 मास्क को धोकर दोबारा इस्तेमाल किया जा सकता है?' : 'Can N95 masks be washed and reused?',
      a: isHindi 
        ? 'नहीं! N95 मास्क को पानी या साबुन से धोने पर उसका इलेक्ट्रोस्टैटिक चार्ज नष्ट हो जाता है, जिससे उसकी PM2.5 छानने की क्षमता समाप्त हो जाती है। इसे हवादार जगह पर सुखाकर 4-5 बार इस्तेमाल करें।'
        : 'Never wash an N95 with water, alcohol, or soap! Washing destroys the electrostatic charge in the meltblown microfibers, dropping filtration efficiency drastically. Rotate 3-4 masks across days.'
    },
    {
      q: isHindi ? 'सर्दियों में दिल्ली में प्रदूषण रात और सुबह सबसे ज्यादा क्यों होता है?' : 'Why is Delhi pollution highest at night and early morning?',
      a: isHindi
        ? 'रात की ठंड से जमीन तेजी से ठंडी होती है, जिससे "थर्मल इनवर्जन" बनता है। गर्म हवा की ऊपरी परत एक ढक्कन की तरह धुआं और धूल जमीन से 300 मीटर के भीतर रोक लेती है।'
        : 'Nocturnal radiative ground cooling induces a thermal inversion layer, compressing the Planetary Boundary Layer (PBL) down to 250–350m, trapping smoke and diesel exhaust right at ground level.'
    },
    {
      q: isHindi ? 'क्या घर में पौधे (Snake Plant) लगाने से PM2.5 खत्म होता है?' : 'Do indoor plants actually remove PM2.5 soot?',
      a: isHindi
        ? 'यह एक आम मिथक है। पौधे कुछ VOCs सोख सकते हैं, लेकिन वे बंद कमरे में PM2.5 कणों को साफ करने के लिए पर्याप्त वायु परिसंचरण नहीं कर सकते। इसके लिए केवल True HEPA H13 फिल्टर ही कारगर है।'
        : 'A widespread myth. While plants absorb trace volatile organic chemicals (VOCs), their aerodynamic surface area is insufficient to scrub microscopic PM2.5. Mechanical HEPA H13 filtration is required.'
    },
    {
      q: isHindi ? 'ग्रैप (GRAP) स्टेज 3 लागू होने पर क्या पाबंदियां होती हैं?' : 'What restrictions apply under GRAP Stage III?',
      a: isHindi
        ? 'गैर-आवश्यक निर्माण कार्य बंद, दिल्ली-एनसीआर में BS-III पेट्रोल और BS-IV डीजल कारों पर पूर्ण प्रतिबंध, और प्राथमिक स्कूलों में ऑनलाइन कक्षाएं लागू की जाती हैं।'
        : 'Total ban on non-essential construction, total ban on BS-III petrol and BS-IV diesel 4-wheelers across Delhi NCR, and hybrid/online schooling for primary grades.'
    }
  ];

  return (
    <div>
      {/* Top Banner */}
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '6px' }}>
              {isHindi ? 'एआई पर्यावरण व स्वास्थ्य चैटबॉट' : 'Interactive Environmental Intelligence'}
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
              {isHindi ? 'AERIS दिल्ली एआई वायु परामर्शदाता' : 'AERIS Delhi Air Quality AI Assistant'}
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              {isHindi
                ? 'दिल्ली प्रदूषण, स्वास्थ्य सावधानियों, N95 मास्क, पराली धुएं और ग्रैप (GRAP) नियमों पर अपने किसी भी प्रश्न का उत्तर तुरंत पाएं।'
                : 'Ask real-time clinical, meteorological, and regulatory questions regarding Delhi smog, N95 masks, crop residue smoke, and GRAP protocols.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {onNavigate && (
              <button
                onClick={() => onNavigate('overview')}
                className="btn btn-outline btn-sm"
                style={{ fontWeight: 700 }}
              >
                ← {isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('map')}
                className="btn btn-outline btn-sm"
              >
                🗺️ {isHindi ? 'नक्शा देखें' : 'View Map'}
              </button>
            )}
            <span className="tag" style={{
              backgroundColor: selectedStation.aqi > 300 ? '#7a1d1d' : selectedStation.aqi > 200 ? '#7c3514' : '#1e3a8a',
              color: '#ffffff',
              fontWeight: 800
            }}>
              {selectedStation.shortName} • AQI {selectedStation.aqi}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chatbot Left vs Live Telemetry & Citizen Knowledge Hub Right */}
      <div className="grid-2" style={{ gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Full-Featured AI Chatbot */}
        <div>
          <AIAQIChatbot isFloating={false} onNavigate={onNavigate} />
        </div>

        {/* Right Column: Citizen Quick Knowledge & Live Advisory Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Station Sensor Snapshot */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>{isHindi ? '📡 लाइव टेलीमेट्री संदर्भ' : '📡 LIVE TELEMETRY CONTEXT'}</span>
              </div>
              <span className="live-pulse-dot" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-panel-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AQI ({selectedStation.category})</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: selectedStation.aqi > 300 ? '#dc2626' : '#ea580c' }}>
                  {selectedStation.aqi}
                </div>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-panel-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PM2.5 / PM10</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>
                  {selectedStation.pm25} <span style={{ fontSize: '11px', fontWeight: 400 }}>/ {selectedStation.pm10}</span>
                </div>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-panel-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHindi ? 'इनवर्जन परत (PBL)' : 'Inversion Layer (PBL)'}</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>
                  {selectedStation.pblHeight} m
                </div>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--bg-panel-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isHindi ? 'हवा की गति' : 'Wind Telemetry'}</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>
                  {selectedStation.windSpeed} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Citizen FAQs & Science Notes */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>{isHindi ? '💡 दिल्लीवासियों के प्रमुख प्रश्न' : '💡 TOP CITIZEN SMOG FAQS'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-panel-subtle)'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '4px', color: 'var(--accent-primary)' }}>
                    ❓ {faq.q}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Navigators */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>{isHindi ? '⚡ उपयोगी AERIS टूल्स' : '⚡ AERIS SCIENTIFIC TOOLS'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { page: 'map', label: isHindi ? '🗺️ मैपबॉक्स ग्रिड' : '🗺️ Mapbox Grid', desc: isHindi ? 'हॉटस्पॉट व पराली धुआं' : 'Hotspots & stubble' },
                { page: 'route-planner', label: isHindi ? '🧭 यात्रा प्लानर' : '🧭 Commute Planner', desc: isHindi ? 'मेट्रो बनाम कार डोज़' : 'Metro vs cab dose' },
                { page: 'inversion', label: isHindi ? '🧪 इनवर्जन सिम्युलेटर' : '🧪 Inversion Sandbox', desc: isHindi ? 'PBL भौतिकी' : 'PBL physics model' },
                { page: 'forecast', label: isHindi ? '⏳ 72h पूर्वानुमान' : '⏳ 72h Forecast', desc: isHindi ? 'ग्रैप नीति अनुपालन' : 'GRAP policy timeline' }
              ].map(tl => (
                <div
                  key={tl.page}
                  onClick={() => onNavigate && onNavigate(tl.page)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-page)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '12.5px' }}>{tl.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tl.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
