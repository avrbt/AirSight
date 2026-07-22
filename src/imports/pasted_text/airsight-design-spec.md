Act as a world-class UI/UX engineer specializing in high-fidelity, production-ready design systems. Generate a comprehensive, multi-page layout for "AirSight"—a high-end AI-powered Air Quality Index tracking, forecasting, and pollutant source attribution platform built for a national hackathon. 

The design must look incredibly strong, robust, and highly technical. It must consist of 6 distinct feature interfaces, an advanced landing/auth flow, and explicit structural constraints to prevent text overlap.

---

### GLOBAL INTERACTION & DESIGN CONSTRAINTS (CRITICAL)
1. ALL BUTTONS MUST BE PRESSABLE: Every single CTA, icon button, tab toggle, dropdown arrow, and form submission element must be fully rendered with clear interactive boundaries (appropriate padding, rounded corners, drop shadows, and defined hover/pressed state visual indicators). No flat text acting as a button.
2. ZERO TEXT OVERLAP: Ensure strict bounding boxes, vertical auto-layout stacks, and explicit line-heights. No two text elements or headers should collide, overlap, or clip vertically or horizontally. Ensure ample whitespace between components.
3. TYPOGRAPHY & VISUALS: Use a dark, premium, futuristic technical theme. Primary background: Deep Navy/Slate Charcoal (#0B0F19). Accent colors must dynamically mirror global AQI hazard tiers: Good (#10B981), Moderate (#F59E0B), Unhealthy (#EF4444), and Hazardous (#7C3AED).

---

### PAGE 1: AUTHENTICATION FLOW (SIGN-UP & LOGIN GATE)
- Design a split-screen onboarding layout. Left side features a high-fidelity visual graph map of air telemetry. Right side features the functional dynamic auth card.
- View A (Register/Sign-Up): Contains clear interactive input fields for "Full Name", "Username", and "Password", followed by a pressable accent-colored "Create Account" button. At the bottom, a pressable link: "Already have an account? Log In".
- View B (Login): Contains matching input fields for "Username" and "Password", an active "Remember Me" checkbox component, a pressable "Sign In" CTA button, and a "Forgot Password?" utility trigger.

---

### PAGE 2: CORE MONITORING DASHBOARD (INTERFACE 1)
- Layout: Persistent left-hand global navigation sidebar with pressable route icons. Top header showing logged-in user profile, notifications badge (pressable), and location toggle dropdown.
- Hero Component: A large, central circular radial AQI gauge widget displaying live telemetry with an integrated color-coded health warning banner.
- Grid Sub-Widgets:
  * A 4x4 interactive grid breaking down individual critical pollutants (PM2.5, PM10, NO2, SO2), each with an independent pressable "View Breakdown" icon.
  * A real-time scrolling system health log panel.

---

### PAGE 3: INTERACTIVE GIS SPATIAL MAP (INTERFACE 2)
- Layout: A full-bleed detailed canvas representing a GIS topographic map engine layered with urban ward boundaries.
- Floating Controller Elements (All Pressable):
  * Top-Right: Layer control panel widget featuring active checkboxes to toggle between "Heatmap View", "Station Nodes", and "Ward Boundary Overlay".
  * Bottom Timeline Controller: A wide horizontal scrubber playback bar with pressable "Play/Pause", "Rewind", and "Fast Forward" controls to view historical and future simulated pollution drift over time.

---

### PAGE 4: DEEP TIME-SERIES FORECASTING (INTERFACE 3)
- Layout: Analytical environment focusing on predictive models.
- Core Chart Card: A massive, dual-axis interactive line plot plotting a timeline. Historical values show as a solid colored line shifting seamlessly into future AI-predicted timelines represented as a distinct dotted gradient curve.
- Toolbar (All Pressable): 
  * Granularity toggle pills: "24 Hours", "3 Days", "7 Days", "30 Days".
  * Model selector dropdown button: Toggle between "XGBoost Spatial Model" and "LSTM Temporal Model".

---

### PAGE 5: AI POLLUTANT ATTRIBUTION & XAI LAB (INTERFACE 4)
- Layout: Two-column split interface focused on Machine Learning transparency and explainability.
- Left Column: A premium donut chart component illustrating percentage-based sector distributions (Traffic Emissions, Industrial Outputs, Agricultural Biomass Burning, Urban Dust).
- Right Column: A comprehensive SHAP (Explainable AI) Force Plot graph displaying exactly how local features push the predictive model toward high or low hazard calculations. Features pressable "Export Data" and "Filter Features" utility buttons.

---

### PAGE 6: CRISIS ALERT MANAGEMENT & SIMULATION (INTERFACE 5)
- Layout: Dual control dashboards for user-configured triggers and live system warnings.
- Left Card (Alert Builder Form): Features a series of styled dropdowns for choosing a specific municipal ward, a smooth interactive range slider for setting an AQI threshold, and distinct pressable checkbox toggles for delivery channels (Email, In-App Notification, Webhook).
- Right Card (Active Alert Logs): A clean table listing recent threshold violations. Each row contains an explicit, pressable crimson button labeled "Dispatch Response/Broadcast".