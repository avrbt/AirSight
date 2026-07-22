Act as a Principal UI/UX Architect and Systems Engineer. Generate an ultra-robust, high-fidelity 9-page DARK TECH THEME application system for "AirSight"—an advanced AI-powered Air Quality Index tracking, forecasting, and source attribution platform built for a national hackathon.

---
### 🛑 CRITICAL DIRECTIVES & INTERACTION RULES (100% CLICKABLE)
1. MANDATORY PRESSABLE COMPONENTS: Every single button, tab pill, input field, dropdown menu, sidebar icon, chart filter, map checkbox, slider handle, modal trigger, and table row MUST be generated as an independent, fully pressable component container.
   - Every interactive element MUST have Auto-Layout padding, rounded corners (min 8px), defined borders/fills, and explicit style states for [Default State], [Hover State], and [Pressed State]. Zero bare text or un-encapsulated icons acting as buttons.
2. DYNAMIC AIRSIGHT BRANDING MODAL TRIGGER: The "AirSight" logo text + vector wind icon MUST be present at the top of the Global Sidebar and the Authentication Page header. Clicking the "AirSight" logo anywhere in the system MUST open a clean, 1-page concise "PROJECT FEATURES & ARCHITECTURE BRIEF" overlay page.
3. LIVE GPS LOCATION ENGINE (HEADER REPLACEMENT): Completely REMOVE any static dropdown list of cities (e.g., Chennai, Bengaluru, Delhi). In the top-right application header, replace it with an active, pressable primary button labeled "📍 Detect My Live GPS Location" paired with a smart search input field labeled "Search any custom area or postal code...".
4. DYNAMIC & DISTINCT GRAPH STATES: In Page 4 (Predictive Forecasting), the AI MUST generate distinct, visually unique vector graph shapes for EVERY pollutant (PM2.5, PM10, NO2, SO2) and model choice (XGBoost vs. LSTM).
   - PM2.5 with XGBoost MUST show a sharp, jagged spike curve in Danger Crimson (#EF4444).
   - NO2 with LSTM MUST show a smooth, rolling wave curve in Warning Amber (#F59E0B).
   - PM10 MUST show a separate step-stair trend curve in Safe Emerald (#10B981).
5. ABSOLUTE TYPOGRAPHY ALIGNMENT: Rigid vertical/horizontal grid layout with a minimum 24px structural gap. Hardcode line-heights and bounding boxes so text NEVER collides, overlaps, or clips vertically or horizontally.

---
### 🎨 DARK TECH COLOR PALETTE & BRANDING
- Global Canvas Background: Deep Pitch Charcoal (#070A12)
- Card Containers & Surfaces: High-contrast Dark Slate (#121826) with crisp subtle borders (#1E293B) and glow shadows.
- Typography: Pure White (#FFFFFF) and Cool Slate Gray (#94A3B8).
- Accent Hazard Tiers: Safe Emerald (#10B981), Warning Amber (#F59E0B), Danger Crimson (#EF4444), and Critical Violet (#7C3AED).

---
### 9-PAGE SYSTEM INTERFACES TO GENERATE (ALL AREAS 100% PRESSABLE)

#### PAGE 1: PROFESSIONAL AUTHENTICATION GATE (SIGN-UP & LOGIN LOGIC)
- Outer Branding Header: Displays prominent "AirSight" logo + icon (pressable to open Feature Brief) with a live system status badge [SYSTEM ONLINE].
- Layout: Two-column card structure. Left: Abstract GIS atmospheric node graphic. Right: Dynamic Auth Card with real-time validation states.
- View A (Register / Sign-Up Flow): 
  * Interactive input blocks for [Full Name Input Box], [Username Input Box], [Email Input Field with Pattern Error State: "e.g., user@domain.com"], and [Password Field with pressable eye-icon toggle].
  * An active, pressable [Terms & Conditions Checkbox].
  * Primary accent button: "[REGISTER NEW ACCOUNT]".
  * Error/Success Banner Area: An interactive notification toast: "⚠️ Account Not Found! Please Register First Before Login." or "✅ Registration Successful! Proceed to Login."
  * Footer trigger: "Already have an AirSight account? [SWITCH TO LOGIN]".
- View B (Login Access Flow):
  * Input blocks for [Username or Email] and [Password].
  * Interactive [Remember Me Toggle Switch].
  * Primary accent button: "[SECURE AIRSIGHT LOG IN]".
  * Footer link: "[Forgot Password Recovery?]".

#### PAGE 2: AIRSIGHT CONCISE PROJECT FEATURES & ARCHITECTURE BRIEF (NEW PAGE/MODAL)
- Overview: A high-impact, single-page executive summary card designed for hackathon judges that opens when clicking the "AirSight" logo.
- Layout (Concise 1-Page Layout):
  * Header: "AirSight — Next-Gen Atmospheric Intelligence & AI Attribution Platform" with a pressable "[✕ CLOSE BRIEF]" button.
  * Section 1 (Core Capability Matrix): 4 concise feature highlight cards: 
    1. Real-Time GIS Spatial Heatmaps (Ward-level spatial granularity).
    2. Dual AI Forecasting Engine (XGBoost for spatial matrices + LSTM for temporal trends).
    3. Explainable AI (XAI) Attribution (SHAP force plots for source sector identification).
    4. Automated Incident Dispatch (Configurable threshold triggers & webhook alerts).
  * Section 2 (System Tech Stack Bar): Clean pill icons for Python FastAPI, PostgreSQL/PostGIS, XGBoost/LSTM, React TypeScript, and Tailwind CSS.
  * Section 3 (Quick Action Footer): Primary pressable button: "[EXPLORE LIVE DASHBOARD DEMO]".

#### PAGE 3: LIVE CORE MONITORING DASHBOARD (INTERFACE 1 - WITH GPS LOCATION)
- Top Navigation Header:
  * Top Left: Pressable "AirSight" Logo + Icon.
  * Top Right: Interactive location controller containing a pressable "📍 Use Live GPS Location" accent button and an active text input box labeled "Search Ward, Sector, or Address...".
  * Utilities: Pressable [Alert Notification Hub Bell with Live Badge] and [User Profile Avatar Settings Tile].
- Persistent Left Sidebar: 8 stacked, individual pressable block buttons representing distinct system routes.
- Radial Diagnostic Gauge: A central circular vector AQI meter showing live telemetry score ($142 - Unhealthy$). The outer ring is a pressable ring component that expands detailed diagnostics on click.
- Pollutant Micro-Cards: 4 grid cards (PM2.5, PM10, NO2, SO2). Each card contains an independent, high-contrast, pressable square action button explicitly labeled "[Open Micro-Analytics Detail Window]".

#### PAGE 4: IMMERSIVE GIS SPATIAL WARD MAP (INTERFACE 2)
- Viewport Surface: Full-bleed municipal ward map with overlaid vector street coordinates reflecting the selected GPS coordinates.
- Left Layer Controller Panel: Floating card containing pressable checkbox rows: [[x] Heatmap Layer Toggle], [[x] Active Sensor Nodes Toggle], and [[x] Ward Boundaries Overlay]. Every row item is a pressable button box.
- Scrubber Deck: Base horizontal timeline controller featuring standalone, padded, pressable media buttons: [◀ REWIND], [⏸ PAUSE PREDICTION], [▶ RUN SIMULATION], and [▶▶ FAST FORWARD]. Includes an interactive sliding handle node on the temporal track.

#### PAGE 5: TIME-SERIES PREDICTIVE FORECASTING HUB (INTERFACE 3 - DYNAMIC GRAPHS)
- Top Interactive Toolbar (All Pressable): 
  * Pollutant Selector Tabs: Individual pressable pill buttons for [PM2.5], [PM10], [NO2], and [SO2].
  * Model Selection Dropdown: A bordered, pressable button labeled "[ML Pipeline: XGBoost Regressor ▾]" that opens an interactive menu containing [XGBoost Spatial Model] and [LSTM Sequential Model].
  * Granularity Pills: Pressable blocks for [24 Hours], [3 Days], [7 Days], [30 Days].
- Main Graph Canvas: Generate 2 DISTINCT GRAPH VARIANTS on this canvas to demonstrate functional dynamic state changes:
  * Variant 1 (PM2.5 + XGBoost): A jagged, high-variance line plot transitioning into a sharp Crimson-red dotted prediction spike curve with hover tooltips displaying "PM2.5: 158 µg/m³".
  * Variant 2 (NO2 + LSTM): A smooth, rolling wave line plot transitioning into an Amber-yellow dotted prediction curve with tooltips displaying "NO2: 42 ppb".

#### PAGE 6: ML POLLUTANT ATTRIBUTION & TRANSPARENCY PLATFORM (INTERFACE 4)
- XAI Split Workspace: 
  * Left Column: Interactive percentage donut chart (Traffic, Industrial, Biomass, Dust). Paired with a legend table where EVERY row item is an independent, pressable filter button that highlights that source sector when clicked.
  * Right Column: SHAP Force Plot graph showing positive/negative impact vectors. Includes pressable utility buttons at the base: a pressable [EXPORT DATASHEET] container button and a pressable [FILTER MODEL FEATURES] container button.

#### PAGE 7: TARGETED EMERGENCY ALERT SIMULATION STUDIO (INTERFACE 5)
- Parameter Form Card: Contains a pressable dropdown button labeled "[Select Targeted Threat Zone/Ward ▾]", a horizontal range slider bar with a draggable node handle for setting AQI limits, and individual clickable switch toggles: [Email Relay Switch Box], [System Push Notification Toggle], and [External Webhook API Relay Toggle].
- Active Incident Table: Clean data table listing system violations. Every row entry includes metadata fields and a dedicated, high-contrast, crimson-filled pressable component action button explicitly labeled "[DISPATCH CITIZEN ALERT BROADCAST]".

#### PAGE 8: SENSOR HEALTH & EDGE NODE ORCHESTRATION GRID (INTERFACE 6 - HACKATHON EXCLUSIVE)
- Hardware Command Center: Top row features 3 pressable status tile components: [Active Web-Nodes (42)], [Degraded Field Stations (3)], and [Offline Geo-Sensors (1)].
- Node Catalog Grid: Cards for each edge hardware sensor. Every entry includes a battery indicator icon, ward tag, and a padded rectangular utility button component explicitly labeled "[Ping Edge Node Diagnostic]".

#### PAGE 9: XAI MODEL BENCHMARKING & HYPERPARAMETER STUDIO (INTERFACE 7 - HACKATHON EXCLUSIVE)
- ML Evaluation Studio: Left side features comparison metric cards with an interactive toggle selector containing two large, pressable option buttons: "[Activate XGBoost Spatial Regressor]" and "[Activate LSTM Recurrent Temporal Network]".
- Hyperparameter Tuning Panel: Features interactive modifier fields, including numerical value adjuster boxes with pressable [+] and [-] increment triggers, and a primary accent-filled, shadow-cast CTA button component explicitly labeled "[RUN LIVE BACKEND RE-TRAINING PIPELINE]".
ise paste kar fir project final