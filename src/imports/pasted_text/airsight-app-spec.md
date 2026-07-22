Act as a Principal UI/UX Architect and Systems Engineer. Generate an ultra-robust, high-fidelity 8-page DARK TECH THEME application system for "AirSight"—an advanced AI-powered Air Quality Index tracking, forecasting, and source attribution platform built for a national hackathon.

---
### 🛑 CRITICAL DIRECTIVES & INTERACTION RULES (100% CLICKABLE)
1. MANDATORY PRESSABLE COMPONENTS: Every single button, tab pill, input field, dropdown menu, sidebar icon, chart filter, map checkbox, slider handle, and table row MUST be generated as an independent, fully pressable component container. 
   - Every interactive element MUST have Auto-Layout padding, rounded corners (min 8px), defined borders/fills, and explicit style states for [Default State], [Hover State], and [Pressed State]. Zero bare text or un-encapsulated icons acting as buttons.
2. DYNAMIC & DISTINCT GRAPH STATES (CRITICAL FIX): In Page 4 (Predictive Forecasting), the AI MUST generate distinct, visually unique vector graph shapes for EVERY pollutant ($PM_{2.5}$, $PM_{10}$, $NO_2$, $SO_2$) and model choice (XGBoost vs. LSTM). 
   - $PM_{2.5}$ with XGBoost MUST show a sharp, jagged spike curve in Danger Crimson (#EF4444).
   - $NO_2$ with LSTM MUST show a smooth, rolling wave curve in Warning Amber (#F59E0B).
   - $PM_{10}$ MUST show a separate step-stair trend curve in Safe Emerald (#10B981).
   - Under no circumstances should the chart line remain identical across different selections!
3. ABSOLUTE TYPOGRAPHY ALIGNMENT: Rigid vertical/horizontal grid layout with a minimum 24px structural gap. Hardcode line-heights and bounding boxes so text NEVER collides, overlaps, or clips vertically or horizontally.

---
### 🎨 DARK TECH COLOR PALETTE & BRANDING
- Project Branding: "AirSight" logo text accompanied by a sleek vector wind/cloud icon must be prominently displayed on the Auth Landing Page (Outside) and top-left of the Global Sidebar (Inside).
- Global Canvas Background: Deep Pitch Charcoal (#070A12)
- Card Containers & Surfaces: High-contrast Dark Slate (#121826) with crisp subtle borders (#1E293B) and glow shadows.
- Typography: Pure White (#FFFFFF) and Cool Slate Gray (#94A3B8).
- Accent Hazard Tiers: Safe Emerald (#10B981), Warning Amber (#F59E0B), Danger Crimson (#EF4444), and Critical Violet (#7C3AED).

---
### 8-PAGE SYSTEM INTERFACES TO GENERATE (ALL AREAS 100% PRESSABLE)

#### PAGE 1: PROFESSIONAL AUTHENTICATION GATE (SIGN-UP & LOGIN LOGIC)
- Outer Branding Header: Displays prominent "AirSight" logo + icon with a live system status indicator badge [SYSTEM ONLINE].
- Layout: Two-column card structure. Left: Abstract GIS atmospheric node graphic with "AirSight" tagline. Right: Dynamic Auth Card with real-time validation states.
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

#### PAGE 2: LIVE AIRSIGHT ADVANCED CORE MONITORING DASHBOARD (INTERFACE 1)
- Header & Sidebar: Persistent left sidebar featuring the "AirSight" small logo at top and 8 pressable route icon blocks. Top bar contains a pressable dropdown button labeled "[Select Municipal Ward ▾]", a search input box, and a pressable [Alert Notification Hub Bell].
- Radial Diagnostic Gauge: A central circular vector AQI meter showing live atmospheric score ($142 - Unhealthy$). The outer ring is a pressable ring component that expands detailed diagnostic metrics when clicked.
- Pollutant Micro-Cards: 4 distinct grid cards ($PM_{2.5}$, $PM_{10}$, $NO_2$, $SO_2$). Each card contains an independent, high-contrast, pressable square action button explicitly labeled "[Open Micro-Analytics Detail Window]".

#### PAGE 3: IMMERSIVE GIS SPATIAL WARD MAP (INTERFACE 2)
- Viewport Surface: Full-bleed municipal ward map with overlaid vector street coordinates.
- Left Layer Controller Panel: Floating white/dark card containing pressable checkbox rows: [[x] Heatmap Layer Toggle], [[x] Active Sensor Nodes Toggle], and [[x] Ward Boundaries Overlay]. Every row item is a pressable button box.
- Scrubber Deck: Base horizontal timeline controller featuring standalone, padded, pressable media buttons: [◀ REWIND], [⏸ PAUSE PREDICTION], [▶ RUN SIMULATION], and [▶▶ FAST FORWARD]. Includes an interactive sliding handle node on the temporal track.

#### PAGE 4: TIME-SERIES PREDICTIVE FORECASTING HUB (INTERFACE 3 - DYNAMIC GRAPHS)
- Top Interactive Toolbar (All Pressable): 
  * Pollutant Selector Tabs: Individual pressable pill buttons for [PM2.5], [PM10], [NO2], and [SO2].
  * Model Selection Dropdown: A bordered, pressable button labeled "[ML Pipeline: XGBoost Regressor ▾]" that opens an interactive menu containing [XGBoost Spatial Model] and [LSTM Sequential Model].
  * Granularity Pills: Pressable blocks for [24 Hours], [3 Days], [7 Days], [30 Days].
- Main Graph Canvas: Generate 2 DISTINCT GRAPH VARIANTS on this canvas to show functionality:
  * Variant 1 ($PM_{2.5}$ + XGBoost): A jagged, high-variance line plot transitioning into a sharp Crimson-red dotted prediction spike curve with hover tooltips displaying "$PM_{2.5}: 158 \mu g/m^3$".
  * Variant 2 ($NO_2$ + LSTM): A smooth, rolling wave line plot transitioning into an Amber-yellow dotted prediction curve with tooltips displaying "$NO_2$: 42 ppb".

#### PAGE 5: ML POLLUTANT ATTRIBUTION & TRANSPARENCY PLATFORM (INTERFACE 4)
- XAI Split Workspace: 
  * Left Column: Interactive percentage donut chart (Traffic, Industrial, Biomass, Dust). Paired with a legend table where EVERY row item is an independent, pressable filter button that highlights that source sector when clicked.
  * Right Column: SHAP Force Plot graph showing positive/negative impact vectors. Includes pressable utility buttons at the base: a pressable [EXPORT DATASHEET] container button and a pressable [FILTER MODEL FEATURES] container button.

#### PAGE 6: TARGETED EMERGENCY ALERT SIMULATION STUDIO (INTERFACE 5)
- Parameter Form Card: Contains a pressable dropdown button labeled "[Select Targeted Threat Zone/Ward ▾]", a horizontal range slider bar with a draggable node handle for setting AQI limits, and individual clickable switch toggles: [Email Relay Switch Box], [System Push Notification Toggle], and [External Webhook API Relay Toggle].
- Active Incident Table: Clean data table listing system violations. Every row entry includes metadata fields and a dedicated, high-contrast, crimson-filled pressable component action button explicitly labeled "[DISPATCH CITIZEN ALERT BROADCAST]".

#### PAGE 7: SENSOR HEALTH & EDGE NODE ORCHESTRATION GRID (INTERFACE 6 - HACKATHON EXCLUSIVE)
- Hardware Command Center: Top row features 3 pressable status tile components: [Active Web-Nodes (42)], [Degraded Field Stations (3)], and [Offline Geo-Sensors (1)].
- Node Catalog Grid: Cards for each edge hardware sensor. Every entry includes a battery indicator icon, ward tag, and a padded rectangular utility button component explicitly labeled "[Ping Edge Node Diagnostic]".

#### PAGE 8: XAI MODEL BENCHMARKING & HYPERPARAMETER STUDIO (INTERFACE 7 - HACKATHON EXCLUSIVE)
- ML Evaluation Studio: Left side features comparison metric cards with an interactive toggle selector containing two large, pressable option buttons: "[Activate XGBoost Spatial Regressor]" and "[Activate LSTM Recurrent Temporal Network]".
- Hyperparameter Tuning Panel: Features interactive modifier fields, including numerical value adjuster boxes with pressable [+] and [-] increment triggers, and a primary accent-filled, shadow-cast CTA button component explicitly labeled "[RUN LIVE BACKEND RE-TRAINING PIPELINE]".