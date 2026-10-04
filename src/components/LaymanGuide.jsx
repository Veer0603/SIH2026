import React, { useState } from 'react';
import { useApp } from '../context/useApp';
import SpringCheck from './SpringCheck';

export default function LaymanGuide() {
  const { selectedStation, language, toggleLanguage } = useApp();
  const lang = language; // 'en' | 'hi'
  const [activeTab, setActiveTab] = useState('pm25');
  const [selectedMask, setSelectedMask] = useState('n95');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const content = {
    en: {
      langSwitch: "हिन्दी में पढ़ें (Read in Hindi)",
      title: "AIR PARTICLES & WEATHER SIMPLIFIED FOR EVERYONE",
      subtitle: "Understand pollution without complicated chemical formulas",
      particles: {
        pm25: {
          name: "PM2.5 — Ultra-Fine Micro Soot",
          size: "2.5 micrometers (30x thinner than a strand of human hair)",
          sources: "Stubble burning smoke, diesel exhaust, brick kilns, garbage burning",
          healthImpact: "Bypasses nose and throat hairs, penetrating deep into the lungs and entering the bloodstream. Causes coughing, chest tightness, and long-term heart strain.",
          simpleMetaphor: "Microscopic specks of black carbon so tiny they float in the air like ghost fog and enter your blood with every breath."
        },
        pm10: {
          name: "PM10 — Coarse Road Dust & Soil",
          size: "10 micrometers (dust particles visible in sunlight beams)",
          sources: "Construction sites, unpaved roads, demolition dust, dry soil",
          healthImpact: "Trapped in the nose and throat, causing persistent sneezing, throat scratchiness, and eye irritation.",
          simpleMetaphor: "Like fine flour or powdered dust kicked up by highway trucks that makes you cough and rub your eyes."
        },
        o3: {
          name: "Ozone (O₃) — Ground-Level Sunlight Smog",
          size: "Reactive gas molecule",
          sources: "Sunlight baking traffic exhaust fumes during hot afternoons",
          healthImpact: "Strongly inflames airway tissues, triggers sharp asthma attacks, and causes burning sensation in eyes.",
          simpleMetaphor: "Afternoon sun 'cooking' traffic fumes into an invisible gas that stings like onion juice."
        },
        nox: {
          name: "Nitrogen Oxides (NOx) — Diesel Exhaust Fumes",
          size: "Toxic brown combustion gas",
          sources: "Diesel trucks, buses, commercial generators, thermal plants",
          healthImpact: "Corrodes lung lining and increases vulnerability to bacterial pneumonia and viral infections.",
          simpleMetaphor: "The harsh, pungent exhaust smell you choke on when stuck behind old trucks in a traffic jam."
        },
        inversion: {
          name: "Atmospheric Inversion & PBL — The Winter 'Smog Lid'",
          size: "Weather layer ceiling (200 to 800 meters altitude)",
          sources: "Clear winter nights, radiation cooling, stagnant calm winds",
          healthImpact: "Acts like a giant invisible glass lid clamped over Delhi NCR, trapping all city smoke right where people walk and breathe.",
          simpleMetaphor: "Putting a heavy lid on a smoking pressure cooker. The smoke cannot rise into the upper sky and gets packed into our streets."
        }
      },
      masks: [
        { id: 'cloth', name: 'Cloth Mask / Bandana', efficiency: '15 - 25%', breathability: 'High', verdict: 'Ineffective against PM2.5. Soot particles pass right between the cloth fibers.' },
        { id: 'surgical', name: '3-Ply Blue Surgical Mask', efficiency: '40 - 55%', breathability: 'High', verdict: 'Catches large droplets and PM10 dust, but leaks heavily along the sides for fine PM2.5 soot.' },
        { id: 'kn95', name: 'KN95 Mask (Ear-loop)', efficiency: '88 - 94%', breathability: 'Moderate', verdict: 'Good protection for everyday commuting if pinched firmly over the nose bridge.' },
        { id: 'n95', name: 'N95 / FFP2 Certified Mask', efficiency: '95 - 98%', breathability: 'Moderate', verdict: 'Gold standard for Delhi winters. Electrostatic meltblown layer traps toxic micro-particles.' }
      ],
      symptoms: [
        { id: 'eyes', label: 'Burning / Watery Eyes', culprit: 'Ground Ozone (O₃) & Acrolein Smog', remedy: 'Rinse with clean cold water or lubricating eye drops. Avoid rubbing eyes.' },
        { id: 'throat', label: 'Dry / Scratchy Throat', culprit: 'PM10 Road Dust & Sulfur Dioxide (SO₂)', remedy: 'Warm saline water gargle and steam inhalation twice daily.' },
        { id: 'chest', label: 'Chest Heaviness / Shortness of Breath', culprit: 'PM2.5 Micro Soot in Alveoli', remedy: 'Immediate rest indoors. Use prescribed inhalers and avoid all outdoor physical activity.' },
        { id: 'cough', label: 'Morning Dry Cough & Phlegm', culprit: 'Nocturnal Inversion Smog Accumulation', remedy: 'Drink warm water with ginger/honey; keep bedroom doors and windows sealed overnight.' }
      ],
      myths: [
        { q: "Is taking an early morning walk in the winter fog healthy?", a: "NO! Winter morning 'fog' in Delhi is actually toxic smog trapped by thermal inversion. Deep breathing during early morning outdoor walks increases particulate lung intake by 300% to 400%." },
        { q: "Can indoor potted plants remove all PM2.5 from a room?", a: "NO. While plants absorb certain gaseous VOCs, they cannot filter microscopic PM2.5 black carbon soot. A genuine HEPA H13 mechanical filter is required to remove PM2.5." },
        { q: "Does tying a wet handkerchief around my face protect me from smoke?", a: "NO. PM2.5 particles are microscopic (under 2.5 microns). Water does not stop fine soot, and moisture makes breathing harder through standard cloth." }
      ]
    },
    hi: {
      langSwitch: "Read in English",
      title: "प्रदूषण और मौसम की जानकारी — आसान हिन्दी में",
      subtitle: "बिना किसी कठिन वैज्ञानिक भाषा के समझें कि हवा में क्या तैर रहा है",
      particles: {
        pm25: {
          name: "PM2.5 — अति-सूक्ष्म जहरीला धुआँ और कालिख",
          size: "2.5 माइक्रोमीटर (इंसानी बाल से 30 गुना बारीक)",
          sources: "पराली का धुआँ, डीजल गाड़ियाँ, ईंट-भट्ठे, कचरा जलाना",
          healthImpact: "यह फेफड़ों की गहराई में जाकर सीधे खून में मिल जाता है। इससे खांसी, सीने में जकड़न और दिल की बीमारियां होती हैं।",
          simpleMetaphor: "काले धुएं के इतने बारीक कण जो हवा में तैरते रहते हैं और हर सांस के साथ आपके खून में चले जाते हैं।"
        },
        pm10: {
          name: "PM10 — सड़कों की मोटी धूल और मिट्टी",
          size: "10 माइक्रोमीटर (धूप की किरणों में दिखने वाले धूल कण)",
          sources: "मकान निर्माण, बिना पक्की सड़कें, खुदाई, मिट्टी का उड़ना",
          healthImpact: "नाक और गले में फंसकर लगातार छींकें, गले में खराश और आँखों में जलन पैदा करता है।",
          simpleMetaphor: "आटे या धूल जैसा पाउडर जो उड़कर आपकी नाक और गले में खुजली करता है।"
        },
        o3: {
          name: "ओजोन (O₃) — धूप वाली तीखी गैस",
          size: "रासायनिक जहरीली गैस",
          sources: "दोपहर की कड़ी धूप में गाड़ियों के धुएं से बनने वाली गैस",
          healthImpact: "फेफड़ों में सूजन लाती है और अस्थमा के मरीजों के लिए बेहद खतरनाक है।",
          simpleMetaphor: "तेज धूप में गाड़ियों का धुआँ पककर ऐसी गैस बनाता है जो प्याज के रस की तरह आँखों और गले को चुभती है।"
        },
        nox: {
          name: "नाइट्रोजन ऑक्साइड (NOx) — डीजल ट्रकों का जहरीला धुआँ",
          size: "जहरीली भूरी गैस",
          sources: "डीजल बसें, बड़े ट्रक, जनरेटर",
          healthImpact: "सांस की नलियों को छील देता है और संक्रमण से लड़ने की ताकत घटाता है।",
          simpleMetaphor: "ट्रैफिक जाम में पुराने ट्रकों के पीछे आने वाली तीखी सड़ांध जैसी बदबू।"
        },
        inversion: {
          name: "इंवर्जन (Inversion) — सर्दियों का 'धुआँ रोकने वाला ढक्कन'",
          size: "आसमान में 200 से 600 मीटर की ऊंचाई पर ठंड की परत",
          sources: "सर्दियों की ठंडी रातें, धीमी हवा",
          healthImpact: "यह दिल्ली के ऊपर एक अदृश्य ढक्कन की तरह काम करता है, जो सारे धुएं को जमीन के पास ही बंद रखता है।",
          simpleMetaphor: "जैसे किसी धुएं वाले बर्तन पर ढक्कन रख दिया जाए। सारा धुआँ ऊपर नहीं जा पाता और हमारे सांस लेने वाली जगह पर जम जाता है।"
        }
      },
      masks: [
        { id: 'cloth', name: 'कपड़े का मास्क / रुमाल', efficiency: '15 - 25%', breathability: 'आसान', verdict: 'PM2.5 के लिए बेकार है। बारीक कालिख कपड़े के धागों के बीच से आसानी से निकल जाती है।' },
        { id: 'surgical', name: 'नीला सर्जिकल मास्क', efficiency: '40 - 55%', breathability: 'आसान', verdict: 'बड़ी धूल रोकता है, लेकिन किनारों से ढीला होने के कारण जहरीला धुआँ अंदर चला जाता है।' },
        { id: 'kn95', name: 'KN95 मास्क', efficiency: '88 - 94%', breathability: 'मध्यम', verdict: 'रोजाना आने-जाने के लिए अच्छा है, बशर्ते नाक पर अच्छी तरह दबाकर पहना जाए।' },
        { id: 'n95', name: 'N95 / FFP2 प्रमाणित मास्क', efficiency: '95 - 98%', breathability: 'मध्यम', verdict: 'दिल्ली की सर्दियों के लिए सबसे बेहतरीन। यह 95% से अधिक जहरीले कणों को फेफड़ों में जाने से रोकता है।' }
      ],
      symptoms: [
        { id: 'eyes', label: 'आँखों में जलन और पानी आना', culprit: 'ओजोन और जहरीला स्मॉग', remedy: 'ठंडे साफ पानी से आँखें धोएं। आँखों को रगड़ें नहीं।' },
        { id: 'throat', label: 'गले में खराश और सूखापन', culprit: 'PM10 धूल और सल्फर गैस', remedy: 'गुनगुने नमक वाले पानी से गरारे करें और भाप लें।' },
        { id: 'chest', label: 'सीने में भारीपन और सांस फूलना', culprit: 'PM2.5 बारीक कालिख', remedy: 'तुरंत घर के अंदर आराम करें। डॉक्टर का इनहेलर लें और बाहर न घूमें।' },
        { id: 'cough', label: 'सुबह की सूखी खांसी', culprit: 'रात में जमा हुआ स्मॉग', remedy: 'गुनगुना पानी पिएं और रात को कमरे की खिड़कियां बंद रखें।' }
      ],
      myths: [
        { q: "क्या सर्दियों में सुबह-सुबह कोहरे में टहलना सेहत के लिए अच्छा है?", a: "बिल्कुल नहीं! दिल्ली में सुबह दिखने वाला 'कोहरा' असल में जहरीला स्मॉग होता है। सुबह दौड़ने से 3 से 4 गुना ज्यादा जहरीला धुआँ फेफड़ों में खिंच जाता है।" },
        { q: "क्या गमले के पौधे घर का सारा PM2.5 धुआँ साफ कर सकते हैं?", a: "नहीं। पौधे केवल कुछ गैसें सोखते हैं। PM2.5 कालिख को रोकने के लिए HEPA एयर प्यूरीफायर ही जरूरी है।" },
        { q: "क्या चेहरे पर गीला रुमाल बांधने से धुआँ रुक जाता है?", a: "नहीं। PM2.5 कण इतने छोटे होते हैं कि वे गीले कपड़े से भी आसानी से अंदर चले जाते हैं।" }
      ]
    }
  };

  const cur = content[lang];
  const activeParticle = cur.particles[activeTab] || cur.particles.pm25;

  return (
    <div className="panel" id="layman-section">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>{cur.title}</span>
          </div>
          <span className="subtitle">{cur.subtitle}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="btn btn-outline btn-sm"
          style={{ fontWeight: 700, fontSize: '12px', borderColor: 'var(--accent-primary)' }}
        >
          🌐 {cur.langSwitch}
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-group" style={{ flexWrap: 'wrap', marginBottom: '16px' }}>
        {Object.keys(cur.particles).map((key) => (
          <button
            key={key}
            className={`tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Particle Explanation Card */}
      <div className="panel-subtle" style={{ backgroundColor: 'var(--bg-page)', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '18px', color: 'var(--accent-primary)' }}>
          {activeParticle.name}
        </h3>

        <div className="grid-2" style={{ gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Physical Particle Size:' : 'कण का आकार:'}
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600 }}>{activeParticle.size}</p>

            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '8px' }}>
              {lang === 'en' ? 'Main Emission Sources:' : 'कहाँ से निकलता है:'}
            </div>
            <p style={{ fontSize: '13px' }}>{activeParticle.sources}</p>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Everyday Metaphor:' : 'आसान उदाहरण:'}
            </div>
            <div style={{
              backgroundColor: 'var(--bg-panel-subtle)',
              borderLeft: '3px solid var(--accent-primary)',
              padding: '10px 14px',
              fontSize: '13px',
              fontStyle: 'italic',
              marginBottom: '12px'
            }}>
              "{activeParticle.simpleMetaphor}"
            </div>

            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {lang === 'en' ? 'Health Impact on Your Body:' : 'शरीर पर असर:'}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--aqi-unhealthy-text)' }}>{activeParticle.healthImpact}</p>
          </div>
        </div>
      </div>

      {/* Interactive Mask Selector & Efficacy Wizard */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div className="panel-title">
            <span>{lang === 'en' ? 'INTERACTIVE MASK FILTRATION COMPARISON' : 'मास्क का चुनाव और क्षमता की जांच'}</span>
          </div>
          <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
            Current AQI: {selectedStation.aqi}
          </span>
        </div>

        <div className="grid-4" style={{ gap: '10px', marginBottom: '14px' }}>
          {cur.masks.map(m => (
            <div
              key={m.id}
              onClick={() => setSelectedMask(m.id)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-card, 10px)',
                border: selectedMask === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: selectedMask === m.id ? 'var(--bg-panel-subtle)' : 'var(--bg-panel)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: selectedMask === m.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{m.name}</div>
              <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                {m.efficiency}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Filtration</div>
            </div>
          ))}
        </div>

        {/* Selected Mask Verdict */}
        {(() => {
          const m = cur.masks.find(x => x.id === selectedMask);
          return (
            <div style={{ backgroundColor: 'var(--bg-page)', padding: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
                {m.name} — {lang === 'en' ? 'Filtration Rating:' : 'क्षमता:'} {m.efficiency}
              </div>
              <p style={{ fontSize: '13px', marginBottom: 0 }}>
                {m.verdict}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Interactive Symptom Checker */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div className="panel-title">
            <span>{lang === 'en' ? 'INTERACTIVE CITIZEN SMOG SYMPTOM CHECKER' : 'प्रदूषण लक्षण जांच और प्राथमिक राहत'}</span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {lang === 'en' ? 'Select what you or your children are experiencing today:' : 'चुनें कि आपको आज क्या परेशानी महसूस हो रही है:'}
        </p>

        <div className="grid-2" style={{ gap: '10px', marginBottom: '16px' }}>
          {cur.symptoms.map(s => {
            const isSel = selectedSymptoms.includes(s.id);
            return (
              <div
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className="spring-check-setting-card"
                data-active={isSel}
                style={{
                  cursor: 'pointer',
                  padding: '10px 14px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: isSel ? 700 : 600, color: 'var(--text-main)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {lang === 'en' ? 'Pollutant:' : 'प्रदूषक:'} {s.culprit.split('&')[0]}
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <SpringCheck
                    checked={isSel}
                    onChange={() => toggleSymptom(s.id)}
                    strike="none"
                    boxSize={20}
                    boxRadius={6}
                    color="var(--accent-primary)"
                    fillColor="var(--accent-primary)"
                    checkColor="#ffffff"
                    bounce={0.25}
                    ariaLabel={s.label}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="grid-2" style={{ gap: '12px' }}>
            {selectedSymptoms.map(id => {
              const sym = cur.symptoms.find(x => x.id === id);
              return (
                <div key={id} style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', padding: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--aqi-unhealthy-text)', marginBottom: '4px' }}>
                    {sym.label}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <strong>{lang === 'en' ? 'Culprit Pollutant:' : 'जिम्मेदार प्रदूषक:'}</strong> {sym.culprit}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--aqi-good-text)' }}>
                    <strong>{lang === 'en' ? 'Recommended Relief:' : 'राहत के उपाय:'}</strong> {sym.remedy}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Myths vs Facts */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>{lang === 'en' ? 'DELHI SMOG: MYTHS VS FACTS' : 'दिल्ली का स्मॉग: भ्रम बनाम सच'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cur.myths.map((m, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-page)', padding: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                ❓ {m.q}
              </div>
              <p style={{ fontSize: '13px', marginBottom: 0, color: 'var(--text-main)' }}>
                💡 {m.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
