// Intelligent Domain Expert AI Knowledge & Reasoning Engine for Delhi Air Quality (AERIS)
// Supports contextual live station telemetry, health precautions, GRAP regulations,
// stubble burning, meteorology, masks, purifiers, and optional Google Gemini API.

import { DELHI_STATIONS } from '../data/delhiStationsData';

// Suggested Quick Prompts (Bilingual)
export const QUICK_PROMPTS = {
  en: [
    { id: 'kids-elderly', icon: '👶', label: 'Is it safe for kids & seniors outdoors?' },
    { id: 'jogging', icon: '🏃', label: 'Can I go jogging tomorrow morning?' },
    { id: 'mask-guide', icon: '😷', label: 'Which mask works? N95 vs cloth?' },
    { id: 'grap-curbs', icon: '🚨', label: 'What are current GRAP Stage restrictions?' },
    { id: 'inversion-why', icon: '🌫️', label: 'Why is smog trapped in Delhi during winter?' },
    { id: 'purifier-choice', icon: '🏢', label: 'How to choose a home HEPA air purifier?' },
    { id: 'stubble-fires', icon: '🌾', label: 'Where is stubble smoke coming from today?' },
    { id: 'cleanest-area', icon: '🟢', label: 'Which area has the cleanest air right now?' }
  ],
  hi: [
    { id: 'kids-elderly', icon: '👶', label: 'क्या आज बच्चों और बुजुर्गों के लिए बाहर जाना सुरक्षित है?' },
    { id: 'jogging', icon: '🏃', label: 'क्या कल सुबह पार्क में दौड़ना या व्यायाम करना सुरक्षित है?' },
    { id: 'mask-guide', icon: '😷', label: 'प्रदूषण से बचने के लिए कौन सा मास्क सबसे बेहतर है?' },
    { id: 'grap-curbs', icon: '🚨', label: 'दिल्ली में ग्रैप (GRAP) के क्या नियम और पाबंदियां लागू हैं?' },
    { id: 'inversion-why', icon: '🌫️', label: 'सर्दियों में दिल्ली में धुआं और स्मॉग क्यों फंस जाता है?' },
    { id: 'purifier-choice', icon: '🏢', label: 'घर के लिए सही HEPA एयर प्यूरीफायर कैसे चुनें?' },
    { id: 'stubble-fires', icon: '🌾', label: 'पंजाब-हरियाणा में पराली का धुआं दिल्ली कैसे पहुंचता है?' },
    { id: 'cleanest-area', icon: '🟢', label: 'इस समय दिल्ली में सबसे कम प्रदूषण किस इलाके में है?' }
  ]
};

// Check if query is in Hindi
function isHindiQuery(text) {
  // Checks Devanagari script unicode range
  return /[\u0900-\u097F]/.test(text);
}

// Find closest station match from query text
export function matchStationFromText(query, stations = DELHI_STATIONS) {
  const q = query.toLowerCase();
  for (const st of stations) {
    const name = st.name.toLowerCase();
    const short = st.shortName.toLowerCase();
    const id = st.id.toLowerCase();
    const zone = (st.zone || '').toLowerCase();

    if (q.includes(short) || q.includes(id) || q.includes(name) || (zone && q.includes(zone))) {
      return st;
    }

    // Common abbreviations and alternate spellings
    if (q.includes('cp') && (id.includes('connaught') || short.includes('connaught'))) return st;
    if (q.includes('anand') && id.includes('anand-vihar')) return st;
    if (q.includes('airport') && id.includes('airport')) return st;
    if (q.includes('t3') && id.includes('airport')) return st;
    if (q.includes('gurgaon') && id.includes('gurugram')) return st;
  }
  return null;
}

// Format station health status
function getStationHealthAssessment(station, isHindi) {
  const aqi = station.aqi;
  const pm25 = station.pm25;
  const whoRatio = Math.round((pm25 / 15) * 10) / 10;

  if (isHindi) {
    if (aqi > 400) {
      return {
        level: 'गंभीर+ आपातकाल (Severe+ Emergency)',
        advice: `वर्तमान AQI ${aqi} (PM2.5: ${pm25} µg/m³) है, जो WHO की 24 घंटे की सुरक्षित सीमा (15 µg/m³) से **${whoRatio} गुना अधिक** है! सभी बाहरी गतिविधियां तुरंत रोकें और N95 मास्क तथा इनडोर एयर प्यूरीफायर का प्रयोग करें।`
      };
    }
    if (aqi > 300) {
      return {
        level: 'गंभीर (Severe)',
        advice: `वर्तमान AQI ${aqi} (PM2.5: ${pm25} µg/m³) है, जो WHO की सुरक्षित सीमा से **${whoRatio} गुना अधिक** है। फेफड़ों और हृदय रोगियों के लिए अत्यधिक हानिकारक है।`
      };
    }
    if (aqi > 200) {
      return {
        level: 'अस्वस्थ / खराब (Unhealthy / Poor)',
        advice: `वर्तमान AQI ${aqi} (PM2.5: ${pm25} µg/m³) है। लंबे समय तक बाहर रहने से सांस लेने में कठिनाई हो सकती है।`
      };
    }
    return {
      level: 'मध्यम (Moderate)',
      advice: `वर्तमान AQI ${aqi} (PM2.5: ${pm25} µg/m³) है। संवेदनशील लोगों को अत्यधिक परिश्रम वाली गतिविधियों से बचना चाहिए।`
    };
  } else {
    if (aqi > 400) {
      return {
        level: 'Severe+ Emergency',
        advice: `Current AQI is ${aqi} (PM2.5: ${pm25} µg/m³), which is **${whoRatio}x higher** than the WHO 24h safe threshold (15 µg/m³)! Cease all non-essential outdoor exposure and operate indoor HEPA purifiers.`
      };
    }
    if (aqi > 300) {
      return {
        level: 'Severe',
        advice: `Current AQI is ${aqi} (PM2.5: ${pm25} µg/m³), standing **${whoRatio}x above** the WHO safe threshold. Severe respiratory and cardiovascular hazard.`
      };
    }
    if (aqi > 200) {
      return {
        level: 'Unhealthy / Poor',
        advice: `Current AQI is ${aqi} (PM2.5: ${pm25} µg/m³). Prolonged outdoor exertion will trigger airway inflammation and fatigue.`
      };
    }
    return {
      level: 'Moderate',
      advice: `Current AQI is ${aqi} (PM2.5: ${pm25} µg/m³). Relatively manageable, but sensitive individuals should monitor physical exertion.`
    };
  }
}

