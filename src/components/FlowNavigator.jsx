import React from 'react';
import { useApp } from '../context/useApp';

export default function FlowNavigator({ currentPage, onNavigate, onOpenFlowGuide }) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  // Dynamic next step recommendations based on the user's active page
  const pageFlowMap = {
    overview: {
      category: isHindi ? 'चरण 1/4: लाइव स्थिति व जागरूकता' : 'Phase 1/4: Real-Time Situational Awareness',
      nextPage: 'ai-advisor',
      nextIcon: '🤖',
      nextTitle: isHindi ? 'AeroAI व्यक्तिगत स्वास्थ्य सलाह व बायो-डोसिमेट्री' : 'AeroAI Personal Health Advisor & Bio-Dosimetry',
      nextReason: isHindi
        ? 'आपने लाइव AQI देख लिया है। अब अपनी आयु और दमा/बच्चों की स्थिति दर्ज करके फेफड़ों का सिगरेट-तुल्य डोज़ व HEPA प्यूरीफायर CADR जानें।'
        : 'Now that you know current air toxicity, compute your personal inhaled dose, cigarette equivalence, and room HEPA purifier requirements.',
      alternatives: [
        { id: 'map', icon: '🗺️', label: isHindi ? 'मैपबॉक्स ग्रिड देखें' : 'View Map Grid' },
        { id: 'route-planner', icon: '🧭', label: isHindi ? 'यात्रा प्लान करें' : 'Plan Commute' }
      ]
    },
    'ai-advisor': {
      category: isHindi ? 'चरण 2/4: व्यक्तिगत बायो-सुरक्षा' : 'Phase 2/4: Personal Bio-Protection',
      nextPage: 'route-planner',
      nextIcon: '🧭',
      nextTitle: isHindi ? 'कम्यूट एक्सपोज़र प्लानर (सुरक्षित यात्रा मार्ग)' : 'Commute Exposure Planner (Safe Transit Route)',
      nextReason: isHindi
        ? 'घर की सुरक्षा तय हो गई! अब ऑफिस या बाहर जाते समय मेट्रो, कैब और बाइक के बीच कम से कम जहरीला धुआं सूंघने वाला मार्ग चुनें।'
        : 'Your indoor environment is sized! Now plan your outdoor transit to compare Metro vs Cab vs Bike to minimize rush-hour exposure.',
      alternatives: [
        { id: 'layman', icon: '📖', label: isHindi ? 'मास्क विज़ार्ड देखें' : 'Check Mask Wizard' },
        { id: 'chatbot', icon: '💬', label: isHindi ? 'एआई चैटबॉट से पूछें' : 'Ask AI Chatbot' }
      ]
    },
    'route-planner': {
      category: isHindi ? 'चरण 3/4: यात्रा व आवागमन सुरक्षा' : 'Phase 3/4: Transit & Commute Safety',
      nextPage: 'layman',
      nextIcon: '📖',
      nextTitle: isHindi ? 'प्रदूषण की आसान गाइड व N95 मास्क विज़ार्ड' : 'Air Simplified Guide & Mask Filtration Wizard',
      nextReason: isHindi
        ? 'सड़क पर निकलने से पहले जांचें कि आपका मास्क 95% सूक्ष्म कण रोक सकता है या नहीं और दिल्ली प्रदूषण के आम मिथकों से बचें।'
        : 'Before stepping out, ensure your mask provides genuine certified alveolar protection and understand the color safety index.',
      alternatives: [
        { id: 'chatbot', icon: '💬', label: isHindi ? 'एआई से सवाल पूछें' : 'Ask AI Chatbot' },
        { id: 'forecast', icon: '⏳', label: isHindi ? '72h पूर्वानुमान देखें' : 'View 72h Forecast' }
      ]
    },
    layman: {
      category: isHindi ? 'चरण 4/4: नागरिक शिक्षा व निदान' : 'Phase 4/4: Citizen Education & Diagnostics',
      nextPage: 'chatbot',
      nextIcon: '💬',
      nextTitle: isHindi ? 'AERIS दिल्ली एआई वायु परामर्शदाता' : 'AERIS Delhi Air Quality AI Assistant',
      nextReason: isHindi
        ? 'किसी भी लक्षण, दवा, या ग्रैप (GRAP) नियमों पर अपने किसी भी व्यक्तिगत प्रश्न का उत्तर तुरंत प्राकृतिक भाषा में प्राप्त करें।'
        : 'Ask any specific medical, lifestyle, or GRAP regulatory questions to get immediate referenced answers in Hindi or English.',
      alternatives: [
        { id: 'overview', icon: '⚡', label: isHindi ? 'डैशबोर्ड पर लौटें' : 'Back to Dashboard' },
        { id: 'forecast', icon: '⏳', label: isHindi ? '72h पूर्वानुमान देखें' : 'Check 72h Forecast' }
      ]
    },
    chatbot: {
      category: isHindi ? 'नागरिक संवाद व परामर्श' : 'Citizen Dialogue & Advisory',
      nextPage: 'forecast',
      nextIcon: '⏳',
      nextTitle: isHindi ? '72-घंटे WRF-Chem पूर्वानुमान व नीतियां' : '72-Hour Coupled WRF-Chem Forecast & Policy',
      nextReason: isHindi
        ? 'देखें कि अगले 3 दिनों में हवा कैसी रहेगी और ऑड-ईवन व पराली रोकथाम से प्रदूषण कैसे कम हो सकता है।'
        : 'Look ahead into the next 3 days of air quality and simulate policy interventions like Odd-Even and stubble crackdowns.',
      alternatives: [
        { id: 'overview', icon: '⚡', label: isHindi ? 'लाइव AQI देखें' : 'Live AQI Overview' },
        { id: 'map', icon: '🗺️', label: isHindi ? 'मैपबॉक्स ग्रिड खोलें' : 'Open Mapbox Grid' }
      ]
    },
    map: {
      category: isHindi ? 'भौगोलिक ग्रिड व सेंसर मैट्रिक्स' : 'Geographic Grid & Sensor Matrix',
      nextPage: 'forecast',
      nextIcon: '⏳',
      nextTitle: isHindi ? '72-घंटे WRF-Chem पूर्वानुमान व प्रक्षेपवक्र' : '72-Hour WRF-Chem Forecast & Trajectory Scrubber',
      nextReason: isHindi
        ? 'आपने वर्तमान स्टेशनों और हवा का रुख देख लिया। अब 72 घंटे आगे की प्रति घंटा स्थिति और नीतियों का सिमुलेशन करें।'
        : 'Now that you have mapped regional hotspots and stubble wind plumes, inspect the forward 72-hour forecast trajectory.',
      alternatives: [
        { id: 'inversion', icon: '🧪', label: isHindi ? 'इनवर्जन भौतिकी देखें' : 'Inversion Physics' },
        { id: 'overview', icon: '⚡', label: isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Overview' }
      ]
    },
    forecast: {
      category: isHindi ? 'विज्ञान व नीति विश्लेषण' : 'Science & Policy Modeling',
      nextPage: 'inversion',
      nextIcon: '🧪',
      nextTitle: isHindi ? '2D वायुमंडलीय इनवर्जन व स्मॉग ट्रैपिंग भौतिकी' : '2D Atmospheric Inversion & Nocturnal Trapping Physics',
      nextReason: isHindi
        ? 'पूर्वानुमान के पीछे की भौतिकी समझें: कैसे रात की ठंड से धुआं 300m के नीचे फंसता है और धूप रुकने से प्रदूषण गहराता है।'
        : 'Deepen your physical understanding: simulate nocturnal cooling, boundary layer collapse, and anti-smog water cannons.',
      alternatives: [
        { id: 'ai-lab', icon: '🧠', label: isHindi ? 'AI न्यूरल लैब खोलें' : 'Open Neural Studio' },
        { id: 'route-planner', icon: '🧭', label: isHindi ? 'यात्रा प्लान करें' : 'Plan Safe Commute' }
      ]
    },
    inversion: {
      category: isHindi ? 'वायुमंडलीय भौतिकी सिमुलेशन' : 'Atmospheric Physics Simulation',
      nextPage: 'ai-lab',
      nextIcon: '🧠',
      nextTitle: isHindi ? 'AI/ML न्यूरल स्टूडियो (PINN व रिसेप्टर मॉडल)' : 'AI/ML Neural Studio (PINN & Receptor Model)',
      nextReason: isHindi
        ? 'भौतिकी सिमुलेशन के बाद, IIT कानपुर रिसेप्टर मॉडल और PINN न्यूरल नेटवर्क से वास्तविक उत्सर्जन घटाने का परीक्षण करें।'
        : 'Take physical insights into machine learning: test Physics-Informed Neural Networks and receptor source throttles.',
      alternatives: [
        { id: 'blockchain', icon: '⛓️', label: isHindi ? 'ब्लॉकचेन लेजर देखें' : 'AeroLedger Audit' },
        { id: 'forecast', icon: '⏳', label: isHindi ? 'पूर्वानुमान पर लौटें' : 'Back to Forecast' }
      ]
    },
    'ai-lab': {
      category: isHindi ? 'उन्नत न्यूरल मॉडलिंग' : 'Advanced Neural Modeling',
      nextPage: 'blockchain',
      nextIcon: '⛓️',
      nextTitle: isHindi ? 'AeroLedger क्रिप्टोग्राफिक ब्लॉकचेन ऑडिट' : 'AeroLedger Cryptographic Blockchain Ledger',
      nextReason: isHindi
        ? 'मॉडलिंग के बाद, जांचें कि दिल्ली के सभी सेंसर डेटा को क्रिप्टोग्राफिक हैश और मर्कल ट्री से कैसे छेड़छाड़-मुक्त रखा जाता है।'
        : 'Verify the underlying telemetry integrity: inspect immutable SHA-256 blocks and test the anti-tamper fraud resistance sandbox.',
      alternatives: [
        { id: 'overview', icon: '⚡', label: isHindi ? 'लाइव डैशबोर्ड देखें' : 'Live Dashboard' },
        { id: 'inversion', icon: '🧪', label: isHindi ? 'इनवर्जन सिमुलेटर' : 'Inversion Simulator' }
      ]
    },
    blockchain: {
      category: isHindi ? 'सत्यता, विश्वास व ऑडिट' : 'Trust, Governance & Audit',
      nextPage: 'overview',
      nextIcon: '⚡',
      nextTitle: isHindi ? 'लाइव ओवरव्यू व नागरिक डैशबोर्ड' : 'Live Overview & Citizen Dashboard',
      nextReason: isHindi
        ? 'आपने पूर्ण चक्र (लाइव डेटा, व्यक्तिगत स्वास्थ्य, यात्रा, विज्ञान, और ब्लॉकचेन ऑडिट) पूरा कर लिया है! ताज़ा स्थिति देखने के लिए ओवरव्यू पर लौटें।'
        : 'You have completed the full platform workflow from live sensing to cryptographic verification! Return to Live Overview.',
      alternatives: [
        { id: 'map', icon: '🗺️', label: isHindi ? 'मैप ग्रिड देखें' : 'View Map Grid' },
        { id: 'chatbot', icon: '💬', label: isHindi ? 'एआई चैटबॉट खोलें' : 'Open AI Chatbot' }
      ]
    }
  };

  const currentFlow = pageFlowMap[currentPage] || pageFlowMap.overview;

  return (
    <div
      style={{
        marginTop: '36px',
        marginBottom: '20px',
        backgroundColor: 'var(--bg-panel)',
        borderRadius: 'var(--radius-panel, 14px)',
        border: '1px solid var(--border-color)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        {/* Left: Flow Stage & Recommendation */}
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
              🧭 {currentFlow.category}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {isHindi ? 'अनुशंसित अगला कदम' : 'RECOMMENDED NEXT STEP'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>{currentFlow.nextIcon}</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {currentFlow.nextTitle}
            </h4>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {currentFlow.nextReason}
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => onNavigate(currentFlow.nextPage)}
            className="btn btn-sm"
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 800,
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isHindi ? 'अगले चरण पर जाएं' : 'Proceed to Next Step'}</span>
            <span>➔</span>
          </button>

          {/* Quick Alternatives */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {isHindi ? 'या सीधे जाएं:' : 'Or jump to:'}
            </span>
            {currentFlow.alternatives.map(alt => (
              <button
                key={alt.id}
                onClick={() => onNavigate(alt.id)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}
              >
                {alt.icon} {alt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Master Site Flow Guide Trigger & Quick Category Tabs */}
      <div style={{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Full Flow Guide Trigger Button */}
        <button
          onClick={onOpenFlowGuide}
          className="btn btn-outline btn-sm"
          style={{
            fontSize: '11.5px',
            padding: '5px 12px',
            borderColor: 'var(--accent-primary)',
            color: 'var(--accent-primary)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🧭</span>
          <span>{isHindi ? 'संपूर्ण नेविगेशन रोडमैप व विषय गाइड खोलें' : 'Open Complete Navigation Roadmap & Topic Guide'}</span>
        </button>

        {/* 4 Thematic Hub Quick Jump Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', icon: '⚡', label: isHindi ? 'लाइव व मैप' : 'Live & Map' },
            { id: 'ai-advisor', icon: '🛡️', label: isHindi ? 'स्वास्थ्य व नागरिक' : 'Health & Citizen' },
            { id: 'forecast', icon: '🔬', label: isHindi ? 'विज्ञान व लैब' : 'Science & Labs' },
            { id: 'blockchain', icon: '⛓️', label: isHindi ? 'ब्लॉकचेन ऑडिट' : 'Blockchain Audit' }
          ].map(hub => (
            <button
              key={hub.id}
              onClick={() => onNavigate(hub.id)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                backgroundColor: 'var(--bg-panel-subtle)',
                color: 'var(--text-muted)'
              }}
            >
              {hub.icon} {hub.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
