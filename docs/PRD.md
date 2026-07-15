# AirSight AI — Product Requirements Document (PRD)

> **Document Status:** Draft v1.0  
> **Prepared By:** Product & Architecture Team  
> **Last Updated:** July 15, 2026  
> **Hackathon:** ET AI Hackathon 2026  
> **Classification:** Internal — For Review

---

## Table of Contents

1. [Vision](#1-vision)
2. [Problem Statement](#2-problem-statement)
3. [Existing Problems](#3-existing-problems)
4. [Opportunity](#4-opportunity)
5. [Goals](#5-goals)
6. [Non-Goals](#6-non-goals)
7. [User Personas](#7-user-personas)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [User Stories](#10-user-stories)
11. [User Flow](#11-user-flow)
12. [Success Metrics](#12-success-metrics)
13. [Risks](#13-risks)
14. [Future Scope](#14-future-scope)
15. [Product Roadmap](#15-product-roadmap)

---

## 1. Vision

> **"Make every breath a data point — and every data point an action."**

AirSight AI is a next-generation, AI-powered Urban Air Quality Intelligence Platform designed to transform how cities perceive, predict, and respond to air pollution. By fusing satellite imagery, ground-level AQI sensor networks, meteorological models, traffic telemetry, and land-use data into a unified intelligence layer, AirSight AI delivers **hyperlocal, real-time, and 72-hour predictive air quality insights** to governments, urban planners, researchers, and citizens alike.

We envision a world where no government policy on air quality is made without data, no citizen steps outside without a personalized health advisory, and no pollution source goes unattributed. AirSight AI is the operating system for cleaner cities.

---

## 2. Problem Statement

Urban air pollution is a silent public health crisis. India alone has 39 of the world's 50 most polluted cities (IQAir 2023). Despite the existence of CPCB and SPCB monitoring networks, the data remains:

- **Spatially sparse** — a single monitoring station covers tens of square kilometres
- **Reactively used** — readings are reported after pollution peaks occur
- **Siloed** — meteorological, traffic, satellite, and AQI data are never fused
- **Inaccessible** — raw AQI numbers are opaque to citizens and policymakers alike

Governments issue blanket advisories. Citizens lack personalized guidance. Polluters go unidentified. The result: avoidable deaths, ineffective policy, and mounting healthcare costs.

**AirSight AI solves this by replacing reactive monitoring with proactive intelligence.**

---

## 3. Existing Problems

### 3.1 Data & Infrastructure Gaps

| Problem | Impact |
|---|---|
| Sparse ground sensor coverage (avg. 1 station per 50 km²) | Hyperlocal AQI blind spots in most wards |
| No real-time fusion of satellite, ground, and traffic data | Incomplete pollution picture |
| Lack of standardized APIs across CPCB, IMD, and city portals | Manual, error-prone data aggregation |
| Missing historical ground-truth for ML model training | Lower model accuracy |

### 3.2 Analytical Gaps

| Problem | Impact |
|---|---|
| No ward-level or street-level AQI granularity | Policies apply uniformly, ignoring hotspots |
| No automated pollution source attribution | Industries and traffic go unaccountable |
| No probabilistic 72-hour AQI forecasting pipeline | Emergency preparedness is reactive |
| AQI data not correlated with land use or industrial zones | Root cause analysis is impossible |

### 3.3 Governance & Citizen Gaps

| Problem | Impact |
|---|---|
| Government advisories are generic and delayed | Low policy relevance and citizen trust |
| No risk-ranked dashboard for district-level planning | Budget allocation is not data-driven |
| Citizens receive raw AQI numbers without health context | Low public engagement and behaviour change |
| No multilingual or accessible interface for Tier 2/3 cities | Digital divide in air quality awareness |

---

## 4. Opportunity

### Market Context

- **$8.5B** — Global Air Quality Monitoring market by 2028 (MarketsandMarkets, 2023)
- **640M+** Indians live in cities that breach WHO PM2.5 guidelines annually
- **NCAP (National Clean Air Programme)** mandates 40% PM reduction by 2026 — governments urgently need tools
- **Smart Cities Mission** and **AMRUT 2.0** provide federal funding for exactly this type of AI infrastructure
- **Rising ESG pressure** on industries creates demand for third-party attribution data

### Why Now

1. **Satellite data democratisation** — Sentinel-5P, INSAT-3DR, and Planet Labs provide near-real-time pollution imagery at affordable cost
2. **Edge sensor proliferation** — Low-cost IoT AQI sensors (PurpleAir, SensirionSPS) now cover residential areas
3. **AI maturity** — Transformer-based spatiotemporal models (e.g., GraphCast, FourCastNet) enable reliable 72-hour atmospheric forecasts
4. **Government urgency** — NGT penalties and Supreme Court orders compel state governments to invest in compliance infrastructure

### Differentiation

| Capability | Status Quo | AirSight AI |
|---|---|---|
| Spatial Resolution | City-level | Ward/Street-level (100m) |
| Forecast Horizon | None | 72 hours (probabilistic) |
| Source Attribution | Manual, rare | Automated AI-driven |
| Data Sources Fused | 1–2 | 5+ (satellite, AQI, met, traffic, land use) |
| Citizen Interface | Raw AQI portals | Personalized health advisories |
| Government Tools | Static reports | Real-time risk-ranked dashboards |

---

## 5. Goals

### Primary Goals

- **G1 — Hyperlocal AQI Prediction:** Predict AQI at a spatial resolution of ≤ 500 metres using multi-source data fusion and ML inference.
- **G2 — Pollution Source Attribution:** Identify and rank top contributing pollution sources (industrial, vehicular, construction, biomass) at the ward level with ≥ 75% attribution accuracy.
- **G3 — 72-Hour Forecasting:** Deliver probabilistic 72-hour AQI forecasts (hourly intervals) with MAE ≤ 15 AQI units.
- **G4 — Ward/District Risk Ranking:** Generate daily, ranked heatmaps of wards and districts by pollution severity and health risk index.
- **G5 — AI-Generated Government Recommendations:** Produce structured, LLM-synthesised policy briefs and emergency action triggers (e.g., Graded Response Action Plan) for district commissioners and pollution control boards.
- **G6 — Citizen Health Advisory:** Deliver personalised, location-aware health advisories via web, mobile, and SMS/WhatsApp for vulnerable populations.
- **G7 — Interactive GIS Dashboard:** Provide an enterprise-grade, real-time GIS map interface for government users with drill-down capabilities to ward and street level.

### Secondary Goals

- **G8:** Establish a reproducible ML pipeline with automated retraining on new sensor data.
- **G9:** Build public-facing APIs for third-party integration (researchers, health apps, insurance).
- **G10:** Ensure the platform is deployable on state government infrastructure (on-premise or sovereign cloud).

---

## 6. Non-Goals

The following are explicitly **out of scope** for v1.0:

- **Indoor Air Quality Monitoring** — The platform targets outdoor urban environments only.
- **Carbon Credit or Emissions Trading** — Attribution data will not be used for regulatory enforcement in v1.0.
- **Wearable Device Integration** — Personal sensors (smartwatches, fitness trackers) are not ingested in v1.0.
- **Water or Soil Pollution** — The platform is scoped exclusively to air quality.
- **Real-time Traffic Control** — AirSight AI does not interface with traffic signal systems or autonomous vehicles.
- **Automated Legal Actions** — AI-generated recommendations are advisory only; enforcement remains with human authorities.
- **Global Coverage** — v1.0 targets Indian metropolitan and Tier 1 cities. Global rollout is future scope.
- **Hardware Manufacturing** — AirSight AI is a software and intelligence platform; it does not manufacture AQI sensors.

---

## 7. User Personas

### Persona 1 — Priya Sharma | City District Collector

> *"I need to know which wards are at critical pollution levels before I issue Section 144 orders. I can't act on a city-average number."*

- **Role:** District Collector, Tier 1 metropolitan authority
- **Age:** 42 | **Technical Comfort:** Medium
- **Goals:** Make defensible, data-backed decisions on Graded Response Action Plan (GRAP) triggers; protect vulnerable populations; demonstrate accountability to state government
- **Pain Points:** Receives CPCB data 24–48 hours late; no ward-level breakdown; no actionable next steps embedded in reports
- **Key Features Used:** Risk ranking dashboard, AI-generated policy briefs, 72-hour forecast, emergency alert system

---

### Persona 2 — Dr. Anil Verma | CPCB Regional Officer

> *"Attribution is the hardest part. Every industry blames the neighbour. I need evidence that holds up."*

- **Role:** Regional Officer, Central Pollution Control Board
- **Age:** 51 | **Technical Comfort:** High
- **Goals:** Attribute pollution spikes to specific industrial or traffic sources; generate compliance evidence; file enforcement reports
- **Pain Points:** No automated source-fingerprinting tool; satellite data requires manual GIS analysis; reports take weeks to compile
- **Key Features Used:** Source attribution engine, satellite overlay, export-ready PDF reports, API access

---

### Persona 3 — Ananya Rao | Urban Planner, Smart City SPV

> *"I need to know how zoning changes and new highways will affect air quality five years from now."*

- **Role:** Urban Planner, Smart City Special Purpose Vehicle
- **Age:** 34 | **Technical Comfort:** High
- **Goals:** Model the air quality impact of proposed infrastructure changes; incorporate AQI projections into master plans
- **Pain Points:** No scenario modelling tool; land-use data is not correlated with pollution; no API for integrating AQI into city planning software
- **Key Features Used:** GIS dashboard, land-use correlation layer, API, scenario modelling (future scope)

---

### Persona 4 — Rohan Mehta | Asthma Patient, Daily Commuter

> *"I just want to know if I should wear my N95 today, and which route to take to school."*

- **Role:** Citizen, Tier 1 city resident with respiratory condition
- **Age:** 29 | **Technical Comfort:** High (smartphone native)
- **Goals:** Make safe daily decisions; plan outdoor activities; protect his child from high-pollution exposure windows
- **Pain Points:** AQI apps show city-level numbers that don't reflect his neighbourhood; no personalised health guidance; no route-level pollution data
- **Key Features Used:** Citizen mobile app, personalised health advisory, hyperlocal AQI widget, WhatsApp alerts

---

### Persona 5 — Kavitha Nair | ASHA Health Worker, Peri-urban Area

> *"My patients are labourers working outdoors. They don't own smartphones. I need to warn them in their language."*

- **Role:** Accredited Social Health Activist (ASHA), rural/peri-urban interface
- **Age:** 38 | **Technical Comfort:** Low
- **Goals:** Receive timely, simple warnings for her assigned area; relay them to labourers and elderly patients
- **Pain Points:** No offline or SMS-based advisory; all existing apps require English literacy; no alerts for extreme outdoor-labour risk
- **Key Features Used:** SMS/WhatsApp advisory (vernacular), simplified risk colour codes, IVR alerts (future scope)

---

### Persona 6 — Siddharth Jain | ESG Analyst, Industrial Conglomerate

> *"Regulators are increasingly asking us to prove our emissions are not causing local AQI spikes. We need a credible third-party baseline."*

- **Role:** Head of ESG & Sustainability, large manufacturing group
- **Age:** 44 | **Technical Comfort:** Medium–High
- **Goals:** Benchmark facility-level emission impact; prepare BRSR/ESG disclosures; respond to regulatory queries with data
- **Pain Points:** No neutral, AI-verified third-party attribution data; internal monitoring is perceived as biased by regulators
- **Key Features Used:** Attribution reports, API, exportable compliance reports (future scope — paid tier)

---

## 8. Functional Requirements

### 8.1 Data Ingestion & Integration Layer

| ID | Requirement | Priority |
|---|---|---|
| FR-DI-01 | Ingest real-time AQI data from CPCB Open Data API and state SPCB feeds (PM2.5, PM10, NO₂, SO₂, O₃, CO) | P0 |
| FR-DI-02 | Integrate Sentinel-5P satellite imagery (TROPOMI) for NO₂, aerosol optical depth (AOD), and SO₂ column data at ≤ 3.5 km resolution | P0 |
| FR-DI-03 | Ingest IMD and ERA5 meteorological data: wind speed/direction, temperature, humidity, boundary layer height, precipitation, UV index | P0 |
| FR-DI-04 | Integrate real-time traffic density data via Google Maps Platform Traffic API or city ATMS feeds | P1 |
| FR-DI-05 | Ingest land-use and industrial zone data from city GIS portals (shapefile/GeoJSON format) | P1 |
| FR-DI-06 | Support low-cost IoT sensor networks (PurpleAir API, custom ESP32-based nodes) for gap-filling in station-sparse areas | P1 |
| FR-DI-07 | All data pipelines must be idempotent, schema-validated, and log ingestion failures with automatic retry | P0 |
| FR-DI-08 | Support configurable polling intervals per data source (real-time: ≤ 15 min; satellite: daily) | P1 |

### 8.2 AI/ML Intelligence Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-ML-01 | Hyperlocal AQI prediction model: spatiotemporal ML (Graph Neural Network or Transformer) producing per-grid AQI at 500m resolution every 15 minutes | P0 |
| FR-ML-02 | 72-hour probabilistic AQI forecast model (hourly intervals) with confidence intervals (P10–P90) per grid cell | P0 |
| FR-ML-03 | Pollution source attribution model: identify and rank contributing source categories (industrial, vehicular, construction, biomass burning, dust) per ward | P0 |
| FR-ML-04 | Anomaly detection: automatically flag statistically significant AQI spikes beyond 2σ of 7-day rolling baseline | P1 |
| FR-ML-05 | Ward/District Risk Index: composite scoring model combining AQI level, population density, sensitive population fraction, and exposure duration | P1 |
| FR-ML-06 | Model versioning and A/B evaluation pipeline with automated rollback on performance degradation | P1 |
| FR-ML-07 | Weekly automated retraining pipeline triggered by new ground-truth sensor data | P2 |
| FR-ML-08 | LLM-powered natural language synthesis of AI recommendations and policy briefs using structured prompt templates | P0 |

### 8.3 Government Dashboard & GIS Interface

| ID | Requirement | Priority |
|---|---|---|
| FR-GOV-01 | Interactive GIS map with selectable layers: AQI heatmap, source attribution, risk index, satellite overlay, traffic density, ward boundaries | P0 |
| FR-GOV-02 | Ward and district drill-down: clicking any polygon shows detailed AQI breakdown, dominant pollutants, source attribution, and 72-hour forecast | P0 |
| FR-GOV-03 | Daily risk-ranked leaderboard of all wards/districts sorted by composite Health Risk Index | P0 |
| FR-GOV-04 | Automated GRAP-level trigger alerts (AQI thresholds for Stage I–IV) with recommended actions per CPCB guidelines | P0 |
| FR-GOV-05 | AI-generated policy brief: PDF/structured report summarising top 3 pollution sources, affected population, recommended interventions, and expected impact | P1 |
| FR-GOV-06 | Historical trend explorer: 30-day, 90-day, and annual AQI trend charts per ward with pollutant breakdown | P1 |
| FR-GOV-07 | Data export: CSV, GeoJSON, and PDF export for all dashboard views | P1 |
| FR-GOV-08 | Role-based access control (RBAC): District Admin, State Admin, Researcher, Read-Only Viewer | P0 |

### 8.4 Citizen Health Advisory Interface

| ID | Requirement | Priority |
|---|---|---|
| FR-CIT-01 | Progressive Web App (PWA) and native mobile app (iOS/Android) with real-time hyperlocal AQI for the user's GPS location | P0 |
| FR-CIT-02 | Personalised health advisory engine: generate risk guidance based on AQI level AND user health profile (e.g., asthma, COPD, elderly, pregnant, child) | P0 |
| FR-CIT-03 | Outdoor activity recommendations: risk-scored suggestions for exercise, commute, and outdoor events based on forecast AQI | P1 |
| FR-CIT-04 | "Best Time to Go Outside" feature: identify lowest-AQI windows within the next 24 hours for a user's location | P1 |
| FR-CIT-05 | Push notifications and WhatsApp/SMS alerts when AQI at user location crosses user-defined thresholds | P0 |
| FR-CIT-06 | Multilingual support: English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali (extendable) | P1 |
| FR-CIT-07 | Simplified colour-coded AQI display (traffic-light system) for low-literacy users | P0 |
| FR-CIT-08 | Symptom logging: allow users to log respiratory symptoms, contributing to epidemiological datasets (opt-in, anonymised) | P2 |

### 8.5 API & Integration

| ID | Requirement | Priority |
|---|---|---|
| FR-API-01 | RESTful and GraphQL API endpoints for hyperlocal AQI, 72-hour forecast, and source attribution (authenticated, rate-limited) | P1 |
| FR-API-02 | Webhook support for government systems to receive push alerts on GRAP threshold breaches | P1 |
| FR-API-03 | OpenAPI 3.0 specification documentation for all public endpoints | P1 |
| FR-API-04 | SDK libraries in Python, JavaScript, and Java for third-party integrator ease of access | P2 |

---

## 9. Non-Functional Requirements

### 9.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | AQI prediction API response latency | ≤ 500ms at P95 |
| NFR-PERF-02 | Dashboard initial load time (GIS map with all layers) | ≤ 3 seconds on 4G |
| NFR-PERF-03 | 72-hour forecast generation time (end-to-end pipeline) | ≤ 10 minutes per run |
| NFR-PERF-04 | Data ingestion pipeline lag (sensor reading to database) | ≤ 15 minutes |
| NFR-PERF-05 | Citizen app AQI refresh interval | ≤ 15 minutes |

### 9.2 Availability & Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-REL-01 | Platform uptime SLA | 99.9% (≤ 8.7 hrs downtime/year) |
| NFR-REL-02 | Graceful degradation: serve cached predictions if live data pipelines fail | Required |
| NFR-REL-03 | Recovery Time Objective (RTO) | ≤ 30 minutes |
| NFR-REL-04 | Recovery Point Objective (RPO) | ≤ 1 hour of data loss |
| NFR-REL-05 | Multi-region failover for government-critical dashboards | Required |

### 9.3 Scalability

| ID | Requirement | Target |
|---|---|---|
| NFR-SCAL-01 | Concurrent dashboard users | 10,000+ without degradation |
| NFR-SCAL-02 | API throughput | 1,000 requests/second sustained |
| NFR-SCAL-03 | Citizen app registered users | Scale to 10 million users |
| NFR-SCAL-04 | City coverage | Horizontally scalable to 100 cities without re-architecture |

### 9.4 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | All data in transit encrypted with TLS 1.3 |
| NFR-SEC-02 | Data at rest encrypted with AES-256 |
| NFR-SEC-03 | Authentication via OAuth 2.0 / SAML 2.0 for government SSO integration |
| NFR-SEC-04 | Citizen PII (health profile, location) stored with field-level encryption and user consent framework (DPDP Act 2023 compliant) |
| NFR-SEC-05 | API keys scoped with least-privilege permissions; rate-limited per key |
| NFR-SEC-06 | Penetration testing prior to production launch; OWASP Top 10 compliance |
| NFR-SEC-07 | Audit logs for all privileged government dashboard actions, retained for 7 years |

### 9.5 Accuracy & Model Quality

| ID | Requirement | Target |
|---|---|---|
| NFR-ML-01 | Hyperlocal AQI prediction MAE | ≤ 10 AQI units at 500m resolution |
| NFR-ML-02 | 72-hour AQI forecast MAE | ≤ 15 AQI units at P50 |
| NFR-ML-03 | Source attribution accuracy | ≥ 75% (validated against CPCB receptor modelling) |
| NFR-ML-04 | AQI anomaly detection precision | ≥ 85% precision, ≤ 10% false positive rate |
| NFR-ML-05 | Model drift detection and alerting | Automated; retrain triggered if MAE degrades > 20% |

### 9.6 Compliance & Privacy

- Compliant with **India's Digital Personal Data Protection Act (DPDP) 2023**
- Aligns with **CPCB National AQI Standards** (IS 18530)
- Citizen health profiles stored with **explicit opt-in consent**
- Anonymised and aggregated data only exposed via public APIs
- Government data sovereignty: option for **on-premise or sovereign cloud deployment**

---

## 10. User Stories

### Government Stakeholders

**US-GOV-01**
> *As a District Collector, I want to see a real-time risk-ranked list of wards in my district, so that I can prioritise enforcement and emergency response resources.*

**US-GOV-02**
> *As a CPCB officer, I want an AI-generated PDF report attributing yesterday's AQI spike to specific pollution sources with supporting satellite imagery, so that I can file a compliance notice backed by evidence.*

**US-GOV-03**
> *As a State Environment Secretary, I want a 72-hour pollution forecast for all districts, so that I can proactively activate GRAP Stage III restrictions before the crisis peaks.*

**US-GOV-04**
> *As a Smart City programme manager, I want to overlay proposed highway corridors on the AQI heatmap, so that I can assess the projected pollution impact during the city masterplan review.*

**US-GOV-05**
> *As a Government IT administrator, I want role-based access control so that ward officers see only their ward data and state officials can see all districts.*

---

### Citizen Users

**US-CIT-01**
> *As an asthma patient, I want a personalised daily health advisory that accounts for my condition and today's AQI at my exact neighbourhood, so I know whether to take my rescue inhaler before I step outside.*

**US-CIT-02**
> *As a parent, I want a WhatsApp alert when AQI near my child's school crosses "Unhealthy" levels, so I can arrange indoor pickup.*

**US-CIT-03**
> *As a morning runner, I want to know the safest 1-hour window to jog today based on hourly AQI forecasts for my area.*

**US-CIT-04**
> *As a low-literacy user, I want to see a simple coloured indicator (Green/Yellow/Red) on my phone that tells me if the air is safe today without needing to understand AQI numbers.*

**US-CIT-05**
> *As a construction labourer working outdoors, I want to receive an SMS warning in Hindi when PM10 levels exceed dangerous thresholds so I can use my mask.*

---

### Researcher & API Users

**US-API-01**
> *As an academic researcher, I want to query historical hyperlocal AQI data via API to correlate pollution exposure with hospital admission records.*

**US-API-02**
> *As a health insurance company data scientist, I want a webhook that fires whenever the AQI Risk Index for a district crosses "Severe," so I can flag elevated claims risk in that zone.*

**US-API-03**
> *As a mobility app developer, I want the pollution forecast API so I can recommend lower-pollution commute routes in my navigation app.*

---

## 11. User Flow

### 11.1 Government User — Daily Briefing Flow

```
Login (SAML SSO)
       |
       v
   Home Dashboard
 +----------------------------------------------------------+
 |  Risk Rank Widget  |  City AQI Map  |  Alert Tray        |
 +----------------------------------------------------------+
       |
       v
 [Click Ward on Map]
       |
       v
  Ward Detail Panel
 +---------------------------------------+
 |  Live AQI  |  Pollutant Breakdown     |
 |  72-hr Forecast Chart                 |
 |  Source Attribution Donut Chart       |
 |  Satellite Overlay Toggle             |
 +---------------------------------------+
       |
       v
 [Generate AI Policy Brief]
       |
       v
  LLM-generated PDF: Top sources,
  affected population, recommended
  GRAP actions, expected AQI improvement
       |
       v
 [Download PDF / Share via email]
       |
       v
 [Set Alert Threshold] --> Webhook / Email when AQI > X
```

---

### 11.2 Citizen User — Morning Health Check Flow

```
Open AirSight App / PWA
       |
       v
 Location Permission Request (first time)
       |
       v
 Home Screen:
 +---------------------------------+
 |  AQI: 178 (Moderate)            |
 |  Your Neighbourhood: Andheri W  |
 |  Primary Pollutant: PM2.5       |
 |                                 |
 |  Health Advisory (for you):     |
 |  "Limit outdoor exposure.       |
 |   Carry your inhaler."          |
 +---------------------------------+
       |
       +---> [See 24-hr Forecast]
       |          |
       |          v
       |    Hourly chart showing
       |    best window: 6-7 AM (AQI: 112)
       |
       +---> [Set Alert]
       |          |
       |          v
       |    Configure threshold --> WhatsApp / Push
       |
       +---> [Share with Family]
                  |
                  v
            Deep link or WhatsApp
            card with local AQI
```

---

### 11.3 CPCB Officer — Attribution Investigation Flow

```
Login --> Attribution Module
       |
       v
 Select City + Date Range + Ward
       |
       v
 Attribution Results Panel:
 +------------------------------------------+
 |  Source 1: Industrial (42%) -- Zone A     |
 |  Source 2: Vehicular (31%) -- NH-8        |
 |  Source 3: Construction (18%) -- Sector 7 |
 |  Source 4: Biomass (9%) -- Periphery      |
 +------------------------------------------+
       |
       v
 [View Satellite Evidence]
  --> Sentinel-5P SO2/NO2 column overlay
  --> Ground-sensor correlation heatmap
       |
       v
 [Export Compliance Report]
  --> PDF with attribution evidence,
      satellite images, and
      model confidence scores
```

---

## 12. Success Metrics

### 12.1 Model Performance KPIs

| Metric | Definition | Target (v1.0) |
|---|---|---|
| Hyperlocal AQI MAE | Mean Absolute Error vs. held-out ground sensors | ≤ 10 AQI units |
| Forecast MAE (24h) | 24-hour ahead forecast MAE | ≤ 12 AQI units |
| Forecast MAE (72h) | 72-hour ahead forecast MAE | ≤ 15 AQI units |
| Attribution Accuracy | F1 score vs. CPCB receptor model ground truth | ≥ 0.75 F1 |
| Anomaly Precision | Spike detection precision (events ≥ 200 AQI) | ≥ 85% |

### 12.2 Platform & Adoption KPIs

| Metric | Definition | Target (6 months post-launch) |
|---|---|---|
| Government DAU | Daily active government dashboard users | ≥ 500 across pilot cities |
| Citizen App Installs | Total installs across pilot cities | ≥ 100,000 |
| Alert Open Rate | % of push/WhatsApp alerts opened within 1 hour | ≥ 60% |
| Data Freshness SLA | % of AQI grids updated within 15 minutes | ≥ 98% |
| API Uptime | % of time API returns ≤ 500ms at P95 | ≥ 99.9% |
| Report Exports | Government policy brief PDFs generated/month | ≥ 1,000 |

### 12.3 Public Health Impact KPIs (12-month targets)

| Metric | Definition | Target |
|---|---|---|
| GRAP Activations | Instances where platform alert preceded official GRAP trigger | ≥ 80% of GRAP events pre-warned by system |
| Vulnerable Population Reach | Users self-identified as high-risk (asthma, elderly, pregnant) | ≥ 20,000 |
| Citizen Behaviour Change | % of alert recipients who report taking protective action | ≥ 50% (survey-based) |
| Policy Integration | State/city governments formally incorporating AirSight data in official reports | ≥ 3 governments within 12 months |

---

## 13. Risks

### 13.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R-T-01: Sensor data gaps** — CPCB API unreliable; sparse ground coverage in Tier 2 cities | High | High | Multi-source fallback (satellite + IoT sensors); gap-filling via Kriging spatial interpolation |
| **R-T-02: Satellite data latency** — Sentinel-5P revisit time is 1–2 days; cloud cover causes data gaps | High | Medium | Blend with ERA5 reanalysis; use MODIS AOD as backup; flag low-confidence predictions |
| **R-T-03: Model accuracy degradation** — Seasonal distribution shifts (monsoon vs. winter) | Medium | High | Seasonal fine-tuning cycles; automated drift detection with human-in-the-loop review |
| **R-T-04: Scalability bottleneck** — GIS map rendering at 500m resolution across all India wards | Medium | Medium | Server-side tile rendering (MapTiler/Mapbox GL); progressive loading; CDN edge caching |
| **R-T-05: LLM hallucination in policy briefs** — AI generates incorrect attribution or policy advice | Medium | High | Constrained structured output templates; factual grounding in model outputs; mandatory human review before official submission |

### 13.2 Data & Privacy Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R-D-01: DPDP compliance failure** — Citizen health profile data mishandled | Low | Critical | Privacy-by-design architecture; DPDP DPO appointment; privacy impact assessment |
| **R-D-02: Data source discontinuation** — CPCB changes APIs or restricts access | Medium | High | Maintain direct MoU with CPCB; build multi-source resilience; local caching |
| **R-D-03: Adversarial sensor tampering** — Industrial actors submitting false readings to local sensors | Low | High | Anomaly detection cross-validated against satellite; sensor reputation scoring |

### 13.3 Business & Adoption Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R-B-01: Government adoption friction** — Bureaucratic procurement cycles delay pilot deployment | High | High | Hackathon visibility; MoU with pilot municipalities; open-source core for government pilots |
| **R-B-02: Citizen distrust** — Users distrust AI-generated health advice | Medium | Medium | Transparent confidence scores; AIIMS/medical board endorsement of advisory templates; clear disclaimers |
| **R-B-03: Competitor platforms** — IQAir, BreezoMeter, or government-built tools gain first-mover advantage | Medium | Medium | Focus on India-specific deep integrations (CPCB, IMD, city GIS); language localisation; government-grade attribution tools |
| **R-B-04: Funding dependency** — Platform relies on hackathon momentum without a sustainable model | Medium | High | Dual revenue model: government SaaS licensing + premium API for commercial users |

---

## 14. Future Scope

### Phase 3 — Advanced Intelligence (12–24 months)

- **Scenario Modelling Engine:** Simulate AQI impact of proposed urban interventions (new highways, factory closures, EV adoption rates) using causal ML models
- **Ensemble Forecasting:** Ensemble of multiple NWP models (ECMWF AIFS, Google GraphCast, NCEP GFS) for higher-accuracy 5-day forecasting
- **Emission Inventory Integration:** Fuse with UNFCCC/MoEFCC emission inventories for per-sector emission contribution tracking
- **Air Quality Digital Twin:** City-level physics-informed neural network digital twin for "what-if" planning

### Phase 3 — Expanded Coverage & Integrations

- **Indoor AQI Module:** Integration with smart building HVAC sensors for indoor/outdoor AQI correlation
- **Health System Integration:** Anonymised AQI-exposure correlation with ABDM (Ayushman Bharat Digital Mission) health records for epidemiological research
- **IVR / Voice Advisory:** Toll-free IVR system delivering AQI advisories in vernacular languages for feature-phone users
- **Agriculture Extension:** Extend platform to rural areas — correlation of stubble burning events with downwind AQI impacts

### Phase 4 — Platform & Ecosystem

- **AirSight API Marketplace:** Third-party developer ecosystem (health apps, insurance, smart city platforms) with usage-based billing
- **Carbon Attribution Module:** Extend source attribution to CO₂ equivalent for ESG and BRSR disclosures
- **Global Expansion:** Adaptation for ASEAN, Middle East, and African cities with localised data source connectors
- **Regulatory Compliance SaaS:** Automated compliance report filing for industries under CPCB EPR norms

---

## 15. Product Roadmap

```
=================================================================
PHASE 0 — Foundation (Months 0–2) | Hackathon MVP
=================================================================
 * CPCB + IMD + Sentinel-5P data pipeline (2 cities)
 * Baseline spatiotemporal AQI prediction model (city grid)
 * 72-hour AQI forecast pipeline (v1 — statistical baseline)
 * GIS dashboard prototype (React + MapLibre GL)
 * Citizen PWA with colour-coded AQI widget
 * LLM-generated policy brief (GPT-4o / Gemini Pro prompt)
 * Hackathon demo & evaluation

=================================================================
PHASE 1 — Alpha (Months 3–5) | Pilot with 2 Governments
=================================================================
 * Production data pipelines: CPCB, IMD, Traffic, IoT sensors
 * GNN-based hyperlocal AQI model (500m resolution)
 * Pollution source attribution engine v1 (4 source categories)
 * Ward/District Risk Ranking dashboard (production)
 * RBAC for government users; SAML SSO integration
 * Citizen app: iOS + Android native (personalised advisories)
 * WhatsApp/SMS alert integration
 * Government pilot MoU: 2 metro cities
 * DPDP compliance review & audit

=================================================================
PHASE 2 — Beta (Months 6–9) | Scale to 10 Cities
=================================================================
 * Expand to 10 cities (all major NCAP priority cities)
 * 72-hour probabilistic ensemble forecast (ML + NWP fusion)
 * Source attribution v2: satellite + receptor model validation
 * AI Policy Brief PDF generation (structured + LLM layer)
 * Public API (REST + GraphQL) with OpenAPI docs
 * Multilingual citizen app (7 languages)
 * Automated model retraining pipeline
 * Penetration testing & security audit
 * Media launch + NCAP alignment presentation to MoEFCC

=================================================================
PHASE 3 — GA (Months 10–18) | Production SaaS + Impact
=================================================================
 * 50-city coverage across India
 * Scenario modelling (infrastructure impact simulation)
 * API marketplace for developers & health ecosystems
 * Government SaaS licensing (annual subscription model)
 * Health system integration pilot (ABDM anonymised data)
 * IVR voice advisory for rural/peri-urban users
 * Series A fundraise / government contract close
 * ESG attribution module (commercial tier)
```

---

## Appendix A — Key Data Sources

| Source | Data Type | Frequency | Access |
|---|---|---|---|
| CPCB Open Data API | AQI (PM2.5, PM10, NO₂, SO₂, O₃, CO) | 15-minute | Open (rate-limited) |
| Sentinel-5P (ESA TROPOMI) | NO₂, SO₂, CO, Aerosol columns | Daily | Open (Copernicus Hub) |
| IMD Forecast API | Wind, humidity, temperature, BLH | Hourly | Licensed |
| ERA5 Reanalysis (ECMWF) | Historical meteorology | Sub-hourly | Open (CDS API) |
| Google Maps Traffic API | Traffic density, speed | Real-time | Commercial |
| PurpleAir API | Low-cost PM2.5 sensor network | 2-minute | Open / Commercial |
| City GIS Portals | Ward boundaries, land use, industrial zones | Static (periodic) | Open / Request |
| MODIS Terra/Aqua | Aerosol Optical Depth (AOD) | Daily | Open (NASA LAADS) |

---

## Appendix B — Technology Stack (Reference Architecture)

| Layer | Technology |
|---|---|
| **Data Ingestion** | Apache Kafka, Apache Airflow, Python |
| **Data Storage** | PostgreSQL + PostGIS, TimescaleDB, MinIO (raw satellite) |
| **ML Training** | PyTorch, PyTorch Geometric (GNN), Hugging Face |
| **ML Serving** | FastAPI + Triton Inference Server |
| **LLM Integration** | Gemini Pro / GPT-4o via structured prompt chains |
| **GIS Visualisation** | MapLibre GL JS, GeoServer, PostGIS |
| **Frontend** | React.js + TypeScript (dashboard), React Native (citizen app) |
| **Infrastructure** | Kubernetes (GKE / AWS EKS), Terraform, Prometheus + Grafana |
| **Security** | HashiCorp Vault, Auth0, Cloudflare WAF |
| **CI/CD** | GitHub Actions, ArgoCD |

---

## Appendix C — Glossary

| Term | Definition |
|---|---|
| **AQI** | Air Quality Index — a composite index representing overall air pollution level |
| **PM2.5 / PM10** | Particulate matter ≤ 2.5µm / ≤ 10µm; primary health-risk pollutants |
| **CPCB** | Central Pollution Control Board, India |
| **GRAP** | Graded Response Action Plan — India's emergency air quality action framework |
| **NCAP** | National Clean Air Programme — GoI target of 40% PM reduction by 2026 |
| **TROPOMI** | TROPOspheric Monitoring Instrument aboard Sentinel-5P satellite |
| **AOD** | Aerosol Optical Depth — satellite-derived measure of atmospheric particulates |
| **GNN** | Graph Neural Network — ML architecture suited for spatially-correlated data |
| **BLH** | Boundary Layer Height — meteorological parameter governing pollutant dispersion |
| **MAE** | Mean Absolute Error — primary ML forecast quality metric |
| **DPDP** | Digital Personal Data Protection Act, India, 2023 |
| **RBAC** | Role-Based Access Control |
| **NWP** | Numerical Weather Prediction — physics-based atmospheric simulation models |

---

*© 2026 AirSight AI. Internal document. All rights reserved.*  
*Prepared for ET AI Hackathon 2026 submission.*