// Built-in Domain Expert Knowledge Engine
export function generateLocalBotResponse(query, context = {}) {
  const {
    stations = DELHI_STATIONS,
    selectedStation = DELHI_STATIONS[0],
    language = 'en',
    _userProfile = 'general'
  } = context;

  const isHindi = language === 'hi' || isHindiQuery(query);
  const q = query.toLowerCase();

  // 1. Check for specific Delhi Station / Locality Query
  const matchedStation = matchStationFromText(query, stations);
  if (matchedStation) {
    const assess = getStationHealthAssessment(matchedStation, isHindi);
    if (isHindi) {
      return {
        text: `📍 **${matchedStation.name} में लाइव वायु गुणवत्ता स्थिति:**\n\n` +
          `• **AQI सूचकांक:** **${matchedStation.aqi}** (${assess.level})\n` +
          `• **PM2.5 सांद्रता:** **${matchedStation.pm25} µg/m³** (प्रमुख प्रदूषक: ${matchedStation.dominantPollutant})\n` +
          `• **PM10 सांद्रता:** ${matchedStation.pm10} µg/m³ | तापमान: ${matchedStation.temp}°C | आर्द्रता: ${matchedStation.humidity}%\n` +
          `• **हवा की गति व दिशा:** ${matchedStation.windSpeed} km/h (${matchedStation.windDirectionText})\n` +
          `• **इनवर्जन परत (PBL ऊँचाई):** ${matchedStation.pblHeight} मीटर (ट्रैपिंग तीव्रता: ${matchedStation.inversionStrength}%)\n\n` +
          `🛡️ **स्वास्थ्य परामर्श:**\n${assess.advice}\n\n` +
          `क्या आप इस स्टेशन का 72 घंटे का पूर्वानुमान देखना चाहते हैं या किसी अन्य क्षेत्र से तुलना करना चाहते हैं?`,
        actions: [
          { type: 'select-station', stationId: matchedStation.id, label: `🗺️ ${matchedStation.shortName} मैप पर देखें` },
          { type: 'navigate', page: 'route-planner', label: '🧭 सुरक्षित यात्रा मार्ग' }
        ]
      };
    } else {
      return {
        text: `📍 **Live Air Quality Telemetry for ${matchedStation.name}:**\n\n` +
          `• **AQI Index:** **${matchedStation.aqi}** (${assess.level})\n` +
          `• **PM2.5 Density:** **${matchedStation.pm25} µg/m³** (Dominant pollutant: ${matchedStation.dominantPollutant})\n` +
          `• **PM10 Density:** ${matchedStation.pm10} µg/m³ | Temperature: ${matchedStation.temp}°C | Humidity: ${matchedStation.humidity}%\n` +
          `• **Wind Telemetry:** ${matchedStation.windSpeed} km/h (${matchedStation.windDirectionText})\n` +
          `• **Boundary Layer (PBL Height):** ${matchedStation.pblHeight}m (Smog trapping factor: ${matchedStation.inversionStrength}%)\n\n` +
          `🛡️ **Clinical Guidance:**\n${assess.advice}\n\n` +
          `Would you like to model commute routes or inspect the 72h atmospheric forecast for this station?`,
        actions: [
          { type: 'select-station', stationId: matchedStation.id, label: `🗺️ View ${matchedStation.shortName} on Map` },
          { type: 'navigate', page: 'route-planner', label: '🧭 Plan Safe Commute' }
        ]
      };
    }
  }

  // 2. Cleanest / Best Air Locality Query
  if (q.includes('clean') || q.includes('lowest') || q.includes('safest') || q.includes('best air') || q.includes('कम प्रदूषण') || q.includes('साफ') || q.includes('स्वच्छ')) {
    const sorted = [...stations].sort((a, b) => a.aqi - b.aqi);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    if (isHindi) {
      return {
        text: `🟢 **दिल्ली एनसीआर में इस समय सबसे स्वच्छ हवा वाले क्षेत्र:**\n\n` +
          `1. **${best.name}**: AQI **${best.aqi}** (${best.category}) — PM2.5: ${best.pm25} µg/m³\n` +
          `2. **${sorted[1].name}**: AQI **${sorted[1].aqi}** (${sorted[1].category})\n` +
          `3. **${sorted[2].name}**: AQI **${sorted[2].aqi}** (${sorted[2].category})\n\n` +
          `⚠️ **सबसे प्रदूषित हॉटस्पॉट:** **${worst.name}** (AQI **${worst.aqi}** — ${worst.category})। यहां पराली के धुएं और शांत हवाओं के कारण भारी प्रदूषण संचित है।`,
        actions: [
          { type: 'select-station', stationId: best.id, label: `📍 ${best.shortName} देखें` },
          { type: 'navigate', page: 'map', label: '🗺️ सम्पूर्ण मैप ग्रिड' }
        ]
      };
    } else {
      return {
        text: `🟢 **Current Cleanest Air Sectors in Delhi NCR:**\n\n` +
          `1. **${best.name}**: AQI **${best.aqi}** (${best.category}) — PM2.5: ${best.pm25} µg/m³\n` +
          `2. **${sorted[1].name}**: AQI **${sorted[1].aqi}** (${sorted[1].category})\n` +
          `3. **${sorted[2].name}**: AQI **${sorted[2].aqi}** (${sorted[2].category})\n\n` +
          `⚠️ **Highest Pollution Hotspot:** **${worst.name}** (AQI **${worst.aqi}** — ${worst.category}) due to low planetary boundary layer inversion and local emission convergence.`,
        actions: [
          { type: 'select-station', stationId: best.id, label: `📍 View ${best.shortName}` },
          { type: 'navigate', page: 'map', label: '🗺️ Open Map Grid' }
        ]
      };
    }
  }

  // 3. Children, Elderly, Vulnerable Demographics
  if (q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('elder') || q.includes('senior') || q.includes('बच्च') || q.includes('बुजुर्ग') || q.includes('माता-पिता')) {
    if (isHindi) {
      return {
        text: `👶👵 **बच्चों और बुजुर्गों के लिए विशेष स्वास्थ्य सुरक्षा निर्देश:**\n\n` +
          `• **फेफड़ों की नाजुकता:** बच्चों के फेफड़े अभी विकसित हो रहे होते हैं और वे प्रति किलोग्राम वजन वयस्कों से अधिक सांस लेते हैं। बुजुर्गों में एल्वियोली लोच कम होती है।\n` +
          `• **बाहरी खेल और स्कूल:** यदि AQI 200 से अधिक है, तो सुबह 11 बजे से पहले और शाम 5 बजे के बाद बच्चों को खुले मैदान में बिल्कुल न खेलने दें।\n` +
          `• **N95 बाल सुरक्षा मास्क:** 3 वर्ष से अधिक उम्र के बच्चों के लिए विशेष आकार वाले बाल N95 मास्क उपलब्ध हैं। सामान्य कपड़े या सर्जिकल मास्क सूक्ष्म PM2.5 कणों को नहीं रोक सकते।\n` +
          `• **घर के अंदर सुरक्षा:** कमरे के दरवाजे व खिड़कियां सुबह और शाम के पीक स्मॉग घंटों में पूरी तरह बंद रखें और HEPA H13 एयर प्यूरीफायर चलाएं।\n` +
          `• **सतर्कता लक्षण:** लगातार सूखी खांसी, घरघराहट (wheezing), या आंखों में जलन दिखने पर तुरंत बाल रोग विशेषज्ञ या डॉक्टर से संपर्क करें।`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 बाल एवं वरिष्ठ स्वास्थ्य सलाहकार' },
          { type: 'navigate', page: 'layman', label: '📖 सरल भाषा में समझें' }
        ]
      };
    } else {
      return {
        text: `👶👵 **Clinical Advisory for Children & Senior Citizens:**\n\n` +
          `• **Respiratory Vulnerability:** Children breathe faster relative to body mass, inhaling ~50% more air per pound than adults. Seniors have reduced pulmonary reserve and higher cardiovascular sensitivity.\n` +
          `• **Outdoor Play & Recess:** When AQI exceeds 200, strictly suspend outdoor sports and school assemblies between 06:00–11:00 and after 17:00.\n` +
          `• **Pediatric N95 Masking:** Use pediatric-sized N95 respirators (fitted seal) for children >3 years. Cloth and loose surgical masks offer zero protection against ultra-fine PM2.5 (<2.5 µm).\n` +
          `• **Indoor Sanctuary:** Keep windows sealed during morning nocturnal inversion. Run true HEPA H13 filtration in bedrooms.\n` +
          `• **Warning Red Flags:** Persistent nighttime cough, audible stridor/wheezing, or chest tightness require immediate clinical attention.`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 Personalized Vulnerability Profile' },
          { type: 'navigate', page: 'layman', label: '📖 Air Quality Simplified' }
        ]
      };
    }
  }

  // 4. Jogging, Running, Cycling, Morning Walks, Outdoor Exercise
  if (q.includes('jog') || q.includes('run') || q.includes('walk') || q.includes('cycl') || q.includes('exercise') || q.includes('gym') || q.includes('दौड़') || q.includes('टहल') || q.includes('व्यायाम') || q.includes('जिम')) {
    if (isHindi) {
      return {
        text: `🏃‍♂️ **सुबह की सैर और दौड़ने (Jogging) के संबंध में वैज्ञानिक चेतावनी:**\n\n` +
          `⛔ **सुबह 6:00 से 9:00 बजे के बीच खुले में दौड़ना अत्यंत घातक है!**\n\n` +
          `**कारण:** रात की ठंड के कारण दिल्ली में 'थर्मल इनवर्जन' (Thermal Inversion) होता है, जिससे वायुमंडलीय सीमा परत (PBL) मात्र 250-400 मीटर तक गिर जाती है। जमीन के पास जहरीला स्मॉग और PM2.5 जमा हो जाता है।\n` +
          `• **गहरी सांस का दुष्प्रभाव:** दौड़ते समय सांस की दर 8 लीटर/मिनट से बढ़कर **40–60 लीटर/मिनट** हो जाती है। यह एक घंटे की दौड़ में **15-20 सिगरेट का धुआं** सीधे फेफड़ों की गहराई तक खींचने के बराबर है!\n` +
          `• **सुरक्षित समय:** यदि व्यायाम करना अनिवार्य हो, तो दोपहर 1:00 से 4:00 बजे के बीच करें, जब धूप से इनवर्जन टूटता है और हवा साफ होती है, या इनडोर जिम में HEPA प्यूरीफायर के साथ करें।`,
        actions: [
          { type: 'navigate', page: 'inversion', label: '🧪 इनवर्जन भौतिकी देखें' },
          { type: 'navigate', page: 'route-planner', label: '🧭 यात्रा व आउटडोर डोज़ कैलकुलेटर' }
        ]
      };
    } else {
      return {
        text: `🏃‍♂️ **Scientific Hazard Advisory for Morning Running & Jogging:**\n\n` +
          `⛔ **DO NOT JOG OUTDOORS BETWEEN 06:00 AND 09:30 AM!**\n\n` +
          `**Atmospheric Reason:** Winter nocturnal radiative cooling compresses Delhi's Planetary Boundary Layer (PBL) down to just 250–350m. Toxic vehicular soot, industrial NOx, and stubble particulates are trapped right at breathing height.\n` +
          `• **Pulmonary Ventilation Burden:** Aerobic exertion escalates breathing ventilation from 8 L/min up to **45–65 L/min**, sucking PM2.5 past nasal cilia directly into alveoli. A 5km morning run at AQI 350 delivers the toxic equivalent of **smoking 18 cigarettes**!\n` +
          `• **Safer Window:** Shift all physical exercise indoors with a HEPA filter, or utilize the 13:00–16:00 afternoon window when solar convection dilutes the surface smog cap.`,
        actions: [
          { type: 'navigate', page: 'inversion', label: '🧪 Inversion Physics Model' },
          { type: 'navigate', page: 'route-planner', label: '🧭 Calculate Workout Inhalation' }
        ]
      };
    }
  }

  // 5. Masks: N95 vs Cloth vs Surgical
  if (q.includes('mask') || q.includes('n95') || q.includes('surgical') || q.includes('cloth') || q.includes('मास्क') || q.includes('मास्क कौन सा')) {
    if (isHindi) {
      return {
        text: `😷 **प्रदूषण रोधी मास्क तुलनात्मक गाइड:**\n\n` +
          `1. **N95 / FFP2 / KN95 मास्क (अत्यंत अनुशंसित ⭐⭐⭐⭐⭐):**\n` +
          `   • 0.3 माइक्रोन के अति-सूक्ष्म PM2.5 कणों को **95% से अधिक** रोकते हैं।\n` +
          `   • चेहरे पर किनारों से कोई गैप नहीं होना चाहिए।\n` +
          `   • वाल्व-रहित (Non-valved) मास्क सबसे सुरक्षित माने जाते हैं।\n\n` +
          `2. **सर्जिकल मास्क (अपर्याप्त ⚠️):**\n` +
          `   • केवल 20-30% बड़े धूल कण रोकते हैं। किनारों से हवा लीक होती है, PM2.5 को नहीं रोक पाते।\n\n` +
          `3. **कपड़े का मास्क या रूमाल (बिल्कुल बेकार ❌):**\n` +
          `   • PM2.5 कण कपड़े के छिद्रों से आसानी से आर-पार निकल जाते हैं (0% सुरक्षा)।\n\n` +
          `💡 **सुझाव:** एक N95 मास्क को सामान्यतः 40-50 घंटे की सक्रिय उपयोगिता के बाद बदल देना चाहिए, या जब सांस लेने में भारीपन लगे।`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 मास्क सुरक्षा प्रभाव सिमुलेशन' },
          { type: 'navigate', page: 'layman', label: '📖 सरल वायु गाइड' }
        ]
      };
    } else {
      return {
        text: `😷 **Respirator Mask Filtration Efficiency Benchmark:**\n\n` +
          `1. **Certified N95 / FFP2 / KN95 (Essential ⭐⭐⭐⭐⭐):**\n` +
          `   • Filters **≥95% of ultra-fine 0.3 µm PM2.5 particles** via electrostatically charged meltblown polypropylene.\n` +
          `   • Must form a tight hermetic seal over nasal bridge and chin. Without a tight seal, bypass air enters freely.\n` +
          `   • Non-valved respirators are preferred for bidirectional protection.\n\n` +
          `2. **Surgical 3-Ply Masks (Ineffective ⚠️):**\n` +
          `   • Captures only 25–30% of airborne particulates. Loose perimeter gaps allow PM2.5 to bypass the filter.\n\n` +
          `3. **Cloth Masks & Bandanas (Zero PM2.5 Protection ❌):**\n` +
          `   • Woven cotton pore size is 100–200 µm, while PM2.5 is <2.5 µm. Particulates fly right through without resistance.\n\n` +
          `💡 **Usage Life:** Replace an N95 mask after 40–50 hours of active wear, or whenever breathing resistance increases noticeably.`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 Test Mask Exposure Inhalation' },
          { type: 'navigate', page: 'layman', label: '📖 Layman Guide' }
        ]
      };
    }
  }

  // 6. Air Purifiers & Indoor Air
  if (q.includes('purifier') || q.includes('hepa') || q.includes('indoor') || q.includes('cadr') || q.includes('प्यूरीफायर') || q.includes('हवा साफ करने') || q.includes('घर के अंदर')) {
    if (isHindi) {
      return {
        text: `🏢 **घर के लिए एयर प्यूरीफायर चयन व इनडोर वायु निर्देश:**\n\n` +
          `• **True HEPA H13 अनिवार्य:** सुनिश्चित करें कि प्यूरीफायर में 'True HEPA H13' फिल्टर हो, जो 0.3 माइक्रोन कणों को 99.97% तक छानता है। केवल आयनाइज़र (Ionizer) से बचें क्योंकि वे हानिकारक ओज़ोन उत्पन्न करते हैं।\n` +
          `• **CADR (Clean Air Delivery Rate) नियम:**\n` +
          `  - 150 वर्ग फुट कमरे हेतु: न्यूनतम CADR **200 m³/h**\n` +
          `  - 300 वर्ग फुट कमरे हेतु: न्यूनतम CADR **350-450 m³/h**\n` +
          `  - कमरे में प्रति घंटे 4 से 5 बार हवा का चक्रण (ACH 4-5x) होना चाहिए।\n` +
          `• **सक्रिय कार्बन फिल्टर (Activated Carbon):** गंध, VOCs और जहरीली गैसों (NO2, SO2) को सोखने के लिए आवश्यक है।\n` +
          `• **मिथक निवारण:** पौधे (Snake plant/Areca palm) सुंदर हैं, लेकिन वे बंद कमरे में PM2.5 सांद्रता को कम करने के लिए पर्याप्त वायु परिसंचरण नहीं कर सकते। कमरे की खिड़कियों पर वेदर-स्ट्रिप सीलिंग लगाएं।`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 प्यूरीफायर CADR कैलकुलेटर' }
        ]
      };
    } else {
      return {
        text: `🏢 **Home Air Purifier Buyer's Guide & Indoor Air Engineering:**\n\n` +
          `• **True HEPA H13 is Non-Negotiable:** Ensure mechanical filtration with true HEPA H13/H14 (99.97% capture down to 0.3 µm). Avoid pure electronic ionizers/plasma generators that emit secondary ozone (O3).\n` +
          `• **CADR Sizing Formula:**\n` +
          `  - 150 sq ft room: Minimum CADR **200 m³/hr** (120 CFM)\n` +
          `  - 300 sq ft room: Minimum CADR **380–450 m³/hr** (250 CFM)\n` +
          `  - Target **4 to 5 Air Changes per Hour (ACH)** during Delhi's winter smog spikes.\n` +
          `• **Activated Carbon Bed:** Essential for adsorbing toxic gaseous vehicular exhaust (NO2, SO2, benzene, formaldehyde).\n` +
          `• **Myth Buster:** Indoor potted plants do not scrub PM2.5 at aerodynamic scales. Seal window frame gaps with foam weather-stripping tape to prevent ambient infiltration.`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 Open Room Purifier Calculator' }
        ]
      };
    }
  }

  // 7. GRAP (Graded Response Action Plan) Stages
  if (q.includes('grap') || q.includes('rule') || q.includes('ban') || q.includes('restriction') || q.includes('stage') || q.includes('odd even') || q.includes('स्कूल') || q.includes('ग्रैप') || q.includes('प्रतिबंध') || q.includes('नियम')) {
    if (isHindi) {
      return {
        text: `🚨 **दिल्ली एनसीआर में ग्रैप (GRAP) 4 चरणों की विस्तृत जानकारी:**\n\n` +
          `1. **स्टेज I (खराब - AQI 201-300):**\n` +
          `   • 500 वर्ग मीटर से अधिक निर्माण स्थलों पर धूल नियंत्रण, मशीनीकृत सड़क सफाई, होटलों में कोयला/लकड़ी के तंदूर पर रोक।\n\n` +
          `2. **स्टेज II (बहुत खराब - AQI 301-400):**\n` +
          `   • डीजल जनरेटर सेट पर सख्त प्रतिबंध, पार्किंग शुल्क में वृद्धि, मेट्रो और सीएनजी बसों के फेरे बढ़ाना।\n\n` +
          `3. **स्टेज III (गंभीर - AQI 401-450):**\n` +
          `   • दिल्ली-एनसीआर में गैर-आवश्यक निर्माण व तोड़फोड़ कार्यों पर पूर्ण रोक।\n` +
          `   • दिल्ली में **BS-III पेट्रोल और BS-IV डीजल चार पहिया वाहनों पर पूर्ण प्रतिबंध**।\n` +
          `   • प्राथमिक विद्यालयों (कक्षा 5 तक) के लिए ऑनलाइन कक्षाओं की सिफारिश।\n\n` +
          `4. **स्टेज IV (गंभीर+ आपातकाल - AQI >450):**\n` +
          `   • आवश्यक वस्तुओं को छोड़कर बाहरी डीजल ट्रकों के प्रवेश पर रोक, सम-विषम (Odd-Even) वाहन योजना, कक्षा 12 तक स्कूलों को बंद/ऑनलाइन करना, 50% सरकारी व निजी कार्यालयों में वर्क-फ्रॉम-होम।`,
        actions: [
          { type: 'navigate', page: 'forecast', label: '⏳ 72 घंटे का GRAP पूर्वानुमान' }
        ]
      };
    } else {
      return {
        text: `🚨 **Comprehensive GRAP (Graded Response Action Plan) Matrix:**\n\n` +
          `1. **Stage I (Poor — AQI 201–300):**\n` +
          `   • Strict dust mitigation on >500 sqm construction, mechanized vacuum road sweeping, complete ban on coal/firewood in open eateries.\n\n` +
          `2. **Stage II (Very Poor — AQI 301–400):**\n` +
          `   • Regulated ban on diesel generator sets, enhanced parking fees to disincentivize private driving, augmented frequency of Delhi Metro and electric buses.\n\n` +
          `3. **Stage III (Severe — AQI 401–450):**\n` +
          `   • Complete shutdown of non-essential construction and demolition activities.\n` +
          `   • **Total vehicular ban on BS-III Petrol and BS-IV Diesel 4-wheelers** across Delhi NCR.\n` +
          `   • Mandatory hybrid/online mode for primary schools (up to Grade 5).\n\n` +
          `4. **Stage IV (Severe+ Emergency — AQI >450):**\n` +
          `   • Ban on entry of non-Delhi medium/heavy diesel trucks (except essential goods/LNG/EV).\n` +
          `   • Implementation of Odd-Even vehicle rationing, closure of schools up to Grade 11, and 50% mandatory work-from-home (WFH) in public and private offices.`,
        actions: [
          { type: 'navigate', page: 'forecast', label: '⏳ 72h GRAP Compliance Forecast' }
        ]
      };
    }
  }

  // 8. Stubble Burning (पराली)
  if (q.includes('stubble') || q.includes('parali') || q.includes('punjab') || q.includes('haryana') || q.includes('fire') || q.includes('farm') || q.includes('पराली') || q.includes('आग') || q.includes('खेत')) {
    if (isHindi) {
      return {
        text: `🌾 **पराली जलाने (Stubble Burning) का विज्ञान और दिल्ली पर प्रभाव:**\n\n` +
          `• **समय सीमा:** 15 अक्टूबर से 25 नवंबर के बीच, पंजाब और हरियाणा के किसान धान की पराली जलाते हैं ताकि गेहूं की बुवाई जल्द की जा सके।\n` +
          `• **वायुमंडलीय कॉरिडोर:** इस दौरान उत्तर-पश्चिमी (North-Westerly) हवाएं चलती हैं। यह वायु धारा संगरूर, पटियाला, कैथल, करनाल और जींद के सैकड़ों खेतों से निकले घने धुएं को सीधे दिल्ली की ओर बहाकर लाती है।\n` +
          `• **दिल्ली का कटोरा प्रभाव:** दिल्ली भौगोलिक रूप से एक उथले बेसिन में स्थित है। जब पराली का धुआं शांत सतही हवाओं (<5 किमी/घंटा) और ठंड के तापमान से टकराता है, तो यह सतह पर एक 'स्मॉग गुंबद' के रूप में जम जाता है।\n` +
          `• **NASA FIRMS सैटेलाइट:** हमारे मैप पर नासा के सक्रिय आग डिटेक्शन हॉटस्पॉट और थर्मल पावर (MW) को सीधे ट्रैक किया जा सकता है।`,
        actions: [
          { type: 'navigate', page: 'map', label: '🛰️ नासा पराली आग मैप देखें' },
          { type: 'navigate', page: 'inversion', label: '🧪 स्मॉग ट्रैपिंग इनवर्जन मॉडल' }
        ]
      };
    } else {
      return {
        text: `🌾 **Atmospheric Science of Stubble Burning (Crop Residue Smog):**\n\n` +
          `• **Seasonal Harvest Cycle:** Between October 15 and November 25, farmers across Punjab and Haryana burn paddy stubble to clear fields rapidly for wheat sowing.\n` +
          `• **North-Westerly Smoke Corridor:** Prevailing synoptic NW winds (300°–320°) transport dense plumes of organic carbon, black carbon, and carbon monoxide directly across the Indo-Gangetic Plain into Delhi NCR.\n` +
          `• **Topographic Basin Trapping:** As smoke enters Delhi, nocturnal radiative cooling collapses the planetary boundary layer. With near-calm surface winds (<5 km/h), the smoke cannot disperse vertically or horizontally, creating a toxic stagnant smog dome.\n` +
          `• **Satellite Verification:** You can inspect real-time NASA FIRMS thermal fire detections and Fire Radiative Power (MW) across Sangrur, Patiala, Kaithal, and Karnal directly on our Mapbox interface.`,
        actions: [
          { type: 'navigate', page: 'map', label: '🛰️ View NASA FIRMS Fire Map' },
          { type: 'navigate', page: 'inversion', label: '🧪 Inversion Physics Trapping' }
        ]
      };
    }
  }

  // 9. Temperature Inversion Physics
  if (q.includes('inversion') || q.includes('pbl') || q.includes('physics') || q.includes('trap') || q.includes('मौसम') || q.includes('इनवर्जन') || q.includes('धुआं क्यों')) {
    if (isHindi) {
      return {
        text: `🌫️ **तापमान इनवर्जन (Temperature Inversion) क्या है और यह प्रदूषण क्यों बढ़ाता है?**\n\n` +
          `• **सामान्य वायुमंडल में:** जैसे-जैसे हम जमीन से ऊपर जाते हैं, हवा ठंडी होती जाती है। गर्म हवा हल्की होने के कारण ऊपर उठती है और प्रदूषण को अपने साथ ऊपर ले जाकर साफ कर देती है।\n` +
          `• **सर्दियों में इनवर्जन की स्थिति:**\n` +
          `  1. लंबी सर्दियों की रातों में जमीन तेजी से ठंडी हो जाती है।\n` +
          `  2. जमीन के ठीक ऊपर की हवा ठंडी व भारी हो जाती है, जबकि उसके ऊपर गर्म हवा की एक परत 'ढक्कन' की तरह बैठ जाती है।\n` +
          `  3. भारी ठंडी हवा ऊपर नहीं उठ पाती।\n` +
          `• **परिणाम:** सभी गाड़ियों का धुआं, धूल और पराली का धुआं जमीन से 200-400 मीटर की ऊंचाई के भीतर ही कैद हो जाता है। दोपहर में जब तेज धूप निकलती है, तभी यह इनवर्जन टूटता है।`,
        actions: [
          { type: 'navigate', page: 'inversion', label: '🧪 लाइव इनवर्जन सिम्युलेटर चलाएं' }
        ]
      };
    } else {
      return {
        text: `🌫️ **Atmospheric Temperature Inversion & Boundary Layer Physics:**\n\n` +
          `• **Normal Atmosphere:** Normally, ambient air cools with altitude (-6.5°C/km lapse rate). Warm, buoyant air at the surface rises via thermal convection, carrying pollutants upward into the upper troposphere for dispersion.\n` +
          `• **Winter Inversion Phenomenon:**\n` +
          `  1. During clear winter nights, rapid radiative ground cooling chills surface air faster than the air above.\n` +
          `  2. A layer of warm air settles on top of dense, cold surface air, creating a **negative temperature lapse rate (Inversion)**.\n` +
          `  3. This warm layer acts like an impermeable thermal 'lid' (capping inversion).\n` +
          `• **Consequence:** The Planetary Boundary Layer (PBL) collapses from ~2,000m down to 250–400m. Vehicular exhaust and smoke are physically trapped right where 30 million citizens live and breathe.`,
        actions: [
          { type: 'navigate', page: 'inversion', label: '🧪 Run Inversion Sandbox' }
        ]
      };
    }
  }

  // 10. Commute & Travel Exposure
  if (q.includes('commute') || q.includes('metro') || q.includes('travel') || q.includes('car') || q.includes('bike') || q.includes('bus') || q.includes('सफर') || q.includes('मेट्रो') || q.includes('गाड़ी') || q.includes('यात्रा')) {
    if (isHindi) {
      return {
        text: `🧭 **दिल्ली में सफर के दौरान प्रदूषण जोखिम तुलना:**\n\n` +
          `• 🚇 **दिल्ली मेट्रो (सबसे सुरक्षित ⭐⭐⭐⭐⭐):** मेट्रो के भूमिगत स्टेशन और ट्रेनों के एयर कंडीशनिंग HVAC सिस्टम में उच्च-दक्षता वाले फिल्टर लगे होते हैं, जो **80-85% प्रदूषण रोकते हैं**।\n` +
          `• 🚗 **एसी कार / कैब (मध्यम सुरक्षा ⭐⭐⭐):** यदि एसी को 'Internal Air Recirculation' मोड पर रखा जाए, तो यह सड़क के सीधे डीजल धुएं से बचाता है।\n` +
          `• 🛵 **बाइक / स्कूटर / ऑटो (अत्यधिक जोखिम ⚠️):** सड़क पर सीधे डीजल बसों और ट्रकों के साइलेंसर के पीछे सांस लेने से अत्यधिक धुआं फेफड़ों में जाता है। N95 मास्क अनिवार्य है।\n` +
          `• 🚴 **साइकिल / पैदल (घातक जोखिम ⛔):** भारी स्मॉग के दौरान साइकिल चलाने से सांस तेजी से चलती है, जिससे जहरीले कण फेफड़ों की गहराई तक जाते हैं।`,
        actions: [
          { type: 'navigate', page: 'route-planner', label: '🧭 सुरक्षित यात्रा मार्ग प्लानर' }
        ]
      };
    } else {
      return {
        text: `🧭 **Commute Modality Exposure & Inhalation Dosimetry:**\n\n` +
          `• 🚇 **Delhi Metro (Safest Transit ⭐⭐⭐⭐⭐):** Underground stations and train HVAC multi-stage filters eliminate **80–85% of ambient soot**, keeping in-cabin PM2.5 around 35–45 µg/m³.\n` +
          `• 🚗 **AC Cab / Car with Recirculation (Good ⭐⭐⭐):** Keeps in-cabin PM2.5 ~60–90 µg/m³ provided internal AC recirculation is locked (prevents fresh roadside tailpipe intake).\n` +
          `• 🛵 **Two-Wheeler / Auto-Rickshaw (Extreme Exposure ⚠️):** Direct immersion behind diesel truck and bus exhaust. Zero cabin shielding; N95 mask is strictly mandatory.\n` +
          `• 🚴 **Cycling / Walking (Hazardous ⛔):** Aerobic exertion increases tidal breathing volume 4x. A 30-minute cycling commute on Ring Road during severe smog delivers immense particulate lung dose.`,
        actions: [
          { type: 'navigate', page: 'route-planner', label: '🧭 Open Transit Route Optimizer' }
        ]
      };
    }
  }

  // 11. Symptoms & Home Health Remedies
  if (q.includes('cough') || q.includes('throat') || q.includes('eye') || q.includes('headache') || q.includes('breath') || q.includes('doctor') || q.includes('खांसी') || q.includes('गले') || q.includes('आंख') || q.includes('सिरदर्द') || q.includes('दवा')) {
    if (isHindi) {
      return {
        text: `🩺 **स्मॉग के कारण होने वाले सामान्य लक्षण और प्राथमिक उपचार:**\n\n` +
          `• **लक्षण:** आंखों में तेज जलन व लालिमा, गले में खराश/सूखापन, लगातार सूखी खांसी, सांस फूलना, और थकान।\n` +
          `• **घरेलू प्राथमिक उपचार:**\n` +
          `  1. **लवणयुक्त नेजल स्प्रे (Saline Nasal Rinse):** बाहर से आने के बाद नाक में फंसे सूक्ष्म कणों को साफ करने के लिए बहुत प्रभावी है।\n` +
          `  2. **गर्म पानी की भाप (Steam Inhalation):** श्वसन नली में जमे कफ को ढीला करती है।\n` +
          `  3. **हाइड्रेशन:** पर्याप्त गुनगुना पानी पिएं।\n` +
          `  4. **एंटीऑक्सीडेंट युक्त आहार:** गुड़, अदरक, हल्दी वाला दूध और हरी सब्जियां शरीर में सूजन कम करने में सहायक होती हैं।\n` +
          `• ⚠️ **चेतावनी:** यदि छाती में तेज दर्द, गंभीर सांस फूलना या होठों का नीला पड़ना जैसे लक्षण दिखें, तो बिना देरी किए निकटतम अस्पताल में आपातकालीन चिकित्सा लें।`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 व्यक्तिगत स्वास्थ्य योजना' }
        ]
      };
    } else {
      return {
        text: `🩺 **Clinical Symptoms & Air Pollution First-Aid Protocol:**\n\n` +
          `• **Typical Symptoms:** Ocular burning/lacrimation, persistent pharyngeal tickle/dry cough, retrosternal chest irritation, shortness of breath, and tension headaches.\n` +
          `• **Evidence-Based Relief Protocol:**\n` +
          `  1. **Hypertonic Saline Nasal Lavage:** Cleanses entrapped PM10/PM2.5 particulates from nasal cilia.\n` +
          `  2. **Warm Steam Inhalation:** Hydrates inflamed tracheobronchial airways and eases mucus clearance.\n` +
          `  3. **High Hydration & Antioxidants:** Warm fluids, honey, turmeric, and vitamin C/E mitigate systemic oxidative stress from free radicals carried on soot surfaces.\n` +
          `• ⚠️ **Red Flag Emergencies:** Sudden chest pain, oxygen saturation (SpO2) <92%, acute cyanosis, or uncontrollable asthma wheezing require urgent emergency room (ER) intervention.`,
        actions: [
          { type: 'navigate', page: 'ai-advisor', label: '🤖 Clinical Bio-Parameter Advisor' }
        ]
      };
    }
  }

  // 12. General Default Comprehensive Response
  if (isHindi) {
    return {
      text: `👋 नमस्ते! मैं **AERIS दिल्ली एआई वायु गुणवत्ता सहायक (AERIS AI Assistant)** हूँ।\n\n` +
        `वर्तमान में सक्रिय स्टेशन **${selectedStation.name}** है, जहाँ AQI **${selectedStation.aqi}** (${selectedStation.category}) और PM2.5 **${selectedStation.pm25} µg/m³** दर्ज किया गया है।\n\n` +
        `आप मुझसे दिल्ली प्रदूषण से संबंधित कुछ भी पूछ सकते हैं, उदाहरण के लिए:\n` +
        `• *"क्या आनंद विहार या रोहिणी में बाहर जाना सुरक्षित है?"*\n` +
        `• *"N95 मास्क और कपड़े के मास्क में क्या अंतर है?"*\n` +
        `• *"सर्दियों में तापमान इनवर्जन से प्रदूषण कैसे बढ़ता है?"*\n` +
        `• *"ग्रैप (GRAP) स्टेज 3 और 4 में कौन से वाहन प्रतिबंधित हैं?"*\n` +
        `• *"बच्चों और बुजुर्गों के लिए क्या सावधानियां जरूरी हैं?"*`,
      actions: [
        { type: 'navigate', page: 'overview', label: '⚡ लाइव दिल्ली डैशबोर्ड' },
        { type: 'navigate', page: 'map', label: '🗺️ मैपबॉक्स ग्रिड' }
      ]
    };
  } else {
    return {
      text: `👋 Hello! I am the **AERIS Delhi Air Quality AI Assistant**.\n\n` +
        `Currently tracking **${selectedStation.name}** where the AQI is **${selectedStation.aqi}** (${selectedStation.category}) with PM2.5 at **${selectedStation.pm25} µg/m³**.\n\n` +
        `You can ask me any air quality or health queries, such as:\n` +
        `• *"Is it safe for children to play outdoors in Dwarka today?"*\n` +
        `• *"Can I jog tomorrow morning around India Gate?"*\n` +
        `• *"Which mask actually protects against PM2.5?"*\n` +
        `• *"What are current GRAP Stage vehicle bans?"*\n` +
        `• *"Why does atmospheric inversion trap smog in Delhi?"*`,
      actions: [
        { type: 'navigate', page: 'overview', label: '⚡ Live Overview Dashboard' },
        { type: 'navigate', page: 'map', label: '🗺️ Mapbox Grid & Matrix' }
      ]
    };
  }
}

