import React, { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';

export default function NavigationFlowGuideModal({ isOpen, onClose, onNavigate }) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  const [activePersonaTab, setActivePersonaTab] = useState('citizen');
  const [activeTopicCategory, setActiveTopicCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

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

  if (!isOpen) return null;

  // 4 Guided User Pathways (Start-to-End Journeys)
  const personas = [
    {
      id: 'citizen',
      title: isHindi ? '👨‍👩‍👧 दिल्ली नागरिक व परिवार यात्रा' : '👨‍👩‍👧 Citizen & Family Daily Protection',
      subtitle: isHindi ? 'सुबह उठने से लेकर सोने तक वायु सुरक्षा का संपूर्ण चक्र' : 'Complete daily protection cycle from waking up to bedtime',
      badge: isHindi ? 'दैनिक सुरक्षा' : 'Daily Life',
      badgeColor: '#059669',
      steps: [
        {
          step: 1,
          pageId: 'overview',
          title: isHindi ? '1. लाइव CPCB AQI व आपातकालीन निर्देश देखें' : '1. Check Live CPCB AQI & Citizen Directives',
          desc: isHindi
            ? 'अपनी स्थानीय कॉलोनी (जैसे आनंद विहार, द्वारका) का AQI, स्वास्थ्य श्रेणी और ध्वनि/आवाज़ में सुरक्षा निर्देश सुनें।'
            : 'Inspect your local station AQI, hazard level, and listen to synthesized voice alerts and atmospheric sonification.',
          actionLabel: isHindi ? 'ओवरव्यू खोलें' : 'Open Overview'
        },
        {
          step: 2,
          pageId: 'ai-advisor',
          title: isHindi ? '2. व्यक्तिगत स्वास्थ्य सलाह व एयर प्यूरीफायर साइजिंग' : '2. Personal Health Advice & Air Purifier CADR',
          desc: isHindi
            ? 'अपनी आयु, आउटडोर समय और गतिविधि दर्ज करें। बच्चों व बुजुर्गों के लिए फेफड़ों का सिगरेट-तुल्य डोज़ और कमरे के लिए HEPA प्यूरीफायर CADR गणना करें।'
            : 'Set your age, outdoor hours, and health profile (Asthma, Child, Athlete). Compute inhaled PM2.5 micrograms, cigarette equivalent, and calculate exact room HEPA CADR.',
          actionLabel: isHindi ? 'स्वास्थ्य सलाहकार खोलें' : 'Open Health Advisor'
        },
        {
          step: 3,
          pageId: 'overview',
          title: isHindi ? '3. डायूरनल आउटडोर विंडो ऑप्टिमाइज़र' : '3. Check Diurnal Safe Outdoor Window',
          desc: isHindi
            ? 'दिन के 24 घंटों में सबसे कम प्रदूषण वाले घंटे देखें ताकि सुबह की सैर, बच्चों के खेलने या खरीदारी के समय को सुरक्षित रखा जा सके।'
            : 'Identify the safest hours of the day when solar boundary layer expansion clears surface smog for errands or exercise.',
          actionLabel: isHindi ? 'सुरक्षित समय देखें' : 'View Safe Windows'
        },
        {
          step: 4,
          pageId: 'layman',
          title: isHindi ? '4. सरल भाषा गाइड व मास्क चयन विज़ार्ड' : '4. Air Simplified Guide & N95 Mask Wizard',
          desc: isHindi
            ? 'कपड़े के मास्क बनाम N95 की प्रभावशीलता जांचें, खांसी-गले के लक्षणों का समाधान देखें और दिल्ली प्रदूषण से जुड़े मिथकों से बचें।'
            : 'Compare cloth vs surgical vs N95 masks, understand PM2.5 alveolar penetration, check respiratory symptoms, and read debunked myths.',
          actionLabel: isHindi ? 'सरल गाइड पढ़ें' : 'Read Easy Guide'
        },
        {
          step: 5,
          pageId: 'chatbot',
          title: isHindi ? '5. AERIS एआई चैटबॉट से व्यक्तिगत प्रश्न पूछें' : '5. Ask AERIS AI AQI Assistant Questions',
          desc: isHindi
            ? 'दवाइयों, GRAP पाबंदियों या परिवार की सुरक्षा पर हिंदी या अंग्रेजी में प्राकृतिक संवाद कर तुरंत समाधान पाएं।'
            : 'Have a 2-way conversation in English or Hindi about GRAP rules, school closures, pregnancy precautions, and air filters.',
          actionLabel: isHindi ? 'एआई चैटबॉट खोलें' : 'Open AI Chatbot'
        }
      ]
    },
    {
      id: 'commuter',
      title: isHindi ? '🚗 दैनिक यात्री व ऑफिस रूट योजना' : '🚗 Office Commuter & Transit Planner',
      subtitle: isHindi ? 'सड़क के जहरीले धुएं से फेफड़ों को बचाते हुए यात्रा मार्ग चुनें' : 'Minimize toxic inhaled particulate dose during rush hours',
      badge: isHindi ? 'यात्रा अनुकूलन' : 'Commute Route',
      badgeColor: '#0284c7',
      steps: [
        {
          step: 1,
          pageId: 'overview',
          title: isHindi ? '1. दिल्ली NCR हॉटस्पॉट व औसत AQI का अवलोकन' : '1. Regional Hotspots & Locality Check',
          desc: isHindi
            ? 'जांचें कि आपके प्रस्थान और गंतव्य क्षेत्रों में प्रदूषण कितना गंभीर है (जैसे पूर्वी दिल्ली बनाम मध्य दिल्ली)।'
            : 'Check aggregate NCR air quality and identify peak smog corridors before stepping out of the house.',
          actionLabel: isHindi ? 'हॉटस्पॉट देखें' : 'Check Hotspots'
        },
        {
          step: 2,
          pageId: 'route-planner',
          title: isHindi ? '2. रूट एक्सपोज़र प्लानर: मेट्रो बनाम कैब बनाम बाइक' : '2. Commute Exposure Planner: Metro vs Cab vs Bike',
          desc: isHindi
            ? 'अपना स्रोत और गंतव्य स्टेशन चुनें। दिल्ली मेट्रो (वातानुकूलित व फ़िल्टर्ड), एसी कार, और मोटरसाइकिल के इनहेल्ड PM2.5 डोज़ की तुलना करें।'
            : 'Select origin and destination. Compare Metro (82% filtration) vs AC Cab vs Two-Wheeler. See exact micrograms of toxic soot inhaled and time taken.',
          actionLabel: isHindi ? 'यात्रा प्लानर खोलें' : 'Open Route Planner'
        },
        {
          step: 3,
          pageId: 'route-planner',
          title: isHindi ? '3. समय के अनुसार इनवर्जन प्रभाव (सुबह बनाम दोपहर बनाम शाम)' : '3. Time-of-Day Departure Optimization',
          desc: isHindi
            ? 'सुबह 8 बजे का इनवर्जन कैप (अधिकतम प्रदूषण) बनाम दोपहर 2 बजे (धूप से फैला हुआ साफ समय) चुनकर यात्रा का समय अनुकूलित करें।'
            : 'Simulate departure times: morning rush hour has peak nocturnal inversion; afternoon has thermal plume dispersion.',
          actionLabel: isHindi ? 'समय प्रभाव जांचें' : 'Inspect Time Factors'
        },
        {
          step: 4,
          pageId: 'layman',
          title: isHindi ? '4. यात्रा सुरक्षा चेकलिस्ट व N95 सील टेस्ट' : '4. Commuter Mask Fit & Vehicle Recirculation Check',
          desc: isHindi
            ? 'कार में आंतरिक रीसर्कुलेशन ऑन रखें और बाइक/ऑटो में N95 मास्क की टाइट फिटिंग सुनिश्चित करें।'
            : 'Ensure proper facial seal for N95 masks on two-wheelers and keep vehicle AC on internal cabin air recirculation.',
          actionLabel: isHindi ? 'मास्क गाइड देखें' : 'View Mask Guide'
        }
      ]
    },
    {
      id: 'scientist',
      title: isHindi ? '🔬 वायुमंडलीय वैज्ञानिक व शोधकर्ता' : '🔬 Atmospheric Scientist & Researcher',
      subtitle: isHindi ? 'WRF-Chem भौतिकी, इनवर्जन सिमुलेटर और न्यूरल मॉडल्स' : 'Coupled WRF-Chem physics, PBL dynamics, and PINN neural modeling',
      badge: isHindi ? 'गहन विज्ञान' : 'Deep Science',
      badgeColor: '#7c3aed',
      steps: [
        {
          step: 1,
          pageId: 'map',
          title: isHindi ? '1. मैपबॉक्स वेक्टर ग्रिड व पराली धुआं वेक्टर्स' : '1. Mapbox High-Res Grid & Stubble Wind Vectors',
          desc: isHindi
            ? 'दिल्ली के सभी 16 स्टेशनों का मैप, उत्तर-पश्चिमी पराली धुएं का प्रवाह और सेंसर मैट्रिक्स टेबल में डेटा सॉर्ट करें।'
            : 'Examine all 16 CPCB monitoring stations on vector tiles with animated wind vectors and stubble biomass plumes.',
          actionLabel: isHindi ? 'मैप खोलें' : 'Open Map Grid'
        },
        {
          step: 2,
          pageId: 'forecast',
          title: isHindi ? '2. 72-घंटे WRF-Chem प्रति घंटा पूर्वानुमान व नीतियां' : '2. 72-Hour Coupled WRF-Chem Forecast & Policy',
          desc: isHindi
            ? 'प्रति घंटा टाइमलाइन स्क्रबर चलाएं, PBL ऊंचाई और PM2.5 देखें। ऑड-ईवन, पराली रोक और कृत्रिम बारिश का सिमुलेशन करें।'
            : 'Scrub 72h hourly timeline. Toggle metrics (AQI, PM2.5, Boundary Layer Lid, Wind). Simulate Odd-Even, stubble bans, and precipitation washout.',
          actionLabel: isHindi ? 'पूर्वानुमान खोलें' : 'Open Forecast'
        },
        {
          step: 3,
          pageId: 'inversion',
          title: isHindi ? '3. 2D वायुमंडलीय इनवर्जन व रिचर्डसन संख्या' : '3. 2D Boundary Layer Inversion & Richardson Number',
          desc: isHindi
            ? 'कैनवास पर 2D क्रॉस-सेक्शन देखें: कैसे रात की ठंड से धुआं 300m के नीचे फंसता है और धूप रुकने से प्रदूषण का चक्र गहराता है।'
            : 'Simulate nocturnal ground radiative cooling, smog entrapment lid, Richardson number (Ri > 0.25), and anti-smog water cannons.',
          actionLabel: isHindi ? 'इनवर्जन सिमुलेटर खोलें' : 'Open Inversion Sandbox'
        },
        {
          step: 4,
          pageId: 'ai-lab',
          title: isHindi ? '4. AI/ML न्यूरल स्टूडियो: PINN व रिसेप्टर मॉडल' : '4. AI/ML Neural Studio: PINN & Receptor Model',
          desc: isHindi
            ? 'IIT कानपुर रिसेप्टर मॉडल से पराली/गाड़ी/धूल के अनुपात घटाएं, PINN इनवर्जन ब्रेकडाउन और सेंसर एनोमली टेस्ट करें।'
            : 'Run IIT Kanpur Chemical Mass Balance source apportionment throttles, test PINN thermal buoyancy breakdown, and detect sensor drift.',
          actionLabel: isHindi ? 'न्यूरल स्टूडियो खोलें' : 'Open Neural Studio'
        }
      ]
    },
    {
      id: 'auditor',
      title: isHindi ? '🏛️ पर्यावरण ऑडिटर व नीति निर्माता' : '🏛️ Environmental Auditor & Policy Maker',
      subtitle: isHindi ? 'क्रिप्टोग्राफिक ऑडिट, GRAP अनुपालन व आधिकारिक रिपोर्ट' : 'Cryptographic ledger verification, GRAP enforcement, and official reports',
      badge: isHindi ? 'शासन व सत्यता' : 'Governance',
      badgeColor: '#ea580c',
      steps: [
        {
          step: 1,
          pageId: 'overview',
          title: isHindi ? '1. CPCB सब-इंडेक्स सत्यापन व हॉटस्पॉट पहचान' : '1. CPCB Sub-Index Verification & Hotspot Audit',
          desc: isHindi
            ? 'PM2.5, PM10, NOx, SO2, CO और ओजोन के प्रमाणित CPCB NAQI सब-इंडेक्स का निरीक्षण करें।'
            : 'Verify authentic multi-pollutant sub-indices across PM2.5, PM10, NOx, SO2, CO, and O3 under CPCB standards.',
          actionLabel: isHindi ? 'ओवरव्यू खोलें' : 'Open Overview'
        },
        {
          step: 2,
          pageId: 'overview',
          title: isHindi ? '2. आधिकारिक पर्यावरण ऑडिट रिपोर्ट प्रिंट/PDF तैयार करें' : '2. Generate Official Environmental Telemetry Audit Certificate',
          desc: isHindi
            ? 'आधिकारिक CPCB मुहर, स्टेशन निर्देशांक, और स्वास्थ्य निष्कर्षों के साथ प्रिंट-योग्य कानूनी ऑडिट रिपोर्ट बनाएं।'
            : 'Generate a print-ready legal telemetry audit with timestamp, station coordinates, sensor metrics, and regulatory signatures.',
          actionLabel: isHindi ? 'ऑडिट रिपोर्ट खोलें' : 'Open Audit Report'
        },
        {
          step: 3,
          pageId: 'blockchain',
          title: isHindi ? '3. AeroLedger ब्लॉकचेन: मर्कल ट्री व एंटी-टैम्पर टेस्ट' : '3. AeroLedger Blockchain: Merkle Roots & Fraud Sandbox',
          desc: isHindi
            ? 'दिल्ली के सभी 16 नोड्स के SHA-256 हैश, मर्कल रूट और सेंसर में छेड़छाड़ का परीक्षण करके डेटा की प्रामाणिकता जांचें।'
            : 'Inspect immutable SHA-256 block ledger, verify Merkle roots for all 16 Delhi nodes, and inject malicious readings to test fraud detection.',
          actionLabel: isHindi ? 'ब्लॉकचेन लेजर खोलें' : 'Open AeroLedger'
        },
        {
          step: 4,
          pageId: 'forecast',
          title: isHindi ? '4. ग्रैप (GRAP) स्टेज अनुपालन व आपातकालीन सिमुलेशन' : '4. GRAP Emergency Policy Scenario Simulator',
          desc: isHindi
            ? 'GRAP 3 और 4 पाबंदियों (निर्माण रोक, गाड़ियों पर प्रतिबंध, वाटर कैनन) का 72-घंटे के प्रदूषण प्रक्षेपवक्र पर प्रभाव देखें।'
            : 'Simulate emergency interventions (Odd-Even vehicle ration, cloud seeding, stubble bans) to determine timing for public advisories.',
          actionLabel: isHindi ? 'नीति सिमुलेटर खोलें' : 'Open Policy Simulator'
        }
      ]
    }
  ];

  // Complete Catalog of All 10 Features & Topics Covered
  const featuresCatalog = [
    {
      id: 'overview',
      category: 'live',
      name: isHindi ? 'ओवरव्यू व लाइव AQI डैशबोर्ड' : 'Overview & Live AQI Dashboard',
      icon: '⚡',
      summary: isHindi
        ? 'वास्तविक समय CPCB NAQI डेटा, सक्रिय अलर्ट, ध्वनि/आवाज़ चेतावनियां, सिगरेट-तुल्य डोज़, डायूरनल विंडो और प्रदूषण स्रोत।'
        : 'Real-time authenticated CPCB NAQI calculation, active hazard alerts, audio sonification, cigarette equivalent, diurnal windows, and source fingerprinting.',
      topics: [
        isHindi ? 'CPCB NAQI 6-प्रदूषक गणना (PM2.5, PM10, NOx, SO2, CO, O3)' : 'CPCB NAQI 6-pollutant dynamic calculation (PM2.5, PM10, NOx, SO2, CO, O3)',
        isHindi ? 'प्लैनेटरी बाउंड्री लेयर (PBL) इनवर्जन ढक्कन ऊंचाई (उदा. 320m)' : 'Planetary Boundary Layer (PBL) nocturnal inversion lid height (e.g. 320m)',
        isHindi ? 'दिल्ली NCR औसत AQI, उच्चतम हॉटस्पॉट बनाम सबसे स्वच्छ क्षेत्र' : 'Delhi NCR aggregate mean AQI, highest hotspot vs cleanest station',
        isHindi ? 'ध्वनि संश्लेषण (Acoustic Tone) व वेब स्पीच आवाज़ आपातकालीन चेतावनी' : 'Atmospheric frequency sonification & Web Speech voice safety alert',
        isHindi ? 'बर्कले अर्थ सिगरेट-तुल्य डोज़ व WHO 24h सीमा गुणक' : 'Berkeley Earth cigarette equivalent dose & WHO limit multiplier',
        isHindi ? 'सुरक्षित आउटडोर समय ऑप्टिमाइज़र व प्रदूषण स्रोत अनुपात' : 'Diurnal Safe Outdoor Window Optimizer & pollution source attribution',
        isHindi ? 'आधिकारिक मुहरबंद पर्यावरण ऑडिट रिपोर्ट (Print-Ready Certificate)' : 'Official environmental telemetry audit report generator'
      ],
      howToUse: isHindi
        ? '1. सर्च बार में अपनी कॉलोनी चुनें या पिन किए गए स्टेशन पर क्लिक करें।\n2. रियल-टाइम अलर्ट बैनर पर "ध्वनि सुनें" या "आवाज़ चेतावनी" चलाएं।\n3. सिगरेट-तुल्य डोज़ और सुरक्षित आउटडोर विंडो का निरीक्षण करें।'
        : '1. Select locality in search box or click a pinned station.\n2. Click "Sonify" or "Voice Alert" in the alert banner for multi-sensory notification.\n3. Check cigarette equivalent dose and plan errands using the Safe Outdoor Window card.'
    },
    {
      id: 'map',
      category: 'live',
      name: isHindi ? 'मैपबॉक्स ग्रिड व डेटा मैट्रिक्स' : 'Mapbox Grid & Station Matrix',
      icon: '🗺️',
      summary: isHindi
        ? 'दिल्ली के सभी 16 स्टेशनों का उच्च-रिज़ॉल्यूशन वेक्टर मैप, उत्तर-पश्चिमी पराली हवा के वेक्टर्स, और विस्तृत सेंसर डेटा टेबल।'
        : 'Interactive Leaflet vector tiles of all 16 CPCB monitoring nodes with animated stubble smoke advection plumes and data matrix.',
      topics: [
        isHindi ? 'दिल्ली NCR के 16 स्टेशनों का भौगोलिक मानचित्रण' : 'Geographic mapping of all 16 Delhi NCR CPCB stations',
        isHindi ? 'उत्तर-पश्चिम से पराली धुएं के वायु प्रवाह वेक्टर्स (Animated Wind Plumes)' : 'Animated North-West agricultural stubble smoke wind vectors',
        isHindi ? 'रंग-कोडेड NAQI जोखिम मार्कर व इंटरैक्टिव स्टेशन पॉपअप' : 'Color-coded NAQI hazard markers & interactive station detail popups',
        isHindi ? 'स्टेशनों की खोज, सॉर्टिंग और तुलना चयन' : 'Live sensor data matrix table with multi-column sorting & search',
        isHindi ? 'नया कस्टम स्टेशन या तात्कालिक रीडिंग जोड़ने की सुविधा' : 'Add custom station or handheld sensor reading with lat/lng coordinates'
      ],
      howToUse: isHindi
        ? '1. मैप पर किसी भी स्टेशन मार्कर पर क्लिक करके विस्तृत डेटा देखें।\n2. पराली धुएं के प्रवाह को देखने के लिए हवा के तीर देखें।\n3. टेबल से किसी भी स्टेशन को पिन करें या तुलना में जोड़ें।'
        : '1. Click any marker on the map to open station telemetry popup.\n2. Observe animated wind vectors indicating stubble smoke trajectory into Delhi.\n3. Use table below to sort by AQI or add stations to comparison dock.'
    },
    {
      id: 'compare',
      category: 'live',
      name: isHindi ? 'स्टेशन तुलना डॉक व विश्लेषण' : 'Side-by-Side Station Comparison',
      icon: '⚖️',
      summary: isHindi
        ? 'एक साथ 4 स्टेशनों के AQI, प्रदूषकों, मौसम और फेफड़ों के जोखिम की आमने-सामने तुलना।'
        : 'Compare up to 4 stations side-by-side across AQI, sub-indices, micro-particulate disparity, and export to CSV/JSON.',
      topics: [
        isHindi ? '4 स्टेशनों की बहु-पैरामीटर तुलना (AQI, PM2.5, PM10, NOx, SO2, CO, O3, PBL)' : '4-station side-by-side multi-pollutant comparison grid',
        isHindi ? 'प्रदूषण अंतर (Delta Disparity Score & % Gap)' : 'Pollution disparity gap between cleanest and dirtiest selected stations',
        isHindi ? 'फेफड़ों में जाने वाले सूक्ष्म कणों का अंतर' : 'Comparative inhaled micro-gram particulate exposure and vulnerability',
        isHindi ? 'डेटा को CSV और JSON में एक्सपोर्ट करने की सुविधा' : 'Direct export of comparison table to CSV or JSON formats'
      ],
      howToUse: isHindi
        ? '1. किसी भी स्टेशन कार्ड पर "⚖️ Compare" बटन दबाएं (अधिकतम 4)।\n2. नीचे फ्लोटिंग डॉक से "तुलना देखें" दबाएं।\n3. दोनों क्षेत्रों के प्रदूषण अंतर का विश्लेषण करें।'
        : '1. Click "⚖️ Compare" on any station card (up to 4 stations).\n2. Click "View Comparison" in the floating dock or top navigation.\n3. Inspect side-by-side metric tables and export data.'
    },
    {
      id: 'ai-advisor',
      category: 'citizen',
      name: isHindi ? 'AeroAI स्वास्थ्य सलाहकार व बायो-डोसिमेट्री' : 'AeroAI Health Advisor & Bio-Dosimetry',
      icon: '🤖',
      summary: isHindi
        ? 'व्यक्तिगत आयु, गतिविधि और मास्क प्रकार के आधार पर फेफड़ों में जमा होने वाले PM2.5 का सटीक आकलन और HEPA प्यूरीफायर CADR गणना।'
        : 'Personal bio-dosimetry estimating inhaled PM2.5 mass dose, vulnerability profiles, and room HEPA purifier CADR sizing.',
      topics: [
        isHindi ? '5 व्यक्तिगत स्वास्थ्य प्रोफाइल (सामान्य वयस्क, बच्चे व बुजुर्ग, दमा/COPD, एथलीट, गर्भवती महिलाएं)' : '5 Health profiles: General, Children/Elderly, Asthma/COPD, Athlete, Expectant Mothers',
        isHindi ? 'व्यक्तिगत बायो-पैरामीटर (आयु, आउटडोर घंटे, शारीरिक श्रम स्तर)' : 'Custom bio-parameters: User age, outdoor hours, exertion intensity',
        isHindi ? 'मास्क सुरक्षा कारक (कपड़ा 20%, सर्जिकल 45%, N95 95%)' : 'Mask protection factors (Cloth 20%, Surgical 45%, N95 95%)',
        isHindi ? 'कमरे का HEPA एयर प्यूरीफायर साइजिंग व CADR (m³/h और CFM) आवश्यकता' : 'Room HEPA air purifier CADR calculator based on room sq ft and ceiling height',
        isHindi ? '24-घंटे का डायूरनल टाइमलाइन व प्रति घंटा फेफड़ों का जोखिम' : '24-hour diurnal timeline with hour-by-hour alveolar smoke exposure',
        isHindi ? 'नागरिक अनुपालन चेकलिस्ट (Compliance Checklist) व JSON एक्सपोर्ट' : 'Actionable citizen compliance checklist with persistent checks'
      ],
      howToUse: isHindi
        ? '1. अपनी स्वास्थ्य प्रोफाइल (उदा. दमा या सामान्य वयस्क) चुनें।\n2. अपनी आयु, बाहर बिताए जाने वाले घंटे और मास्क का प्रकार सेट करें।\n3. अपने कमरे का क्षेत्रफल (वर्ग फुट) डालकर न्यूनतम प्यूरीफायर CADR जानें।'
        : '1. Select your vulnerability profile (e.g. Asthma or Child).\n2. Adjust age slider, daily outdoor hours, and mask type.\n3. Enter room dimensions (sq ft & ceiling height) to get recommended HEPA CADR.'
    },
    {
      id: 'route-planner',
      category: 'citizen',
      name: isHindi ? 'सुरक्षित यात्रा व रूट एक्सपोज़र प्लानर' : 'Commute Exposure & Transit Route Planner',
      icon: '🧭',
      summary: isHindi
        ? 'दिल्ली में यात्रा के दौरान मेट्रो, एसी कैब, और बाइक के इनहेल्ड PM2.5 डोज़ की तुलना कर सबसे सुरक्षित मार्ग चुनें।'
        : 'Compare Metro vs AC Cab vs Two-Wheeler transit modes to minimize inhaled particulate dose during rush hours.',
      topics: [
        isHindi ? 'स्रोत और गंतव्य स्टेशन के बीच सड़क दूरी व समय गणना' : 'Origin-to-destination road distance and duration calculation',
        isHindi ? 'प्रस्थान समय इनवर्जन कारक (सुबह का रश आवर बनाम दोपहर की धूप बनाम शाम)' : 'Departure timing inversion factor: morning peak vs afternoon clearing vs evening smog',
        isHindi ? '4 परिवहन साधनों की इनडोर हवा गुणवत्ता (मेट्रो 42 µg/m³ बनाम बाइक 250+ µg/m³)' : 'Indoor air quality per mode: Metro HVAC filtration vs Cab recirculation vs Two-Wheeler road exposure',
        isHindi ? 'फेफड़ों में जाने वाले विषाक्त कणों (माइक्रोग्राम PM2.5) की सटीक मात्रा' : 'Exact inhaled micro-gram PM2.5 mass dose per commute leg',
        isHindi ? 'मेट्रो चुनने पर होने वाली फेफड़ों की बचत (% Lung Exposure Savings)' : 'Percentage particulate savings achieved by choosing Metro over road transit'
      ],
      howToUse: isHindi
        ? '1. प्रस्थान स्टेशन और गंतव्य स्टेशन चुनें।\n2. प्रस्थान का समय (सुबह, दोपहर, या शाम) सेट करें।\n3. देखें कि मेट्रो चुनने से आपके फेफड़ों में कितना कम धुआं पहुंचेगा।'
        : '1. Select your origin and destination localities.\n2. Choose departure time (morning rush hour, afternoon, or evening).\n3. Compare inhaled dose and see that Metro eliminates ~82% of toxic road particulates.'
    },
    {
      id: 'layman',
      category: 'citizen',
      name: isHindi ? 'प्रदूषण की आसान गाइड (द्विभाषी)' : 'Air Simplified Guide (Bilingual)',
      icon: '📖',
      summary: isHindi
        ? 'सार्वभौमिक रंग कोड, PM2.5 बनाम बाल की मोटाई, मास्क चयन विज़ार्ड, लक्षण गाइड और भ्रांतियों का निवारण।'
        : 'Universal color codes, PM2.5 vs hair cross-section analogy, interactive mask wizard, symptom diagnostics, and myth busters.',
      topics: [
        isHindi ? 'यूनिवर्सल एयर क्वालिटी रंग सुरक्षा कोड (हरा, पीला, नारंगी, लाल, बैंगनी, मैरून)' : 'Universal color safety scale (Green, Yellow, Orange, Red, Severe Purple, Hazardous Maroon)',
        isHindi ? 'PM2.5 क्या है? मानव बाल की तुलना में सूक्ष्मता और रक्तप्रवाह में प्रवेश' : 'What is PM2.5? Comparison with human hair and blood-barrier penetration',
        isHindi ? 'मास्क क्षमता परीक्षक (कपड़ा रुमाल, सर्जिकल, N95, P100)' : 'Interactive Mask Filtration Efficiency Wizard (Cloth, Surgical, N95, P100)',
        isHindi ? 'लक्षण गाइड (गले में खराश, आंखों में जलन, सीने में जकड़न)' : 'Symptom diagnostic checker and at-home clinical mitigation tips',
        isHindi ? 'दिल्ली प्रदूषण से जुड़े 4 प्रमुख मिथक और उनकी वैज्ञानिक सच्चाई' : 'Delhi smog myth busters (N95 washing, snake plants, morning jogs, AC recirculation)'
      ],
      howToUse: isHindi
        ? '1. विभिन्न रंगों के AQI स्तरों और उनके प्रभाव को पढ़ें।\n2. मास्क विज़ार्ड में विभिन्न मास्क की फिल्ट्रेशन क्षमता की तुलना करें।\n3. मिथक बस्टर्स पढ़कर जानें कि N95 को धोना क्यों गलत है।'
        : '1. Review the color safety scale to memorize healthy vs hazardous ranges.\n2. Click through the Mask Wizard to understand why surgical masks leak around edges.\n3. Read the myth busters to avoid common mistakes like washing N95 respirators.'
    },
    {
      id: 'chatbot',
      category: 'citizen',
      name: isHindi ? 'AERIS दिल्ली एआई वायु परामर्शदाता' : 'AERIS Delhi Air Quality AI Assistant',
      icon: '💬',
      summary: isHindi
        ? 'प्राकृतिक भाषा में संवाद करने वाला एआई सलाहकार जो CPCB टेलीमेट्री और नैदानिक दिशानिर्देशों से लैस है।'
        : 'Conversational AI assistant answering medical, lifestyle, and regulatory air quality queries with live context.',
      topics: [
        isHindi ? 'हिंदी और अंग्रेजी में प्राकृतिक बातचीत' : 'Full natural language dialogue in English & Hindi',
        isHindi ? 'लाइव स्टेशन टेलीमेट्री संदर्भ का स्वचालित समावेश' : 'Automatic active station telemetry context injection (AQI, PBL, wind)',
        isHindi ? 'तैयार नागरिक प्रश्न चिप्स (मास्क, स्कूल, प्यूरीफायर, ग्रैप नियम)' : 'Instant citizen prompt chips for children, exercise, and purifier selection',
        isHindi ? 'शीर्ष नागरिक प्रश्न व वैज्ञानिक उत्तर' : 'Curated FAQ hub covering N95 reuse, thermal inversion, indoor plants, and GRAP-3'
      ],
      howToUse: isHindi
        ? '1. चैटबॉट में अपना कोई भी प्रश्न टाइप करें या रेडीमेड चिप पर क्लिक करें।\n2. तुरंत वैज्ञानिक व चिकित्सीय सलाह प्राप्त करें।\n3. संबंधित टूल पर जाने के लिए नेविगेशन शॉर्टकट का उपयोग करें।'
        : '1. Type any custom health or smog question or click a prompt preset.\n2. Receive scientifically referenced guidance tailored to active Delhi air.\n3. Use in-chat action buttons to jump to the Route Planner or Health Advisor.'
    },
    {
      id: 'forecast',
      category: 'science',
      name: isHindi ? '72-घंटे पूर्वानुमान व नीति सिमुलेटर' : '72-Hour Forecast & Policy Simulator',
      icon: '⏳',
      summary: isHindi
        ? 'कपलड WRF-Chem प्रति घंटा पूर्वानुमान, टाइमलाइन ऑटो-प्ले, और ऑड-ईवन/पराली/बारिश का नीति सिमुलेशन।'
        : '72-hour coupled WRF-Chem trajectory scrubber, policy interventions (Odd-Even, Stubble ban, Rain washout), and CSV/JSON export.',
      topics: [
        isHindi ? '72-घंटे की प्रति घंटा वायु गुणवत्ता व मौसम प्रक्षेपवक्र' : '72-hour coupled WRF-Chem weather-chemistry hourly forecast',
        isHindi ? 'ऑटो-प्ले टाइमलाइन स्क्रबर (1x, 2x, 4x प्लेबैक स्पीड)' : 'Interactive timeline scrubber with multi-speed auto-play animation',
        isHindi ? 'बहु-ट्रैक मेट्रिक स्विच (AQI, PM2.5, बाउंड्री लेयर ऊंचाई, तापमान, हवा गति)' : 'Multi-track metric toggle: AQI, PM2.5, Boundary Layer Lid, Temp, Wind',
        isHindi ? '4 नीतिगत परिदृश्य (पराली रोक, ऑड-ईवन, स्मॉग गन, कृत्रिम बारिश)' : '4 Real-time policy scenario toggles (Stubble Ban, Odd-Even, Smog Guns, Rain Washout)',
        isHindi ? '2D कैनवास चार्ट व प्रति घंटा डेटा टेबल फ़िल्टर' : 'High-definition 2D canvas trajectory graph and filterable hourly table'
      ],
      howToUse: isHindi
        ? '1. टाइमलाइन पर प्ले बटन दबाएं या स्लाइडर को आगे-पीछे घुमाएं।\n2. "Odd-Even" या "Stubble Ban" टॉगल चालू करके प्रदूषण में कमी का सिमुलेशन देखें।\n3. शोध हेतु डेटा को CSV या JSON में डाउनलोड करें।'
        : '1. Hit "Play" on the timeline or drag the hourly scrubber across 72 hours.\n2. Toggle policy intervention switches (Odd-Even, Stubble Ban) to observe curve flattening.\n3. Export the hourly trajectory table to CSV or JSON for offline analysis.'
    },
    {
      id: 'inversion',
      category: 'science',
      name: isHindi ? 'वायुमंडलीय इनवर्जन व पराली धुआं सिमुलेटर' : 'Atmospheric Inversion Physics Simulator',
      icon: '🧪',
      summary: isHindi
        ? '2D भौतिकी क्रॉस-सेक्शन: रात की ठंड, स्मॉग द्वारा धूप रुकने का फीडबैक चक्र, और रिचर्डसन संख्या।'
        : 'Interactive 2D physics cross-section of ground radiative cooling, solar suppression feedback, and Richardson stability.',
      topics: [
        isHindi ? '2D कैनवास पर दिल्ली का वायुमंडलीय क्रॉस-सेक्शन' : 'Interactive 2D physics cross-section depicting boundary layer compression',
        isHindi ? 'रात्रि कालीन विकिरण शीतलन (Nocturnal Radiative Cooling) व थर्मल इनवर्जन ढक्कन' : 'Thermal inversion cap trapping ground-level vehicular soot and stubble smoke',
        isHindi ? 'सौर दमन फीडबैक चक्र (Solar Suppression Feedback Loop)' : 'Solar suppression feedback: particulate shade cools ground, preventing boundary layer rise',
        isHindi ? 'रिचर्डसन संख्या (Richardson Number Ri > 0.25) व वायुमंडलीय स्थिरता' : 'Gradient Richardson number stability calculation indicating laminar entrapment',
        isHindi ? 'निवारक तकनीकें (एंटी-स्मॉग वाटर गन व थर्मल कैनन)' : 'Counter-measure simulations: water mist guns vs thermal boundary layer puncturing',
        isHindi ? '4 मौसमी प्रीसेट (नवंबर स्मॉग, दिवाली फॉग, वेस्टर्न डिस्टर्बेंस, समर मिक्सिंग)' : '4 Meteorological presets (November Smog, Diwali Smoke & Fog, Western Disturbance, Summer)'
      ],
      howToUse: isHindi
        ? '1. प्रीसेट चुनें (उदा. "November Smog" या "Western Disturbance")।\n2. PBL ऊंचाई और हवा की गति स्लाइडर को बदलकर देखें कि स्मॉग कैसे फैलता या दबता है।\n3. स्मॉग गन चालू करके प्रदूषण में कमी का 2D प्रभाव देखें।'
        : '1. Click an atmospheric preset (e.g. "November Smog" or "Summer Mixing").\n2. Adjust the PBL Height and Wind Speed sliders to see smog entrapment physics in action.\n3. Activate "Anti-Smog Gun" to simulate droplet scavenging in the 2D cross-section.'
    },
    {
      id: 'ai-lab',
      category: 'science',
      name: isHindi ? 'AI/ML न्यूरल स्टूडियो व सब-लैब्स' : 'AI/ML Neural Studio & Sub-Labs',
      icon: '🧠',
      summary: isHindi
        ? 'IIT कानपुर रिसेप्टर मॉडल, PINN इनवर्जन ब्रेकडाउन, सेंसर एनोमली डिटेक्टर और काउंटरफैक्चुअल सैंडबॉक्स।'
        : 'Chemical mass balance source apportionment, Physics-Informed Neural Network (PINN), sensor anomaly detector, and counterfactual sandbox.',
      topics: [
        isHindi ? 'केमिकल मास बैलेंस व रिसेप्टर मॉडल (IIT कानपुर / CPCB वेट्स)' : 'Chemical Mass Balance & PM2.5 receptor modeling with user emission throttles',
        isHindi ? 'PINN इनवर्जन प्रिडिक्टर (सोलर इंसोलेशन W/m² व थर्मल उछाल)' : 'Physics-Informed Neural Network (PINN) predicting boundary layer breakdown',
        isHindi ? 'सेंसर एनोमली व ड्रिफ्ट डिटेक्टर (सेंसर हैंग, कैलिब्रेशन ड्रिफ्ट, स्पेसियल डाइवर्जेंस)' : 'Sensor anomaly diagnostic scoring (stuck sensors, calibration drift, spatial divergence)',
        isHindi ? 'काउंटरफैक्चुअल व्हाट-इफ सैंडबॉक्स (अस्पताल आपातकालीन भर्ती कमी मॉडल)' : 'Counterfactual what-if scenario testing (estimating avoided pediatric hospitalizations)'
      ],
      howToUse: isHindi
        ? '1. ऊपर 4 सब-टैब्स (सोर्स अपोर्शनमेंट, PINN, एनोमली, काउंटरफैक्चुअल) में से चुनें।\n2. पराली या गाड़ी घटाने के स्लाइडर चलाएं और देखें कि AQI कितना सुधरता है।\n3. एनोमली डिटेक्टर में दिल्ली के सेंसरों का स्वास्थ्य स्कोर जांचें।'
        : '1. Switch between the 4 neural sub-tabs (Source Apportionment, PINN, Sensor Anomaly, Counterfactual).\n2. Drag emission reduction throttles to see modeled PM2.5 drops.\n3. Inspect sensor diagnostic health scores across Delhi nodes.'
    },
    {
      id: 'blockchain',
      category: 'trust',
      name: isHindi ? 'AeroLedger क्रिप्टोग्राफिक ब्लॉकचेन लेजर' : 'AeroLedger Cryptographic Blockchain Ledger',
      icon: '⛓️',
      summary: isHindi
        ? 'सेंसर डेटा की अपरिवर्तनीय SHA-256 ब्लॉकचेन, 16 नोड्स का मर्कल ट्री, और सेंसर छेड़छाड़ पेनेट्रेशन टेस्ट।'
        : 'Immutable cryptographic telemetry ledger, SHA-256 block hashing, Merkle roots for all 16 stations, and anti-tamper fraud sandbox.',
      topics: [
        isHindi ? 'अपरिवर्तनीय SHA-256 ब्लॉकचेन लेजर (CPCB टेलीमेट्री रिकॉर्ड)' : 'Immutable environmental sensor ledger recording CPCB readings into cryptographic blocks',
        isHindi ? 'मर्कल ट्री संरचना (16 दिल्ली नोड्स का सिंगल रूट हैश)' : 'Merkle Tree aggregating all 16 Delhi NCR station readings into a root hash',
        isHindi ? 'एंटी-टैम्पर पेनेट्रेशन टेस्टिंग सैंडबॉक्स (सेंसर धोखाधड़ी परीक्षण)' : 'Interactive anti-tamper penetration testing sandbox (simulate malicious data alteration)',
        isHindi ? 'तत्काल क्रिप्टोग्राफिक सत्यापन विफलता (Hash Mismatch Proof)' : 'Instant visual demonstration of cryptographic invalidation when data is manipulated'
      ],
      howToUse: isHindi
        ? '1. ब्लॉकचेन लेजर में नवीनतम ब्लॉक्स और उनके SHA-256 हैश देखें।\n2. मर्कल ट्री में 16 स्टेशनों के हैश नोड्स का निरीक्षण करें।\n3. "Fraud Simulation" में किसी ब्लॉक का डेटा बदलने की कोशिश करें और देखें कि ब्लॉकचेन तुरंत लाल होकर छेड़छाड़ पकड़ लेती है।'
        : '1. Browse the sequential block list and check previous hash linkage.\n2. Inspect the Merkle tree visualization aggregating 16 Delhi stations.\n3. In the Anti-Tamper Sandbox, try to modify an AQI value to watch the cryptographic signature immediately break and turn red.'
    }
  ];

  const filteredCatalog = featuresCatalog.filter(item => {
    const matchesCategory = activeTopicCategory === 'all' || item.category === activeTopicCategory;
    const matchesSearch = searchFilter === '' ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.topics.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleStepJump = (pageId) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
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
          maxWidth: '1060px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-panel-subtle)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>🧭</span>
              <span className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', border: 'none', fontSize: '11px' }}>
                {isHindi ? 'संपूर्ण नेविगेशन व फ्लो गाइड' : 'Complete Navigation & Workflow Master Guide'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                10 {isHindi ? 'मॉड्यूल' : 'Modules'} • 4 {isHindi ? 'उपयोगकर्ता यात्राएं' : 'Guided Personas'}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {isHindi ? 'AERIS दिल्ली नेविगेशन मास्टर और फीचर डायरेक्टरी' : 'AERIS Delhi Master Navigation & Feature Guide'}
            </h2>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isHindi
                ? 'शुरुआत से अंत तक वेबसाइट को नेविगेट करने का संपूर्ण रोडमैप और सभी वैज्ञानिक विषयों का विवरण'
                : 'Step-by-step how to navigate from start to finish, persona workflows, and deep topic coverage'}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '20px' }}
          >
            ✕ {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

        {/* Modal Body Container with Smooth Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Section 1: 4 Guided Persona Pathways */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  {isHindi ? '🚀 4 निर्देशित उपयोगकर्ता यात्राएं (Start-to-End Pathways)' : '🚀 4 Guided User Pathways (Start-to-End Journeys)'}
                </h3>
                <p className="muted" style={{ margin: 0, fontSize: '12.5px' }}>
                  {isHindi ? 'अपनी भूमिका चुनें और स्टेप-बाय-स्टेप नेविगेट करें:' : 'Choose your role to follow an optimal start-to-end walkthrough:'}
                </p>
              </div>

              {/* Persona Switcher Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {personas.map(p => {
                  const isActive = activePersonaTab === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePersonaTab(p.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-panel)',
                        color: isActive ? '#ffffff' : 'var(--text-main)',
                        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                        fontWeight: isActive ? 700 : 500
                      }}
                    >
                      {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Persona Pathway Card */}
            {(() => {
              const currentPersona = personas.find(p => p.id === activePersonaTab) || personas[0];
              return (
                <div style={{
                  backgroundColor: 'var(--bg-panel-subtle)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-color)',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {currentPersona.title}
                        </span>
                        <span className="tag" style={{ backgroundColor: currentPersona.badgeColor, color: '#ffffff', fontSize: '10.5px' }}>
                          {currentPersona.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {currentPersona.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Steps Stepper Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentPersona.steps.map((st) => (
                      <div
                        key={st.step}
                        style={{
                          backgroundColor: 'var(--bg-panel)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '14px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '14px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)', marginBottom: '3px' }}>
                            {st.title}
                          </div>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {st.desc}
                          </div>
                        </div>

                        <button
                          onClick={() => handleStepJump(st.pageId)}
                          className="btn btn-sm"
                          style={{
                            fontSize: '12px',
                            padding: '6px 14px',
                            fontWeight: 700,
                            borderRadius: '20px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {st.actionLabel} ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 2: Complete Topic & Feature Catalog */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  {isHindi ? '📚 संपूर्ण 10 फीचर डायरेक्टरी व वैज्ञानिक विषय' : '📚 Complete 10 Feature Directory & Topics Covered'}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {isHindi
                    ? 'प्रत्येक फीचर द्वारा कवर किए जाने वाले विषय, इनपुट, आउटपुट और उपयोग विधि:'
                    : 'Detailed breakdown of scientific topics covered, parameters, and step-by-step navigation instructions:'}
                </div>
              </div>

              {/* Filter Search Input & Category Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder={isHindi ? 'विषय या फीचर खोजें...' : 'Filter topics or features...'}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    fontSize: '12px',
                    width: '180px'
                  }}
                />

                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { id: 'all', label: isHindi ? 'सभी' : 'All' },
                    { id: 'live', label: isHindi ? 'लाइव व मैप' : 'Live & Map' },
                    { id: 'citizen', label: isHindi ? 'स्वास्थ्य व नागरिक' : 'Health & Citizen' },
                    { id: 'science', label: isHindi ? 'विज्ञान व लैब' : 'Science Labs' },
                    { id: 'trust', label: isHindi ? 'ब्लॉकचेन ऑडिट' : 'Blockchain' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTopicCategory(cat.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        backgroundColor: activeTopicCategory === cat.id ? 'var(--accent-primary)' : 'transparent',
                        color: activeTopicCategory === cat.id ? '#ffffff' : 'var(--text-muted)',
                        borderColor: activeTopicCategory === cat.id ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredCatalog.map(feat => (
                <div
                  key={feat.id}
                  style={{
                    backgroundColor: 'var(--bg-panel-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-card)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{feat.icon}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                            {feat.name}
                          </h4>
                          <span className="tag" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                            {feat.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {feat.summary}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStepJump(feat.id)}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontWeight: 700,
                        fontSize: '12px',
                        padding: '6px 14px',
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--accent-primary)',
                        color: 'var(--text-main)'
                      }}
                    >
                      {isHindi ? 'इस पेज पर जाएं' : 'Jump to Page'} ➔
                    </button>
                  </div>

                  {/* Covered Topics Chips */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      {isHindi ? '🔬 मुख्य विषय व वैज्ञानिक पैरामीटर:' : '🔬 Topics Covered & Scientific Parameters:'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {feat.topics.map((t, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '11.5px',
                            padding: '3px 9px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-panel)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)'
                          }}
                        >
                          • {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step How-To */}
                  <div style={{
                    backgroundColor: 'var(--bg-panel)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px dashed var(--border-color)',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {isHindi ? 'नेविगेट कैसे करें: ' : 'How to navigate: '}
                    </strong>
                    {feat.howToUse}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-panel-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            💡 {isHindi
              ? 'सुझाव: कीबोर्ड पर Ctrl+K दबाकर कभी भी त्वरित खोज (Quick Jump) खोल सकते हैं।'
              : 'Pro-tip: Press Ctrl+K anytime to open Quick Jump palette to search any topic instantly.'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleStepJump('overview')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '12px' }}
            >
              ⚡ {isHindi ? 'शुरुआत (Overview) पर जाएं' : 'Go to Start (Overview)'}
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm"
              style={{ fontSize: '12px' }}
            >
              {isHindi ? 'समझ गए, गाइड बंद करें' : 'Got it, Close Guide'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
