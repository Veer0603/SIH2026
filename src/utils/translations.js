// Complete Bilingual (English & हिन्दी) Localization Dictionary for AERIS Delhi NCR

export const TRANSLATIONS = {
  en: {
    common: {
      appName: "AERIS DELHI",
      appTagline: "Coupled Weather-Chemistry 72h Engine",
      station: "Station",
      activeLocality: "Active Locality",
      status: "Status",
      category: "Category",
      aqi: "AQI",
      pm25: "PM2.5",
      pm10: "PM10",
      temp: "Temp",
      wind: "Wind",
      humidity: "Humidity",
      pbl: "PBL Height",
      inversion: "Inversion",
      live: "LIVE",
      paused: "PAUSED",
      refresh: "Sync",
      compare: "Compare",
      soundOn: "Sound On",
      muted: "Muted",
      dark: "Dark",
      light: "Light",
      addStation: "+ Add Station",
      save: "Save",
      close: "Close",
      cancel: "Cancel",
      active: "ACTIVE",
      optional: "OPTIONAL",
      required: "REQUIRED",
      yes: "YES",
      no: "NO",
      allowed: "ALLOWED",
      keepShut: "KEEP SHUT",
      searchPlaceholder: "Search Delhi locality (e.g. Rohini, Dwarka, Okhla)...",
      criticalHazard: "Critical Hazard",
      highRisk: "High Risk",
      moderateRisk: "Moderate Risk",
      unhealthy: "Unhealthy",
      fair: "Fair",
      good: "Good",
      optimal: "Optimal",
      severe: "Severe",
      hazardous: "Hazardous",
      poor: "Poor",
      moderate: "Moderate"
    },
    nav: {
      overview: "Overview & Live AQI",
      aiAdvisor: "AeroAI Health Advisor",
      aiLab: "AI/ML Neural Studio",
      forecast: "72h Forecast & Policy",
      inversion: "Inversion Physics",
      layman: "Air Simplified (Bilingual)",
      routePlanner: "Commute Exposure Planner",
      blockchain: "AeroLedger Audit",
      map: "Mapbox Grid & Matrix",
      chatbot: "AI AQI Chatbot",
      compare: "Compare Stations",
      switchLang: "हिन्दी"
    },
    overview: {
      networkTag: "⚡ CPCB Live Telemetry Network",
      nocturnalCap: "⚠️ Nocturnal Inversion Cap",
      boundaryLayer: "Boundary Layer",
      title: "Delhi NCR Atmospheric Inversion & 72h AQI Intelligence",
      subtitle: "Real-time coupled weather-chemistry forecasting simulating boundary layer entrapment, NW agricultural smoke advection, and citizen bio-dosimetry across all Delhi localities.",
      activeLocality: "Active Locality",
      ncrAverage: "Delhi NCR Average",
      monitoringStations: "Across 16 official CPCB stations",
      mostPolluted: "Worst Smog Hotspot",
      cleanestArea: "Cleanest Locality",
      pinnedStations: "Pinned Stations",
      soundAudioDirective: "Broadcast Voice Alert",
      playTone: "Acoustic Tone",
      universalSafetyCode: "Universal Color Safety Scale",
      grapStatus: "Delhi NCR Emergency GRAP Protocol",
      sourceContributions: "Estimated Emission Source Apportionment",
      outdoorWindow: "Optimal Outdoor Time Window (Next 24h)",
      quickTools: "Explore Scientific Intelligence Modules",
      quickAdvisorDesc: "Custom health & inhalation dosimetry calibrated to your medical vulnerability.",
      quickForecastDesc: "72-hour hourly chemical transport and planetary boundary layer forecast.",
      quickInversionDesc: "Interactive physics simulator of thermal inversion lid & stubble plumes.",
      quickRouteDesc: "Find transit routes that minimize deep-lung toxic particulate inhalation."
    },
    advisor: {
      tag: "AeroAI Neural Health & Dosimetry Engine",
      title: "Personalized Health, Dosimetry & Purifier Advisor",
      subtitle: "Real-time biological lung deposition modeling calibrated to Delhi ambient PM2.5 at",
      savePlan: "📥 Save Health Plan",
      section1Title: "1. SELECT PROFILE & BIO-PARAMETERS",
      section1Desc: "Select vulnerability tier, then fine-tune your personal exposure variables:",
      section2Title: "2. PERSONALIZED AeroAI OUTPUT",
      calibrationTitle: "⚡ LIVE PERSONAL EXPOSURE CALIBRATION",
      ageLabel: "Citizen Age:",
      pediatricAge: "4 yrs (Pediatric)",
      geriatricAge: "85 yrs (Geriatric)",
      outdoorHoursLabel: "Outdoor Exposure Today:",
      strictQuarantine: "0h (Strict Quarantine)",
      fieldCommute: "12h (Field / Commute)",
      exertionLabel: "Exertion Level:",
      maskLabel: "Mask Protection:",
      filtrationLabel: "Indoor Air Filtration Status:",
      outdoorScore: "Outdoor Score",
      maskRequired: "Mask Required?",
      ventilateWindows: "Ventilate Windows?",
      dosimetryTitle: "REAL-TIME LUNG DEPOSITION DOSIMETRY",
      inhaledPM25: "24H PM2.5 INHALED",
      cigaretteEquiv: "CIGARETTE EQUIVALENT",
      bioVulnerability: "BIO-VULNERABILITY",
      shieldLevel: "Personal Shield Level (from mask, HEPA & protocol):",
      checklistTitle: "DAILY PERSONAL SAFETY PROTOCOL",
      checklistSubtitle: "Actionable medical measures calibrated for",
      safeWindowsTitle: "24-HOUR OPTIMAL OUTDOOR TIME WINDOWS",
      safeWindowsSubtitle: "AI scans planetary boundary layer expansion to locate hours with lowest PM2.5 entrapment.",
      purifierTitle: "ROOM AIR PURIFIER CADR & HEPA CALCULATOR",
      purifierSubtitle: "Calculate exact mechanical clean air delivery rate needed to keep indoor PM2.5 below 25 µg/m³.",
      roomArea: "Room Floor Area:",
      ceilingHeight: "Ceiling Height:",
      requiredCADR: "Required CADR Rating",
      estimatedHEPALife: "HEPA Filter Lifespan",
      cleanDownTime: "80% Smog Reduction Time",
      profiles: {
        general: {
          title: "👤 General Public (Adult)",
          desc: "Standard adult with no chronic respiratory issues"
        },
        children: {
          title: "👶 Children & Elderly",
          desc: "Developing lungs or senior citizens vulnerable to PM2.5"
        },
        asthma: {
          title: "🫁 Asthma / COPD Sensitivity",
          desc: "Pre-existing respiratory conditions, bronchitis, or inhaler reliance"
        },
        athlete: {
          title: "🏃 Outdoor Athlete / Runner",
          desc: "Heavy ventilation during outdoor sports, running, or cycling"
        },
        pregnant: {
          title: "🤰 Expectant Mothers",
          desc: "Foetal cardiovascular protection from micro-particle penetration"
        },
        commuter: {
          title: "🛵 Daily Commuter / Delivery Worker",
          desc: "Prolonged exposure in roadside diesel smoke corridors"
        }
      },
      exertionOptions: {
        sedentary: "Resting / Sedentary (0.5 m³/h)",
        moderate: "Walking / Commuting (1.1 m³/h)",
        heavy: "Running / Heavy Exertion (2.8 m³/h)"
      },
      maskOptions: {
        none: "No Mask (0% filtration)",
        cloth: "Cloth Mask (20% filtration)",
        surgical: "Surgical Mask (45% filtration)",
        n95: "Certified N95 / FFP2 (95% filtration)"
      },
      purificationOptions: {
        none: "Standard Unfiltered Room (70% outdoor smog enters)",
        room: "Single Room HEPA Purifier (78% indoor smog filtered)",
        whole: "Sealed Whole-Home HEPA Filtration (92% filtered)"
      }
    },
    lab: {
      tag: "Physics-Informed Neural Network Lab",
      title: "AI/ML Neural Studio & Policy Scenario Simulator",
      subtitle: "WRF-Chem coupled surrogate modeling, counterfactual policy intervention simulations, and real-time sensor anomaly detection for Delhi NCR.",
      tabApportionment: "Receptor Source Apportionment",
      tabPinn: "PINN Inversion Breakthrough",
      tabAnomaly: "Sensor Anomaly / Fraud Detector",
      tabCounterfactual: "Counterfactual Policy Simulator",
      stubbleReduction: "Stubble Fire Ban Enforcement",
      vehicleReduction: "Odd-Even Vehicular Rationing",
      industrialReduction: "Industrial Corridor Shutdown",
      dustReduction: "Mechanized Dust Suppression",
      solarInsolation: "Solar Insolation (W/m²)",
      groundTemp: "Surface Temperature (°C)",
      inversionLid: "Inversion Lid Altitude (m)"
    },
    forecast: {
      tag: "72h Coupled WRF-Chem Outlook",
      title: "72-Hour Air Quality & Weather Ceiling Forecast",
      subtitle: "Hourly trajectory of photochemical smog, boundary layer lids, and stubble fire impacts for",
      matrixTitle: "HOURLY DATA MATRIX BREAKDOWN (72 HOURS)",
      matrixSubtitle: "Inspect specific time slots to identify morning inversion peaks vs afternoon ventilation relief.",
      filterPlaceholder: "Filter hours (e.g. Mon, Severe, 08:00)...",
      timeHorizon: "Time Horizon",
      category: "Category",
      pblCeiling: "PBL Ceiling (m)",
      inversionPct: "Inversion %",
      modelConfidence: "Model Confidence"
    },
    inversion: {
      tag: "WRF-Chem Physics Simulator",
      title: "Atmospheric Inversion & Stubble Smoke Simulator",
      subtitle: "Simulate how nocturnal boundary layer cooling, calm surface winds, and agricultural fire smoke interact dynamically over Delhi NCR."
    },
    layman: {
      tag: "Easy Reading Guide & Citizen Health",
      title: "Air Particles & Atmospheric Science Explained Simply",
      subtitle: "Understand what AQI numbers mean in everyday plain language, compare mask types, and check symptoms with bilingual English and Hindi guidance.",
      colorCodeTitle: "UNIVERSAL AIR QUALITY COLOR SAFETY CODE",
      colorCodeSubtitle: "Standard Indian CPCB and WHO visual classification for quick environmental hazard assessment.",
      greenTitle: "🟢 GREEN (0 - 50)",
      greenName: "Clean & Fresh Air",
      greenDesc: "Safe for sports, outdoor running, open windows.",
      yellowTitle: "🟡 YELLOW (51 - 100)",
      yellowName: "Acceptable Air",
      yellowDesc: "Okay for most. Asthmatics take short breathers.",
      orangeTitle: "🟠 ORANGE (101 - 200)",
      orangeName: "Hazy & Unhealthy",
      orangeDesc: "Children & seniors wear simple masks outside.",
      redTitle: "🔴 RED (201 - 300)",
      redName: "Heavy Toxic Smog",
      redDesc: "Must wear N95 mask. Do not run or exercise outdoors.",
      purpleTitle: "🟣 PURPLE (301 - 400)",
      purpleName: "Severe Pollution",
      purpleDesc: "Stay indoors. Keep doors and windows tightly sealed.",
      maroonTitle: "☠️ MAROON (401+)",
      maroonName: "Emergency Toxic Hazard",
      maroonDesc: "Avoid all exposure. Run HEPA air purifiers indoors."
    },
    route: {
      tag: "Clean Air Transit Optimizer",
      title: "Delhi NCR Commute Air Exposure Planner",
      subtitle: "Compare particulate inhalation dosimetry across Delhi Metro, AC Cabs, Two-Wheelers, and Cycling to select the safest travel option.",
      origin: "Departure Station (Origin):",
      destination: "Arrival Station (Destination):",
      departureTime: "Planned Travel Time:",
      morningTime: "Morning Peak (08:00 - Strong Smog Lid)",
      afternoonTime: "Afternoon (14:00 - Convective Dispersion)",
      eveningTime: "Evening Rush (19:00 - Trapping Begins)",
      selectMode: "Select Mode of Transport:",
      routeComparison: "ROUTE EXPOSURE & INHALATION DOSIMETRY COMPARISON",
      distanceEst: "Estimated Corridor Distance:",
      ambientPM25: "Ambient Corridor PM2.5:",
      exportPlan: "📥 Export Route Plan"
    },
    blockchain: {
      tag: "Cryptographic Audit Trail",
      title: "AeroLedger Environmental Blockchain Proofs & Sandbox",
      subtitle: "Inspect immutable cryptographic block hashes, test anti-tamper fraud resistance, and explore Merkle trees for Delhi NCR monitoring nodes."
    },
    map: {
      tag: "Mapbox HD Vector Tiles",
      title: "Delhi NCR Mapbox Monitoring Grid & Data Matrix",
      subtitle: "Inspect and compare all active monitoring nodes across Delhi NCR on high-resolution maps with stubble wind vectors.",
      addReading: "+ Add Station / Reading",
      settings: "Mapbox Settings",
      settingsTitle: "Mapbox Configuration & Visual Overlays",
      settingsSubtitle: "Customize vector tile styles, resolution, and atmospheric overlay layers.",
      customTokenLabel: "Custom Mapbox Access Token:",
      tokenPlaceholder: "pk.eyJ1Ijo...",
      saveToken: "Save Token",
      resetToken: "Reset to Default",
      tokenActive: "Active (Authenticated)",
      tileStyleLabel: "Mapbox Basemap Style:",
      layerControls: "Atmospheric Layers & Particle Overlays:",
      stubblePlumes: "NW Stubble Smoke Vector Corridor",
      smogDispersion: "Smog Dispersion Heat Radii",
      firmsHotspots: "NASA FIRMS Stubble Fire Hotspots",
      inversionContours: "Inversion Cap Boundary Layer Overlay",
      pinStyleLabel: "Station Marker Pin Style:",
      pinDetailed: "Detailed Badge (AQI + Name)",
      pinMinimal: "Compact Glowing Beacon",
      retinaTiles: "Retina @2x HD 512px Tiles",
      dispersionRadius: "Smog Radius (km):",
      overlayOpacity: "Overlay Opacity:",
      locateMe: "Locate Me",
      resetView: "Reset Delhi View",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit Fullscreen",
      allStations: "All Stations",
      severeOnly: "Severe Only (300+)",
      unhealthyOnly: "Unhealthy (200-300)",
      moderateOnly: "Moderate / Fair (<200)",
      flyTo: "Fly To Zone:"
    },
    chatbot: {
      tag: "Interactive Environmental Intelligence",
      title: "AERIS Delhi Air Quality AI Assistant",
      subtitle: "Ask real-time clinical, meteorological, and regulatory questions regarding Delhi smog, N95 masks, crop residue smoke, and GRAP protocols.",
      askPlaceholder: "Ask about Delhi air, health advice, N95 masks, GRAP...",
      askBtn: "Ask",
      onlineLive: "Online & Live",
      activeTelemetry: "Active Telemetry Context:",
      engineSettings: "Engine Settings",
      clearChat: "Clear Chat",
      speechListen: "Listen Aloud",
      speechStop: "Stop Audio",
      micTitle: "Speak question (Hindi / English)",
      typing: "AERIS AI is analyzing telemetry...",
      faqsTitle: "Top Citizen Smog FAQs",
      usefulTools: "AERIS Scientific Tools"
    },
    footer: {
      heading: "AERIS DELHI — COUPLED ATMOSPHERIC AQI ENGINE",
      description: "High-resolution 72-hour forecast system for Delhi NCR interlinking planetary boundary layer physics, surface weather parameters, and PM2.5/Ozone chemical transport.",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      attribution: "Open Data Attribution: CPCB, IITM SAFAR, WRF-Chem Open Community Framework",
      copyright: "AERIS Delhi — Atmosphere & Chemistry Resilient Intelligence Engine",
      ledgerStatus: "AeroLedger Mainnet Status: ACTIVE (16/16 Nodes Verified)"
    }
  },

  hi: {
    common: {
      appName: "एरिस दिल्ली",
      appTagline: "मौसम-रसायन संयुक्त 72-घंटे पूर्वानुमान इंजन",
      station: "स्टेशन",
      activeLocality: "सक्रिय क्षेत्र",
      status: "स्थिति",
      category: "श्रेणी",
      aqi: "एक्यूआई (AQI)",
      pm25: "PM2.5",
      pm10: "PM10",
      temp: "तापमान",
      wind: "हवा की गति",
      humidity: "नमी",
      pbl: "सीमा परत ऊंचाई",
      inversion: "इनवर्जन",
      live: "लाइव",
      paused: "रोक दिया",
      refresh: "ताज़ा करें",
      compare: "तुलना करें",
      soundOn: "ध्वनि चालू",
      muted: "म्यूट",
      dark: "डार्क",
      light: "लाइट",
      addStation: "+ नया स्टेशन जोड़ें",
      save: "सुरक्षित करें",
      close: "बंद करें",
      cancel: "रद्द करें",
      active: "सक्रिय",
      optional: "वैकल्पिक",
      required: "अनिवार्य",
      yes: "हाँ",
      no: "नहीं",
      allowed: "अनुमति है",
      keepShut: "बंद रखें",
      searchPlaceholder: "दिल्ली का इलाका खोजें (उदा. रोहिणी, द्वारका, ओखला)...",
      criticalHazard: "अत्यंत खतरनाक",
      highRisk: "उच्च जोखिम",
      moderateRisk: "मध्यम जोखिम",
      unhealthy: "अस्वस्थ",
      fair: "संतोषजनक",
      good: "अच्छा",
      optimal: "उत्तम",
      severe: "गंभीर",
      hazardous: "खतरनाक",
      poor: "खराब",
      moderate: "मध्यम"
    },
    nav: {
      overview: "सिंहावलोकन व लाइव AQI",
      aiAdvisor: "AeroAI स्वास्थ्य सलाहकार",
      aiLab: "एआई न्यूरल लैब व सिमुलेटर",
      forecast: "72 घंटे पूर्वानुमान व नीतियां",
      inversion: "इनवर्जन भौतिकी सिमुलेटर",
      layman: "प्रदूषण की आसान गाइड (द्विभाषी)",
      routePlanner: "सुरक्षित यात्रा व मार्ग योजना",
      blockchain: "ब्लॉकचेन ऑडिट लेजर",
      map: "नक्शा ग्रिड व स्टेशन तालिका",
      chatbot: "एआई वायु चैटबॉट",
      compare: "स्टेशन तुलना (Compare)",
      switchLang: "English"
    },
    overview: {
      networkTag: "⚡ सीपीसीबी लाइव टेलीमेट्री नेटवर्क",
      nocturnalCap: "⚠️ रात्रि इनवर्जन कैप (धुआं फंसा)",
      boundaryLayer: "सीमा परत",
      title: "दिल्ली एनसीआर वायुमंडलीय इनवर्जन व 72 घंटे एक्यूआई इंटेलिजेंस",
      subtitle: "वास्तविक समय मौसम-रसायन सिमुलेशन: दिल्ली के सभी इलाकों में धुंध की परत, पराली का धुआं और फेफड़ों में जमा होने वाले कणों का सटीक वैज्ञानिक विश्लेषण।",
      activeLocality: "सक्रिय क्षेत्र",
      ncrAverage: "दिल्ली एनसीआर का औसत",
      monitoringStations: "16 आधिकारिक सीपीसीबी स्टेशनों के आधार पर",
      mostPolluted: "सर्वाधिक प्रदूषित हॉटस्पॉट",
      cleanestArea: "सबसे स्वच्छ इलाका",
      pinnedStations: "पसंदीदा पिन किए गए स्टेशन",
      soundAudioDirective: "ध्वनि स्वास्थ्य चेतावनी सुनें",
      playTone: "ध्वनि टोन बजाएं",
      universalSafetyCode: "सार्वभौमिक रंग सुरक्षा पैमाना",
      grapStatus: "दिल्ली एनसीआर आपातकालीन ग्रैप (GRAP) प्रोटोकॉल",
      sourceContributions: "अनुमानित प्रदूषण स्रोत विभाजन",
      outdoorWindow: "बाहर निकलने का सबसे सुरक्षित समय (अगले 24 घंटे)",
      quickTools: "वैज्ञानिक इंटेलिजेंस मॉड्यूल देखें",
      quickAdvisorDesc: "आपकी स्वास्थ्य स्थिति के अनुसार व्यक्तिगत जोखिम व इनहेलेशन डोसीमेट्री।",
      quickForecastDesc: "72 घंटे का प्रति घंटा रासायनिक परिवहन और वायुमंडलीय सीमा परत पूर्वानुमान।",
      quickInversionDesc: "थर्मल इनवर्जन और पराली के धुएं का इंटरएक्टिव भौतिकी सिमुलेटर।",
      quickRouteDesc: "फेफड़ों में सबसे कम जहरीला धुआं खींचने वाले सुरक्षित यात्रा मार्ग खोजें।"
    },
    advisor: {
      tag: "AeroAI न्यूरल स्वास्थ्य व डोसीमेट्री इंजन",
      title: "व्यक्तिगत स्वास्थ्य, डोसीमेट्री व प्यूरीफायर सलाहकार",
      subtitle: "दिल्ली के वास्तविक परिवेशी PM2.5 के आधार पर फेफड़ों में जमा होने वाले सूक्ष्म कणों का लाइव मॉडल - स्थान:",
      savePlan: "📥 स्वास्थ्य योजना सेव करें",
      section1Title: "1. स्वास्थ्य प्रोफाइल और बायो-पैरामीटर चुनें",
      section1Desc: "अपनी संवेदनशीलता श्रेणी चुनें और अपनी व्यक्तिगत दिनचर्या के अनुसार बदलाव करें:",
      section2Title: "2. व्यक्तिगत AeroAI परिणाम",
      calibrationTitle: "⚡ लाइव व्यक्तिगत जोखिम कैलिब्रेशन",
      ageLabel: "नागरिक की आयु:",
      pediatricAge: "4 वर्ष (बालक)",
      geriatricAge: "85 वर्ष (बुजुर्ग)",
      outdoorHoursLabel: "आज बाहर बिताया जाने वाला समय:",
      strictQuarantine: "0 घंटे (पूर्णतः घर में)",
      fieldCommute: "12 घंटे (सड़क / यात्रा)",
      exertionLabel: "शारीरिक परिश्रम का स्तर:",
      maskLabel: "मास्क सुरक्षा का स्तर:",
      filtrationLabel: "कमरे में एयर प्यूरीफायर की स्थिति:",
      outdoorScore: "आउटडोर स्कोर (बाहरी सुरक्षा)",
      maskRequired: "मास्क जरूरी है?",
      ventilateWindows: "खिड़कियां खोलें?",
      dosimetryTitle: "वास्तविक समय फेफड़ों में सूक्ष्म कणों का आकलन",
      inhaledPM25: "24 घंटे में सांस में गया PM2.5",
      cigaretteEquiv: "सिगरेट के बराबर नुकसान",
      bioVulnerability: "जैविक संवेदनशीलता",
      shieldLevel: "व्यक्तिगत सुरक्षा स्तर (मास्क, HEPA और नियमों से):",
      checklistTitle: "दैनिक व्यक्तिगत सुरक्षा चेकलिस्ट",
      checklistSubtitle: "आपकी स्वास्थ्य प्रोफाइल के अनुसार अनुशंसित कदम:",
      safeWindowsTitle: "अगले 24 घंटों में बाहर जाने के सबसे सुरक्षित समय",
      safeWindowsSubtitle: "AI वायुमंडलीय फैलाव का विश्लेषण करके वह समय ढूंढता है जब धुआं सबसे कम जमा हो।",
      purifierTitle: "रूम एयर प्यूरीफायर CADR व HEPA कैलकुलेटर",
      purifierSubtitle: "कमरे के अंदर PM2.5 स्तर 25 µg/m³ से नीचे रखने के लिए आवश्यक मशीन क्षमता की गणना करें।",
      roomArea: "कमरे का क्षेत्रफल (वर्ग फुट):",
      ceilingHeight: "छत की ऊंचाई (फुट):",
      requiredCADR: "आवश्यक CADR रेटिंग",
      estimatedHEPALife: "HEPA फिल्टर की जीवन अवधि",
      cleanDownTime: "80% धुआं साफ होने का समय",
      profiles: {
        general: {
          title: "👤 सामान्य नागरिक (वयस्क)",
          desc: "सामान्य वयस्क जिसे सांस की कोई पुरानी बीमारी नहीं है"
        },
        children: {
          title: "👶 बच्चे और बुजुर्ग",
          desc: "नाजुक फेफड़े वाले बच्चे या वृद्ध जन जो PM2.5 के प्रति अति-संवेदनशील हैं"
        },
        asthma: {
          title: "🫁 अस्थमा / सीओपीडी संवेदनशीलता",
          desc: "पहले से सांस की बीमारी, ब्रोंकाइटिस या इनहेलर पर निर्भर मरीज"
        },
        athlete: {
          title: "🏃 आउटडोर एथलीट / धावक",
          desc: "दौड़ने, साइकिल चलाने या कसरत के दौरान तेजी से गहरी सांस लेने वाले"
        },
        pregnant: {
          title: "🤰 गर्भवती महिलाएं",
          desc: "अति-सूक्ष्म जहरीले कणों से मां और भ्रूण की हृदय-रक्त सुरक्षा"
        },
        commuter: {
          title: "🛵 दैनिक यात्री / डिलीवरी कर्मी",
          desc: "सड़कों पर डीजल के धुएं और धूल में लंबे समय तक रहने वाले"
        }
      },
      exertionOptions: {
        sedentary: "विश्राम / हल्का बैठना (0.5 m³/h)",
        moderate: "पैदल चलना / सामान्य यात्रा (1.1 m³/h)",
        heavy: "दौड़ना / भारी कसरत (2.8 m³/h)"
      },
      maskOptions: {
        none: "कोई मास्क नहीं (0% रुकावट)",
        cloth: "कपड़े का मास्क (20% रुकावट)",
        surgical: "सर्जिकल मास्क (45% रुकावट)",
        n95: "प्रमाणित N95 / FFP2 (95% रुकावट)"
      },
      purificationOptions: {
        none: "सामान्य कमरा (बाहर का 70% धुआं अंदर आता है)",
        room: "एक कमरे का HEPA प्यूरीफायर (78% धुआं छन जाता है)",
        whole: "संपूर्ण सील किया हुआ घर + HEPA सिस्टम (92% सुरक्षित)"
      }
    },
    lab: {
      tag: "फिजिक्स-इन्फॉर्म्ड न्यूरल नेटवर्क लैब",
      title: "एआई/एमएल न्यूरल स्टूडियो और नीति परिदृश्य सिमुलेटर",
      subtitle: "दिल्ली एनसीआर के लिए WRF-Chem आधारित मॉडल, ऑड-ईवन व पराली रोकथाम जैसी नीतियों का प्रभाव और सेंसर धोखाधड़ी पकड़ने वाला टूल।",
      tabApportionment: "प्रदूषण स्रोत विभाजन मॉडल",
      tabPinn: "PINN इनवर्जन ब्रेकथ्रू",
      tabAnomaly: "सेंसर विसंगति व धोखाधड़ी जांच",
      tabCounterfactual: "नीतिगत हस्तक्षेप सिमुलेटर",
      stubbleReduction: "पराली जलाने पर सख्त रोक",
      vehicleReduction: "ऑड-ईवन वाहन व्यवस्था",
      industrialReduction: "औद्योगिक उत्सर्जन में कटौती",
      dustReduction: "सड़कों पर पानी का छिड़काव व धूल नियंत्रण",
      solarInsolation: "सौर विकिरण तीव्रता (W/m²)",
      groundTemp: "सतह का तापमान (°C)",
      inversionLid: "इनवर्जन ढक्कन की ऊंचाई (मीटर)"
    },
    forecast: {
      tag: "72 घंटे का संयुक्त WRF-Chem परिदृश्य",
      title: "72 घंटे का वायु गुणवत्ता व मौसम पूर्वानुमान",
      subtitle: "दिल्ली के चयनित स्टेशन के लिए प्रति घंटा स्मॉग, वायुमंडलीय ढक्कन और पराली के धुएं का विस्तृत ग्राफ।",
      matrixTitle: "प्रति घंटा डेटा मैट्रिक्स (72 घंटे)",
      matrixSubtitle: "सुबह के सबसे घने प्रदूषण समय और दोपहर की राहत का विश्लेषण करें।",
      filterPlaceholder: "समय या स्थिति खोजें (उदा. Mon, Severe, 08:00)...",
      timeHorizon: "समय क्षितिज",
      category: "श्रेणी",
      pblCeiling: "PBL ढक्कन (मीटर)",
      inversionPct: "इनवर्जन %",
      modelConfidence: "मॉडल सटीकता"
    },
    inversion: {
      tag: "WRF-Chem भौतिकी सिमुलेटर",
      title: "वायुमंडलीय इनवर्जन और पराली धुआं सिमुलेटर",
      subtitle: "देखें कि रात की ठंड, शांत हवाएं और खेतों का धुआं मिलकर दिल्ली को कैसे गैस चैंबर बनाते हैं।"
    },
    layman: {
      tag: "आसान नागरिक गाइड व स्वास्थ्य जानकारी",
      title: "वायु प्रदूषण और वैज्ञानिक तथ्य — आसान भाषा में",
      subtitle: "बिना किसी कठिन वैज्ञानिक भाषा के समझें कि AQI का क्या अर्थ है, कौन सा मास्क काम करता है और लक्षणों का क्या उपाय है।",
      colorCodeTitle: "सार्वभौमिक वायु गुणवत्ता रंग सुरक्षा कोड",
      colorCodeSubtitle: "पर्यावरणीय खतरे के त्वरित आकलन हेतु भारतीय CPCB और WHO का आधिकारिक रंग पैमाना।",
      greenTitle: "🟢 हरा (0 - 50)",
      greenName: "स्वच्छ व ताज़ा हवा",
      greenDesc: "खेलकूद, बाहर दौड़ने और खिड़कियां खुली रखने के लिए एकदम सुरक्षित।",
      yellowTitle: "🟡 पीला (51 - 100)",
      yellowName: "स्वीकार्य हवा",
      yellowDesc: "अधिकांश के लिए ठीक। सांस के मरीज कसरत में छोटे विराम लें।",
      orangeTitle: "🟠 नारंगी (101 - 200)",
      orangeName: "धुंधली व अस्वस्थ",
      orangeDesc: "बच्चे व बुजुर्ग बाहर निकलते समय मास्क का प्रयोग करें।",
      redTitle: "🔴 लाल (201 - 300)",
      redName: "भारी जहरीला स्मॉग",
      redDesc: "N95 मास्क अनिवार्य है। बाहर कसरत या दौड़ बिल्कुल न लगाएं।",
      purpleTitle: "🟣 बैंगनी (301 - 400)",
      purpleName: "अति-गंभीर प्रदूषण",
      purpleDesc: "घर के अंदर रहें। खिड़कियां और बालकनी के दरवाजे पूरी तरह बंद रखें।",
      maroonTitle: "☠️ गहरा मैरून (401+)",
      maroonName: "आपातकालीन जहरीला संकट",
      maroonDesc: "सभी बाहरी गतिविधियों से बचें। कमरे में HEPA एयर प्यूरीफायर चलाएं।"
    },
    route: {
      tag: "स्वच्छ मार्ग अनुकूलक",
      title: "दिल्ली एनसीआर यात्रा वायु जोखिम योजना",
      subtitle: "दिल्ली मेट्रो, एसी कैब, दोपहिया और पैदल/साइकिल में सांस में जाने वाले धुएं की तुलना करें और सबसे सुरक्षित मार्ग चुनें।",
      origin: "प्रस्थान स्टेशन (आरंभ):",
      destination: "आगमन स्टेशन (गंतव्य):",
      departureTime: "यात्रा का नियोजित समय:",
      morningTime: "सुबह का पीक समय (08:00 - सबसे घना स्मॉग)",
      afternoonTime: "दोपहर का समय (14:00 - धूप व बेहतर हवा)",
      eveningTime: "शाम का समय (19:00 - दोबारा धुआं जमना शुरू)",
      selectMode: "परिवहन का साधन चुनें:",
      routeComparison: "यात्रा मार्ग जोखिम व धुआं इनहेलेशन तुलना",
      distanceEst: "अनुमानित मार्ग दूरी:",
      ambientPM25: "रास्ते का परिवेशी PM2.5:",
      exportPlan: "📥 यात्रा योजना सेव करें"
    },
    blockchain: {
      tag: "क्रिप्टोग्राफिक ऑडिट ट्रेल",
      title: "AeroLedger पर्यावरण ब्लॉकचेन प्रमाण व सैंडबॉक्स",
      subtitle: "दिल्ली एनसीआर के डेटा नोड्स के अपरिवर्तनीय ब्लॉक हैश देखें, छेड़छाड़ रोधी सुरक्षा का परीक्षण करें और मर्कल ट्री की जांच करें।"
    },
    map: {
      tag: "मैपबॉक्स एचडी वेक्टर मैप",
      title: "दिल्ली एनसीआर मैपबॉक्स ग्रिड व डेटा मैट्रिक्स",
      subtitle: "उच्च-रिज़ॉल्यूशन मैपबॉक्स मानचित्र और पराली की हवा के तीरों के साथ दिल्ली के सभी निगरानी स्टेशनों की तुलना करें।",
      addReading: "+ नया स्टेशन / रीडिंग जोड़ें",
      settings: "मैपबॉक्स सेटिंग्स",
      settingsTitle: "मैपबॉक्स विन्यास व विज़ुअल ओवरले",
      settingsSubtitle: "वेक्टर टाइल शैलियों, रिज़ॉल्यूशन और वायुमंडलीय ओवरले को अनुकूलित करें।",
      customTokenLabel: "कस्टम मैपबॉक्स एक्सेस टोकन:",
      tokenPlaceholder: "pk.eyJ1Ijo...",
      saveToken: "टोकन सेव करें",
      resetToken: "डिफ़ॉल्ट पर रीसेट करें",
      tokenActive: "सक्रिय (प्रमाणित)",
      tileStyleLabel: "मैपबॉक्स बेसमेप शैली:",
      layerControls: "वायुमंडलीय परतें व कण ओवरले:",
      stubblePlumes: "उत्तर-पश्चिम पराली धुआं गलियारा",
      smogDispersion: "स्मॉग फैलाव ताप वृत्त",
      firmsHotspots: "नासा एफआईआरएमएस पराली आग हॉटस्पॉट",
      inversionContours: "इनवर्जन कैप सीमा परत ओवरले",
      pinStyleLabel: "स्टेशन मार्कर पिन शैली:",
      pinDetailed: "विस्तृत बैज (AQI + नाम)",
      pinMinimal: "कॉम्पैक्ट चमकता बीकन",
      retinaTiles: "रेटिना @2x एचडी 512px टाइल्स",
      dispersionRadius: "स्मॉग फैलाव त्रिज्या (किमी):",
      overlayOpacity: "ओवरले अस्पष्टता:",
      locateMe: "मेरी स्थिति खोजें",
      resetView: "दिल्ली दृश्य रीसेट करें",
      fullscreen: "पूर्ण स्क्रीन",
      exitFullscreen: "पूर्ण स्क्रीन बंद करें",
      allStations: "सभी स्टेशन",
      severeOnly: "केवल गंभीर (300+)",
      unhealthyOnly: "अस्वस्थ (200-300)",
      moderateOnly: "मध्यम / संतोषजनक (<200)",
      flyTo: "क्षेत्र पर जाएं:"
    },
    chatbot: {
      tag: "एआई पर्यावरण व स्वास्थ्य चैटबॉट",
      title: "AERIS दिल्ली एआई वायु परामर्शदाता",
      subtitle: "दिल्ली प्रदूषण, स्वास्थ्य सावधानियों, N95 मास्क, पराली धुएं और ग्रैप (GRAP) नियमों पर अपने किसी भी प्रश्न का उत्तर तुरंत पाएं।",
      askPlaceholder: "दिल्ली वायु गुणवत्ता, N95, ग्रैप या स्वास्थ्य संबंधित प्रश्न पूछें...",
      askBtn: "पूछें",
      onlineLive: "सक्रिय एवं लाइव",
      activeTelemetry: "सक्रिय संदर्भ:",
      engineSettings: "इंजन सेटिंग्स",
      clearChat: "साफ़ करें",
      speechListen: "सुनें (ऑडियो)",
      speechStop: "ऑडियो रोकें",
      micTitle: "बोलकर पूछें (हिन्दी / अंग्रेजी)",
      typing: "उत्तर तैयार कर रहा है...",
      faqsTitle: "दिल्लीवासियों के प्रमुख प्रश्न",
      usefulTools: "उपयोगी AERIS टूल्स"
    },
    footer: {
      heading: "एरिस दिल्ली — संयुक्त वायुमंडलीय एक्यूआई इंटेलिजेंस",
      description: "दिल्ली एनसीआर के लिए 72 घंटे का उच्च-सटीक पूर्वानुमान सिस्टम जो सीमा परत भौतिकी, मौसमी परिस्थितियों और PM2.5/ओजोन रासायनिक प्रसार को जोड़ता है।",
      terms: "सेवा की शर्तें",
      privacy: "गोपनीयता नीति",
      attribution: "ओपन डेटा आभार: सीपीसीबी, आईआईटीएम सफर (SAFAR), WRF-Chem ओपन कम्युनिटी फ्रेमवर्क",
      copyright: "एरिस दिल्ली — पर्यावरण व रसायन लचीला इंटेलिजेंस इंजन",
      ledgerStatus: "AeroLedger मेननेट स्थिति: सक्रिय (16/16 नोड्स सत्यापित)"
    }
  }
};

/**
 * Helper to safely extract nested translation string
 * @param {string} lang 'en' | 'hi'
 * @param {string} path e.g. 'common.station' or 'advisor.title'
 * @param {string} fallback optional fallback if path not found
 */
export function getTranslation(lang, path, fallback = '') {
  const currentLang = lang === 'hi' ? 'hi' : 'en';
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  const keys = path.split('.');
  let current = dict;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Try English fallback if not found in current language
      let fallbackCurrent = TRANSLATIONS.en;
      for (const fKey of keys) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fKey in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fKey];
        } else {
          return fallback || path;
        }
      }
      return typeof fallbackCurrent === 'string' ? fallbackCurrent : fallback || path;
    }
  }
  return typeof current === 'string' ? current : fallback || path;
}
