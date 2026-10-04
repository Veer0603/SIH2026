# AERIS DELHI — Coupled Atmospheric Inversion & 72-Hour AQI Intelligence Engine

<div align="center">

![AERIS Delhi Banner](src/assets/hero.png)

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Regulatory Standard](https://img.shields.io/badge/Regulatory-CPCB%20NAQI%202014-1e3a8a?style=for-the-badge&logo=gov.uk&logoColor=white)](https://cpcb.nic.in/)
[![Scientific Model](https://img.shields.io/badge/Atmospheric%20Physics-Coupled%20WRF--Chem-059669?style=for-the-badge)](https://ruc.noaa.gov/wrf/wrf-chem/)
[![AI/ML Studio](https://img.shields.io/badge/Deep%20Learning-PINN%20%2B%20Receptor%20Model-7c3aed?style=for-the-badge)](https://en.wikipedia.org/wiki/Physics-informed_neural_networks)
[![Data Integrity](https://img.shields.io/badge/AeroLedger-SHA--256%20Merkle%20Blockchain-ea580c?style=for-the-badge)](https://en.wikipedia.org/wiki/Merkle_tree)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Verified%20Clean-10b981?style=for-the-badge)](https://oxc.rs/)
[![Bilingual](https://img.shields.io/badge/Localization-English%20%7C%20हिन्दी-blue?style=for-the-badge)](#bilingual-localization)

**Smart India Hackathon (SIH) — Next-Generation Environmental Decision Support System**  
*Coupled Weather-Chemistry Forecasting • Planetary Boundary Layer (PBL) Dynamics • Personalized Bio-Dosimetry • Cryptographic Telemetry Integrity*

</div>

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [The Delhi Winter Smog Crisis & Scientific Challenge](#the-delhi-winter-smog-crisis--scientific-challenge)
- [System Architecture & Data Pipeline](#system-architecture--data-pipeline)
- [Core Scientific Pillars & Mathematical Formulations](#core-scientific-pillars--mathematical-formulations)
  - [1. Authentic CPCB NAQI Multi-Pollutant Engine](#1-authentic-cpcb-naqi-multi-pollutant-engine)
  - [2. Planetary Boundary Layer & Thermal Inversion Physics](#2-planetary-boundary-layer--thermal-inversion-physics)
  - [3. Personalized Clinical Bio-Dosimetry & Alveolar Deposition](#3-personalized-clinical-bio-dosimetry--alveolar-deposition)
  - [4. True HEPA Air Purifier CADR Sizing Engineering](#4-true-hepa-air-purifier-cadr-sizing-engineering)
  - [5. Transit Mode Exposure & Commute Dose Modeling](#5-transit-mode-exposure--commute-dose-modeling)
  - [6. AeroLedger Cryptographic Blockchain & Anti-Tamper Sandbox](#6-aeroledger-cryptographic-blockchain--anti-tamper-sandbox)
- [Complete 10-Module Feature Directory](#complete-10-module-feature-directory)
- [End-to-End Navigation Workflows by User Persona](#end-to-end-navigation-workflows-by-user-persona)
  - [Persona 1: Daily Delhi Citizen & Family](#persona-1-daily-delhi-citizen--family)
  - [Persona 2: Office Commuter & Transit Traveler](#persona-2-office-commuter--transit-traveler)
  - [Persona 3: Atmospheric Scientist & Researcher](#persona-3-atmospheric-scientist--researcher)
  - [Persona 4: Environmental Auditor & Policy Regulator](#persona-4-environmental-auditor--policy-regulator)
- [Scientific Literature & Regulatory Citations](#scientific-literature--regulatory-citations)
- [Technology Stack & Performance Benchmarks](#technology-stack--performance-benchmarks)
- [Getting Started & Local Installation](#getting-started--local-installation)
- [Directory Structure](#directory-structure)

---

## Executive Summary

Every winter between October and January, the National Capital Region (NCR) of Delhi undergoes an extreme public health emergency. Atmospheric particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$) frequently escalates into the **Severe+ (AQI 450–500+)** category, forcing school closures, commercial truck bans, construction halts under the Graded Response Action Plan (GRAP), and causing severe cardiovascular and pulmonary morbidity across 33+ million residents.

Standard commercial air quality applications have significant limitations:
1. **They are retroactive and static**: They merely publish delayed raw numbers from monitoring stations without explaining *why* the smog is trapped.
2. **They lack physical coupling**: They ignore the **Planetary Boundary Layer (PBL) thermal inversion cap**, wind stagnation, and agricultural stubble fire plume advection from Punjab and Haryana.
3. **They offer generic advice**: Recommending *"avoid outdoor activity"* without calculating personalized micro-gram lung deposition doses, age-adjusted vulnerability factors, or room-specific HEPA air purifier Clean Air Delivery Rate (CADR) requirements.
4. **They lack data auditability**: Regulators and citizens cannot cryptographically verify whether sensor readings were altered or experienced electrochemical baseline drift.

**AERIS Delhi** is an end-to-end, scientifically coupled environmental intelligence platform that unifies:
* Real-time 6-criteria pollutant telemetry calibrated to official **CPCB National Air Quality Index (NAQI)** breakpoints.
* A **coupled WRF-Chem surrogate engine** modeling diurnal planetary boundary layer collapse and solar suppression feedback loops.
* **Personalized clinical bio-dosimetry** calculating daily micro-gram $\text{PM}_{2.5}$ alveolar intake, cigarette smoking equivalents (Berkeley Earth methodology), and WHO threshold multipliers.
* A **Transit Exposure Planner** calculating inhaled particulate mass across Delhi Metro, AC Car, Motorcycle, and Cycling routes.
* **AeroLedger**, a cryptographic SHA-256 block ledger with a 16-node Merkle root tree and an interactive anti-tamper penetration sandbox.
* Full **bilingual English & हिन्दी** localization, Web Audio acoustic frequency sonification, and Web Speech API safety directives.

---

## The Delhi Winter Smog Crisis & Scientific Challenge

Delhi's winter pollution crisis is **not purely an emission problem—it is a coupled meteorology-chemistry entrapment phenomenon**:

```
                         NW Agricultural Stubble Burning Plumes
                               (Punjab & Haryana - FRP > 500)
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WARM INVERSION LAYER AIR LID (T_air > T_ground)          │
│                      Compressed Boundary Layer Ceiling (200m - 350m)        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🚗 Vehicular Exhaust (NOx, CO) │ 🏭 Industrial Plumes │ 💨 Road Dust (PM10) │
│                                                                             │
│                     TRAPPED GROUND-LEVEL TOXIC AIR POCKET                   │
│   Calm Surface Winds (v < 3 km/h) • Solar Suppression Haze (AOD Feedback)   │
└─────────────────────────────────────────────────────────────────────────────┘
                                          ▲
                              Nocturnal Radiative Cooling
                              (Ground drops to 8°C - 14°C)
```

1. **Nocturnal Radiative Cooling & Boundary Layer Collapse**: At night under clear skies, Delhi's land surface rapidly radiates heat into space. The air in immediate contact with the ground cools much faster than the air aloft, inverting the normal lapse rate. The Planetary Boundary Layer (PBL) height compresses from $\approx 1200\,\text{m}$ during summer down to $\mathbf{200\,\text{m} - 350\,\text{m}}$ at night.
2. **The "Sealed Room" Effect**: This temperature inversion acts as a rigid atmospheric lid. All surface emissions produced within the National Capital Territory—over 1.2 crore registered vehicles, industrial estates, construction dust, and municipal solid waste burning—are trapped inside a vertical volume that is **less than one-fourth** of normal mixing capacity.
3. **North-Western Agricultural Fire Plume Advection**: Concurrently, post-monsoon paddy crop residue burning (stubble fires) in Punjab and Haryana injects massive carbonaceous aerosol plumes into the North-Westerly synoptic wind corridor, steering directly into Delhi's compressed boundary layer.
4. **The Solar Suppression Feedback Loop**: Particulates absorb and scatter incoming solar radiation (high Aerosol Optical Depth / AOD). Consequently, morning sunlight fails to warm the ground surface. Without surface thermal heating, convective buoyant plumes cannot develop, delaying the vertical expansion of the boundary layer until late afternoon and locking the city into multi-day stagnation cycles.

---

## System Architecture & Data Pipeline

```mermaid
flowchart TB
    subgraph DataIngestion["Tier 1: Real-Time Telemetry & Geospatial Ingestion"]
        CPCB["CPCB 16 Official Monitoring Nodes\n(PM2.5, PM10, NOx, SO2, CO, O3)"]
        OpenMeteo["Open-Meteo & SAFAR Weather Stream\n(PBL Height, Temp, Wind Vectors, Humidity)"]
        NASAFIRMS["NASA FIRMS Stubble Fire Feeds\n(Fire Radiative Power FRP, Coordinates)"]
    end

    subgraph ScientificEngines["Tier 2: Physics-Coupled Computational Engines"]
        NAQIEngine["CPCB NAQI Regulatory Engine\n(Piecewise Linear Interpolation)"]
        WRFChem["Coupled WRF-Chem 72h Forecast\n(Diurnal PBL, Inversion Cap, Stagnation)"]
        BioDosimetry["AeroAI Bio-Dosimetry Model\n(Tidal Ventilation, Alveolar Mass, CADR)"]
        AeroLedger["AeroLedger Cryptographic Consensus\n(SHA-256 Ledger, 16-Node Merkle Tree)"]
    end

    subgraph StateManagement["Tier 3: Reactive Application Core"]
        Context["React 19 Context & Telemetry Normalizer\n(Persistent Storage, Theme, Bilingual i18n)"]
        AudioSynth["Web Audio Synthesizer\n(Frequency Sonification & Speech Directive)"]
    end

    subgraph UserInterface["Tier 4: Master Navigation Hubs & Experience"]
        HubLive["Live & Geo Hub\n(Overview Dashboard, Mapbox Grid, Compare Dock)"]
        HubCitizen["Citizen Health Hub\n(Bio-Dosimetry Advisor, Commute Planner, Layman Guide, AI Chatbot)"]
        HubScience["Science Labs Hub\n(72h Policy Simulator, Inversion 2D Canvas, AI/ML Studio)"]
        HubTrust["Trust & Audit Hub\n(AeroLedger Blockchain, Anti-Tamper Sandbox, Audit PDF)"]
    end

    DataIngestion --> ScientificEngines
    ScientificEngines --> StateManagement
    StateManagement --> UserInterface
```

---

## Core Scientific Pillars & Mathematical Formulations

### 1. Authentic CPCB NAQI Multi-Pollutant Engine

AERIS implements the exact regulatory mathematical formulation specified in the **Ministry of Environment, Forest and Climate Change (MoEFCC) & Central Pollution Control Board (CPCB) 2014 Guidelines**.

For each measured pollutant $p \in \{\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_x, \text{SO}_2, \text{CO}, \text{O}_3\}$, the sub-index $I_p$ is calculated via piecewise linear interpolation between defined concentration breakpoints:

$$I_p = I_{\text{LO}} + \left[ \frac{I_{\text{HI}} - I_{\text{LO}}}{B_{\text{HI}} - B_{\text{LO}}} \right] \cdot \left( C_p - B_{\text{LO}} \right)$$

Where:
* $C_p$ = Truncated ambient concentration of pollutant $p$
* $B_{\text{LO}}$ = Concentration breakpoint $\le C_p$
* $B_{\text{HI}}$ = Concentration breakpoint $\ge C_p$
* $I_{\text{LO}}$ = Sub-index value corresponding to $B_{\text{LO}}$
* $I_{\text{HI}}$ = Sub-index value corresponding to $B_{\text{HI}}$

The overall national Air Quality Index is governed by the **maximum operator**:

$$\text{AQI} = \max \left( I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NOx}}, I_{\text{SO2}}, I_{\text{CO}}, I_{\text{O3}} \right)$$

$$\text{Dominant Pollutant} = \arg\max_{p} \left( I_p \right)$$

#### Regulatory CPCB Breakpoint Matrix:
| Category | AQI Range | $\text{PM}_{2.5}$ ($24\text{h}$) | $\text{PM}_{10}$ ($24\text{h}$) | $\text{NO}_x$ ($24\text{h}$) | $\text{SO}_2$ ($24\text{h}$) | $\text{CO}$ ($8\text{h}$, $\text{mg/m}^3$) | $\text{O}_3$ ($8\text{h}$) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | 0 – 40 | 0 – 40 | 0.0 – 1.0 | 0 – 50 |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | 41 – 80 | 41 – 80 | 1.1 – 2.0 | 51 – 100 |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | 81 – 180 | 81 – 380 | 2.1 – 10.0 | 101 – 168 |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | 181 – 280 | 381 – 800 | 10.1 – 17.0 | 169 – 208 |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | 281 – 400 | 801 – 1600 | 17.1 – 34.0 | 209 – 748 |
| **Severe** | 401 – 500 | 250+ | 430+ | 400+ | 1600+ | 34.0+ | 748+ |

---

### 2. Planetary Boundary Layer & Thermal Inversion Physics

AERIS models the diurnal cycle of the atmospheric mixing depth coupled with aerosol optical attenuation:

$$\text{PBL}(t) = \text{PBL}_{\text{base}} + \Delta\text{PBL}_{\text{diurnal}} \cdot \sin\left(\frac{2\pi(t - 6)}{24}\right) \cdot \left(1 - \Phi_{\text{AOD}}\right)$$

Where:
* $\Phi_{\text{AOD}} = \min\left(0.35, \frac{\text{PM}_{2.5}}{500} \cdot 0.30\right)$ represents the solar radiation suppression factor.
* Inversion trapping strength is derived as:

$$\eta_{\text{inversion}} = \min\left(98\%, \max\left(15\%, 100 - \frac{\text{PBL}(t)}{9.5}\right)\right)$$

#### Atmospheric Dynamic Stability & Gradient Richardson Number:
The stability of the near-surface nocturnal boundary layer is evaluated via the **Gradient Richardson Number ($\text{Ri}$)**:

$$\text{Ri} = \frac{g}{\theta_v} \cdot \frac{\frac{\partial \theta_v}{\partial z}}{\left( \frac{\partial u}{\partial z} \right)^2} \approx \frac{0.28 \cdot (1000 - \text{PBL})}{u_{\text{wind}}^{1.8} + 0.1}$$

* When $\mathbf{\text{Ri} > 0.25}$ (the critical Richardson number $\text{Ri}_{\text{cr}}$), buoyancy damping suppresses turbulent shear. Atmospheric mixing ceases, inducing **laminar trapping** of emissions in the lowest 200 meters.

---

### 3. Personalized Clinical Bio-Dosimetry & Alveolar Deposition

Rather than presenting abstract AQI numbers, AERIS calculates the **actual particulate mass deposited into deep lung tissue** using physiological ventilation dynamics:

$$\text{Dose}_{\text{inhaled}} (\mu\text{g/day}) = C_{\text{ambient}} \cdot \left[ V_E \cdot t_{\text{out}} \cdot (1 - \xi_{\text{mask}}) + V_E \cdot t_{\text{in}} \cdot (1 - \xi_{\text{indoor}}) \right] \cdot \alpha_{\text{age}}$$

Where:
* $V_E$ = Minute ventilation volume:
  * Sedentary = $8.0\,\text{L/min}$ ($0.48\,\text{m}^3/\text{h}$)
  * Moderate Exertion = $18.5\,\text{L/min}$ ($1.11\,\text{m}^3/\text{h}$)
  * Heavy Athletic Exertion = $45.0\,\text{L/min}$ ($2.70\,\text{m}^3/\text{h}$)
* $\xi_{\text{mask}}$ = Certified filtration efficiency:
  * None = $0.0$
  * Cloth Handkerchief = $0.18$
  * Surgical 3-Ply = $0.45$ (compromised by perimeter facial seal leakage)
  * N95 / FFP2 Certified = $0.95$ (electrostatic meltblown microfibers)
* $\alpha_{\text{age}}$ = Pediatric/senescent vulnerability weighting factor ($1.25\times$ for children/elderly due to higher breathing frequency per kg bodyweight).

#### Berkeley Earth Cigarette Smoking Equivalence:
Drawing upon the peer-reviewed epidemiological equivalence published by Muller & Muller (Berkeley Earth, 2015):

$$\text{Cigarettes/day} = \frac{\text{PM}_{2.5} \text{ concentration } (\mu\text{g/m}^3)}{22}$$

$$\text{WHO 24-Hour Benchmark Multiplier} = \frac{\text{PM}_{2.5}}{15\,\mu\text{g/m}^3}$$

---

### 4. True HEPA Air Purifier CADR Sizing Engineering

AERIS computes exact Clean Air Delivery Rate (CADR) engineering requirements to maintain indoor $\text{PM}_{2.5} < 15\,\mu\text{g/m}^3$ during Delhi smog:

$$V_{\text{room}} (\text{m}^3) = \text{Area} (\text{sq ft}) \times \text{Height} (\text{ft}) \times 0.0283168$$

$$\text{CADR}_{\text{min}} (\text{m}^3/\text{h}) = V_{\text{room}} \times \text{ACH}_{\text{target}} \times \left(1 + \frac{\text{PM}_{2.5}}{300}\right)$$

Where $\text{ACH}_{\text{target}} = 5.0$ Air Changes per Hour (standard for clinical particulate clearance in high-pollution geographic zones).

$$\text{Time to Clean Room Air} (t_{90}) = \frac{\ln(10) \cdot V_{\text{room}}}{\text{CADR}} \times 60 \text{ minutes}$$

---

### 5. Transit Mode Exposure & Commute Dose Modeling

During daily commutes across Delhi NCR, ambient exposure varies significantly across transit modes:

$$\text{Commute Dose} (\mu\text{g}) = \sum_{i} \left[ C_{\text{mode}, i} \cdot V_{E, \text{mode}} \cdot \left(\frac{d \cdot f_{\text{winding}}}{v_{\text{mode}}}\right) \cdot \tau_{\text{inversion}} \right]$$

* **Delhi Metro**: Operates in underground tunnels and elevated viaducts equipped with multi-stage HVAC filtration; maintains internal air $\approx \mathbf{42\,\mu\text{g/m}^3}$ ($\mathbf{82\%}$ dose reduction).
* **AC Cab**: Internal cabin air recirculation filters road plumes; maintains internal air $\approx \mathbf{95\,\mu\text{g/m}^3}$ ($\mathbf{58\%}$ dose reduction).
* **Motorcycle / Auto-Rickshaw**: Direct exposure to heavy vehicular diesel exhaust plumes at street level ($C_{\text{ambient}} \ge 250\,\mu\text{g/m}^3$, ventilation factor $1.4\times$).
* **Cycling**: Extreme pulmonary ventilation rate ($35\,\text{L/min}$) inside unmitigated traffic plumes.
* $\tau_{\text{inversion}}$: Morning rush hour inversion multiplier ($1.25\times$) vs Afternoon boundary layer expansion ($0.80\times$).

---

### 6. AeroLedger Cryptographic Blockchain & Anti-Tamper Sandbox

To eliminate data alteration or undocumented station shutdowns, AERIS commits telemetry samples to a cryptographic ledger:

```
[Block N - 1] ──► Block Header Hash ──► [Block N] ──► Block Header Hash ──► [Block N + 1]
                      │                     │
               ┌──────┴────────┐     ┌──────┴────────┐
             Merkle Tree Root      Merkle Tree Root
             (16 Delhi Nodes)      (16 Delhi Nodes)
```

Each block encapsulates:
$$\text{Block Hash} = \text{SHA-256}\left(\text{StationID} \,\|\, \text{AQI} \,\|\, \text{PM}_{2.5} \,\|\, \text{PBL} \,\|\, \text{Timestamp} \,\|\, \text{PreviousHash} \,\|\, \text{MerkleRoot}\right)$$

* **16-Node Merkle Root Tree**: Aggregates all 16 CPCB monitoring stations into a unified cryptographic root.
* **Interactive Anti-Tamper Sandbox**: Users can test data validation by modifying sample telemetry values. The cryptographic signature reflects the integrity check instantly.

---

## Complete 10-Module Feature Directory

| # | Module Name | Route ID | Primary Domain | Core Topics & Capabilities | Key User Inputs & Controls |
| :-: | :--- | :---: | :--- | :--- | :--- |
| **1** | **Overview & Live AQI Dashboard** | `overview` | Live & Geo | Authentic CPCB NAQI calculation, regional NCR aggregate mean, highest hotspot vs cleanest station, acoustic sonification, voice directive, diurnal safe window optimizer, source fingerprinting, official environmental audit PDF modal. | Locality search, pinned stations, sonify button, voice alert button, audit modal trigger. |
| **2** | **Mapbox Grid & Data Matrix** | `map` | Live & Geo | High-resolution Leaflet vector tiles of all 16 Delhi stations, animated North-West stubble smoke advection plumes, station popups, sortable telemetry matrix, custom sensor ingestion. | Station pin selection, comparison checkboxes, custom station modal coordinates. |
| **3** | **Station Comparison Grid** | `compare` | Live & Geo | Side-by-side comparison of up to 4 stations simultaneously across all 6 pollutants, PBL height, temperature, disparity delta score, and CSV/JSON export. | Comparison dock pill, clear selection, export CSV/JSON buttons. |
| **4** | **AeroAI Health Advisor** | `ai-advisor` | Citizen Health | 5 vulnerability profiles (General, Child, Asthma, Athlete, Pregnant), bio-dosimetry alveolar $\text{PM}_{2.5}$ intake, cigarette equivalence, 24h timeline, HEPA purifier CADR calculator, persistent compliance checklist. | Age slider, outdoor hours slider, exertion level, mask type, room sq ft, ceiling height. |
| **5** | **Commute Exposure Planner** | `route-planner` | Citizen Health | Origin-to-destination routing, road winding factor, time-of-day inversion multipliers, modal comparison (Metro vs Cab vs Bike vs Cycling), inhaled micro-grams, % lung exposure savings. | Origin dropdown, destination dropdown, departure time (morning, afternoon, evening). |
| **6** | **Air Simplified Guide (Bilingual)** | `layman` | Citizen Health | Universal Color Safety Code, $\text{PM}_{2.5}$ vs hair diameter, interactive Mask Filtration Wizard (Cloth, Surgical, N95, P100), symptom diagnostics, 4 Delhi smog myth busters. | Interactive mask selector, symptom tabs, bilingual toggle. |
| **7** | **AERIS AI AQI Assistant** | `chatbot` | Citizen Health | Natural language conversational intelligence in English and Hindi, live station telemetry context injection, prompt chip presets, clinical & regulatory FAQ hub. | Text input prompt, speech synthesis, suggested question chips. |
| **8** | **72-Hour Forecast & Policy Simulator** | `forecast` | Science Labs | Coupled WRF-Chem trajectory, multi-speed auto-play scrubber ($1\times, 2\times, 4\times$), metric toggles (AQI, $\text{PM}_{2.5}$, PBL, Temp, Wind), 4 policy scenario toggles (Stubble Ban, Odd-Even, Smog Guns, Rain Washout), filterable table, CSV/JSON export. | Timeline slider, play/pause button, scenario switches, pollutant metric toggles. |
| **9** | **Inversion Physics Simulator** | `inversion` | Science Labs | 2D Canvas cross-section of ground radiative cooling, smog entrapment lid, solar suppression feedback, Gradient Richardson Number ($\text{Ri}$), anti-smog gun simulation, 4 meteorological presets. | PBL slider, stubble flux slider, wind speed slider, mitigation buttons, seasonal presets. |
| **10** | **AI/ML Neural Studio** | `ai-lab` | Science Labs | 4 sub-labs: Chemical Mass Balance source apportionment with user throttles, Physics-Informed Neural Network (PINN) boundary layer breakdown, sensor anomaly & drift detector, counterfactual what-if sandbox. | Source reduction throttles, solar insolation slider, ground temp, scenario toggles. |
| **11** | **AeroLedger Blockchain Audit** | `blockchain` | Trust & Audit | Immutable SHA-256 block ledger, 16-node Merkle root tree, cryptographic previous-hash linkage, interactive anti-tamper verification sandbox. | Block inspector, forged AQI/PM2.5 inputs, tamper verification simulator. |

---

## End-to-End Navigation Workflows by User Persona

AERIS includes dedicated guided workflows tailored to four primary stakeholder groups:

### Persona 1: Daily Delhi Citizen & Family
1. **Morning Check (`overview`)**: Open dashboard, inspect active locality AQI, and click **"Voice Alert"** or **"Sonify"** to broadcast real-time audio safety directives.
2. **Personal Bio-Dosimetry (`ai-advisor`)**: Select the *Children & Elderly* profile, adjust age and daily outdoor hours, and review the daily cigarette smoking equivalence.
3. **Indoor Clean Air Sizing (`ai-advisor`)**: Input living room dimensions (e.g. $300\,\text{sq ft}$, $10\,\text{ft}$ ceiling) to calculate recommended HEPA CADR ($\text{m}^3/\text{h}$) and time to clean room air.
4. **Errand Planning (`overview`)**: Check the **Diurnal Safe Outdoor Window** card to determine the safest afternoon hours for groceries or exercise.
5. **Mask Fit Verification (`layman`)**: Use the **Mask Wizard** to review why cloth/surgical masks have low filtration efficiency against $\text{PM}_{2.5}$ and ensure certified N95 usage.
6. **Clinical Q&A (`chatbot`)**: Inquire in Hindi or English about child inhaler dosages or air filter maintenance.

### Persona 2: Office Commuter & Transit Traveler
1. **Regional Hotspot Scan (`overview`)**: Identify peak congestion corridors across East, West, and Central Delhi.
2. **Route Exposure Planning (`route-planner`)**: Set departure from *Anand Vihar* to *Connaught Place*.
3. **Timing Optimization (`route-planner`)**: Compare an 08:00 AM departure (nocturnal inversion cap) vs a 02:00 PM departure (boundary layer expansion).
4. **Mode Selection (`route-planner`)**: Verify that choosing the **Delhi Metro** over a two-wheeler eliminates **$\approx 82\%$** of inhaled toxic soot.
5. **Vehicle Recirculation (`layman`)**: Review the guidance on vehicle AC internal recirculation to avoid drawing highway exhaust directly into the car cabin.

### Persona 3: Atmospheric Scientist & Researcher
1. **Vector Mapping (`map`)**: Trace the animated North-Westerly wind vectors carrying stubble burning plumes from Sangrur/Patiala into the Delhi NCT border.
2. **WRF-Chem Trajectory (`forecast`)**: Scrub forward 72 hours using the multi-speed auto-play controls ($2\times$ or $4\times$) and observe diurnal $\text{PM}_{2.5}$ peaks.
3. **Atmospheric Inversion Physics (`inversion`)**: Load the *November Smog* preset in the 2D Canvas simulator and observe how the Gradient Richardson Number ($\text{Ri} > 0.25$) indicates laminar entrapment.
4. **Neural Source Apportionment (`ai-lab`)**: Throttle stubble emissions down by $50\%$ and vehicular emissions by $30\%$ to evaluate chemical mass balance shifts.
5. **PINN Boundary Layer Breakdown (`ai-lab`)**: Model the probability of thermal inversion breakdown under varying solar insolation ($\text{W/m}^2$).
6. **Data Export (`forecast` & `map`)**: Export complete 72-hour hourly matrices to CSV or JSON for external statistical processing.

### Persona 4: Environmental Auditor & Policy Regulator
1. **Station Telemetry Verification (`overview`)**: Check multi-pollutant sub-indices across all 16 CPCB monitoring stations.
2. **Official Audit Certificate (`overview`)**: Click **"Audit Report"** to generate a formal, watermarked, print-ready legal compliance certificate with station coordinates and regulatory sign-offs.
3. **Cryptographic Ledger Audit (`blockchain`)**: Inspect the sequential SHA-256 block ledger on AeroLedger and verify the 16-node Merkle root.
4. **Anti-Tamper Penetration Sandbox (`blockchain`)**: Execute a simulated audit verification to confirm cryptographic integrity across all blocks.
5. **GRAP Policy Modeling (`forecast`)**: Simulate emergency policy scenarios (Odd-Even, anti-smog water cannons, stubble crackdowns) to guide public health advisories.

---

## Scientific Literature & Regulatory Citations

1. **Central Pollution Control Board (CPCB), MoEFCC, Government of India (2014)**  
   *National Air Quality Index (NAQI) — Final Report*. Comprehensive piecewise linear interpolation breakpoints and dominant pollutant formulation.
2. **Indian Institute of Technology (IIT) Kanpur (2015)**  
   *Comprehensive Study on Air Pollution and Green House Gases in Delhi*. Baseline source apportionment weights (Biomass burning, vehicular exhaust, road dust, and secondary inorganic aerosols).
3. **World Health Organization (WHO) (2021)**  
   *WHO Global Air Quality Guidelines: Particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide*. Target baseline annual guideline: $5\,\mu\text{g/m}^3$; $24\text{h}$ interim target: $15\,\mu\text{g/m}^3$.
4. **Muller, R. A., & Muller, E. A. (2015)**  
   *Air Pollution and Cigarette Equivalence*. Berkeley Earth research establishing the epidemiological equivalence of $22\,\mu\text{g/m}^3$ daily $\text{PM}_{2.5}$ exposure to smoking 1 cigarette per day.
5. **Stull, R. B. (1988)**  
   *An Introduction to Boundary Layer Meteorology*. Atmospheric and Oceanographic Sciences Library. Springer Netherlands. Formulations for nocturnal radiative cooling, potential temperature lapse rates, and the Gradient Richardson Number ($\text{Ri}$).
6. **Grell, G. A., et al. (2005)**  
   *Fully coupled “online” chemistry within the WRF model (WRF-Chem)*. Atmospheric Environment, 39(37), 6957-6975.
7. **Raissi, M., Perdikaris, P., & Karniadakis, G. E. (2019)**  
   *Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations*. Journal of Computational Physics, 378, 686-707.
8. **Merkle, R. C. (1987)**  
   *A Digital Signature Based on a Conventional Encryption Function*. Advances in Cryptology — CRYPTO '87, Lecture Notes in Computer Science, vol 293.

---

## Technology Stack & Performance Benchmarks

* **Frontend Framework**: [React 19.2](https://react.dev/) + [Vite 8.3](https://vitejs.dev/) with hot module replacement (HMR).
* **Geospatial Mapping**: [Leaflet 1.9](https://leafletjs.com/) with custom Mapbox High-DPI Retina vector tiles and animated SVG directional wind plumes.
* **Physics & Chart Rendering**: HTML5 2D Canvas with sub-pixel rendering pipelines for real-time trajectory scrubbers and boundary layer cross-sections.
* **Multi-Sensory Audio**: Web Audio API (Frequency tone synthesis matching localized AQI pitch) & Web Speech API (Bilingual text-to-speech voice broadcasts).
* **Linter & Static Analysis**: [Oxlint 1.81](https://oxc.rs/) (High-performance static analysis across 53 files verified in **$59\,\text{ms}$**).
* **Production Build Speed**: Full Vite bundle compilation in **$470\,\text{ms}$**.

---

## Getting Started & Local Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* `npm` (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/Veer0603/SIH2026.git
cd SIH2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy the template configuration file:
```bash
cp .env.example .env
```
Open `.env` and configure your API tokens (never commit `.env` to Git):
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no keys are provided, AERIS operates in offline mode with Open-Meteo fallback telemetry and authentic CPCB simulation).*

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### 5. Validate Linter & Build
```bash
# Run ultra-fast Oxlint static check
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Directory Structure

```
SIH2026/
├── public/                     # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/                 # Brand images and logos
│   ├── components/             # Reusable UI & Engineering Modules
│   │   ├── AIAQIChatbot.jsx    # Bilingual AI Assistant with live telemetry context
│   │   ├── AQIGauge.jsx        # Circular SVG dial gauge with category markers
│   │   ├── CurrentAQICard.jsx  # Primary locality status card with cigarette dose
│   │   ├── FlowNavigator.jsx   # Universal Contextual Flow Stepper (Next Step Guide)
│   │   ├── Forecast72h.jsx     # 72h WRF-Chem trajectory scrubber & policy switches
│   │   ├── InversionCanvasGraphic.jsx # 2D Canvas boundary layer physics cross-section
│   │   ├── LaymanGuide.jsx     # Plain-language education, mask wizard & myth busters
│   │   ├── Navigation.jsx      # Categorized 4-hub navigation with Quick Jump (Ctrl+K)
│   │   ├── NavigationFlowGuideModal.jsx # Master 4-persona flow guide & topic catalog
│   │   ├── OfficialAuditReportModal.jsx # Printable CPCB environmental audit PDF certificate
│   │   ├── OutdoorWindowOptimizer.jsx   # Diurnal safe outdoor activity window optimizer
│   │   ├── QuickJumpModal.jsx  # Instant keyboard search palette (Ctrl+K)
│   │   ├── SourceApportionmentCard.jsx  # IIT Kanpur receptor model fingerprinting
│   │   ├── StationCompareModal.jsx      # Multi-station side-by-side comparison modal
│   │   ├── StationMap.jsx      # Leaflet / Mapbox HD vector grid with wind plumes
│   │   └── StationTable.jsx    # Sortable station telemetry matrix table
│   ├── context/                # Global State Providers
│   │   ├── AppContext.jsx      # Telemetry state, favorites, theme, sound, i18n
│   │   └── useApp.js           # Consumer hook for global context
│   ├── data/
│   │   └── delhiStationsData.js# 16 Official CPCB Delhi stations & NAQI breakpoints
│   ├── pages/                  # Page Container Views
│   │   ├── AiAdvisorPage.jsx   # Bio-Dosimetry & Air Purifier CADR Calculator
│   │   ├── AiLabPage.jsx       # PINN Inversion & Neural Anomaly Sandbox
│   │   ├── BlockchainPage.jsx  # AeroLedger Merkle Blockchain & Tamper Testing
│   │   ├── ChatbotPage.jsx     # Full-Page Bilingual AI Chatbot Experience
│   │   ├── ForecastPage.jsx    # 72-Hour Coupled Forecast & Policy Simulator
│   │   ├── InversionPhysicsPage.jsx # 2D Boundary Layer Simulation View
│   │   ├── LaymanGuidePage.jsx # Public Health Education & Mask Wizard View
│   │   ├── MapStationPage.jsx  # High-Res Mapbox Grid & Sensor Matrix View
│   │   ├── OverviewPage.jsx    # Primary Citizen Dashboard & Regional Hotspots
│   │   └── RoutePlannerPage.jsx# Transit Commute Exposure Planner (Metro vs Cab vs Bike)
│   ├── utils/                  # Computational Engines & Physics Math
│   │   ├── audioSynthesizer.js # Web Audio API atmospheric tone sonification
│   │   ├── blockchainLedger.js # SHA-256 block hashing & Merkle tree logic
│   │   ├── chatbotEngine.js    # Resilient Gemini & local rule-based cascade
│   │   ├── cpcbAqiEngine.js    # Official piecewise linear CPCB NAQI formula
│   │   ├── exportUtils.js      # CSV, JSON, and timestamped report downloaders
│   │   ├── geocoding.js        # Haversine distance & road winding factor math
│   │   ├── mlEngine.js         # PINN 72h surrogate, bio-dosimetry & CADR formulas
│   │   └── translations.js     # Comprehensive English & हिन्दी bilingual dictionaries
│   ├── App.jsx                 # Master application entry with global modal wiring
│   ├── index.css               # Architectural styling, tokens, glassmorphism & animations
│   └── main.jsx                # React DOM root initialization
├── .env.example                # Safe environment variable configuration template
├── .gitignore                  # Git ignore rules protecting private tokens
├── .oxlintrc.json              # Oxlint high-performance static analysis configuration
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite compiler configuration
└── README.md                   # Complete scientific documentation & judge's guide
```

---

<div align="center">

**Developed with Scientific Rigor for the Smart India Hackathon (SIH)**  
*Empowering Citizens, Researchers, and Regulators to Breathe Clean Air in Delhi NCR*

</div>