// Default Integrated Google Gemini API Key from environment
export const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Google Gemini API Caller with Resilient Model Cascade and Zero-Thinking Budget
export async function queryGeminiAPI(apiKey, prompt, context = {}) {
  const {
    stations = DELHI_STATIONS,
    selectedStation = DELHI_STATIONS[0],
    language = 'en'
  } = context;

  const activeKey = apiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;
  if (!activeKey) {
    throw new Error('No Gemini API key available.');
  }

  const stationContext = stations.slice(0, 12).map(s => 
    `• ${s.name} (AQI: ${s.aqi}, PM2.5: ${s.pm25} µg/m³, Status: ${s.category}, PBL: ${s.pblHeight}m, Wind: ${s.windSpeed} km/h ${s.windDirectionText})`
  ).join('\n');

  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(prompt);

  const systemInstruction = `You are AERIS AI, an elite Delhi NCR environmental science, air quality and pulmonology intelligence assistant.
Target Language: ${isHindi ? 'Hindi (हिन्दी)' : 'English'}.

Live Delhi NCR Telemetry Context:
• Active Station: ${selectedStation.name}
• AQI: ${selectedStation.aqi} (${selectedStation.category})
• PM2.5: ${selectedStation.pm25} µg/m³ (WHO 24h safe threshold is 15 µg/m³)
• PM10: ${selectedStation.pm10} µg/m³ | Temperature: ${selectedStation.temp}°C | Humidity: ${selectedStation.humidity}%
• Planetary Boundary Layer (PBL): ${selectedStation.pblHeight}m (Thermal inversion trapping: ${selectedStation.inversionStrength}%)
• Wind: ${selectedStation.windSpeed} km/h (${selectedStation.windDirectionText})

Regional Grid Telemetry:
${stationContext}

CRITICAL RULES FOR CLEAN & PRECISE RESPONSES (NEVER CUT OFF):
1. COMPLETE RESPONSES ONLY: Every answer must be 100% complete and conclude with a finished, definitive closing sentence. Never cut off mid-thought or mid-sentence.
2. CONCISE & POLISHED: Deliver a sharp, high-yield answer between 80 and 160 words.
3. DIRECT VERDICT FIRST: Begin immediately with a 1-sentence conclusive diagnosis referencing current AQI/PM2.5.
4. STRUCTURED BULLETS: Organize key takeaways into 2 to 3 bullet points using "• " with bold topic labels (e.g., "• **Outdoor Safety:** ...", "• **Mask Protocol:** Certified N95 only...").
5. EVIDENCE-BASED & SPECIFIC:
   - For children & seniors: state specific vulnerability and indoor air thresholds.
   - For morning exercise: note that winter morning inversion traps PM2.5 near the ground; recommend waiting until afternoon when PBL expands.
   - For masks: explain that cloth/surgical masks fail against fine PM2.5; only certified N95/FFP2 with airtight seal filters 95%+.
   - For home: specify true HEPA H13 filtration and keep windows sealed during high smog hours.
6. CLEAN FORMATTING: Do not output broken headers, raw asterisks, or disclaimers like "As an AI model...". Keep the tone expert, helpful, and reassuring.`;

  // Resilient model cascade: try gemini-3.5-flash with zero thinking budget, then flash-lite, then standard flash
  const candidateConfigs = [
    { model: 'gemini-3.5-flash', withThinkingBudget: true, label: 'Gemini 3.5' },
    { model: 'gemini-3.5-flash-lite', withThinkingBudget: false, label: 'Gemini 3.5 Lite' },
    { model: 'gemini-3.5-flash', withThinkingBudget: false, label: 'Gemini 3.5' },
    { model: 'gemini-flash-latest', withThinkingBudget: false, label: 'Gemini Flash' }
  ];

  let lastError = null;

  for (const config of candidateConfigs) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${activeKey}`;
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nCitizen Query: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      };

      if (config.withThinkingBudget) {
        requestBody.generationConfig.thinkingConfig = {
          thinkingBudget: 0
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        const fullText = parts.map(p => p.text || '').filter(Boolean).join('\n').trim();

        if (fullText && fullText.length > 30) {
          let finalText = fullText;
          const validEndings = ['.', '!', '?', '।', ')', '}', ']', '"', "'", '*'];
          const lastChar = finalText.slice(-1);

          // If text ends abruptly without terminal punctuation, ensure a clean complete ending
          if (!validEndings.includes(lastChar)) {
            const lastPeriod = Math.max(
              finalText.lastIndexOf('.'),
              finalText.lastIndexOf('!'),
              finalText.lastIndexOf('?'),
              finalText.lastIndexOf('।')
            );
            if (lastPeriod > 40) {
              finalText = finalText.substring(0, lastPeriod + 1).trim();
            } else if (candidate?.finishReason === 'MAX_TOKENS') {
              // Too short after trimming, try next model in cascade
              continue;
            }
          }

          return {
            text: finalText,
            isGemini: true,
            model: config.label,
            actions: [
              { type: 'select-station', stationId: selectedStation.id, label: `📍 ${selectedStation.shortName} AQI` },
              { type: 'navigate', page: 'ai-advisor', label: isHindi ? '🤖 स्वास्थ्य सलाहकार' : '🤖 Health Advisor' }
            ]
          };
        }
      } else {
        const errText = await response.text();
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API.');
}
