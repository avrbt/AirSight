# AirSight AI — UI/UX Design Specification

> **Document Status:** Approved v1.0  
> **Prepared By:** Senior UI/UX Design Team (Figma/Google)  
> **Last Updated:** July 15, 2026  
> **Hackathon:** ET AI Hackathon 2026  
> **Classification:** Specification — Final

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Dashboard Layout](#4-dashboard-layout)
5. [Navigation Structure](#5-navigation-structure)
6. [Screen Specifications](#6-screen-specifications)
7. [Component Library](#7-component-library)
8. [Card Specifications](#8-card-specifications)
9. [Chart Specifications](#9-chart-specifications)
10. [Interactive Map Specification](#10-interactive-map-specification)
11. [Page Specifications](#11-page-specifications)
12. [Responsive Design](#12-responsive-design)
13. [Empty States](#13-empty-states)
14. [Loading States](#14-loading-states)
15. [Error States](#15-error-states)
16. [Figma Wireframe Descriptions](#16-figma-wireframe-descriptions)

---

## 1. Design Philosophy

### 1.1 Core Tenets

AirSight AI’s UI/UX is built to deliver clarity in high-pressure situations. The platform is designed for **Government Officials**, **Pollution Control Board Officers**, and **Smart City Administrators** who make high-impact municipal decisions. 

- **Data Density over Minimalism:** Unlike consumer applications, municipal administrators require dense, high-information dashboards. Every pixel must prioritize context, metrics, and spatial dimensions, following paradigms set by Palantir Foundry and Datadog.
- **Explainability First:** AI-generated recommendations are accompanied by explainability widgets (SHAP plots), verifying model transparency before policies are triggered.
- **Redundant Coding for Safety:** Important statuses are never represented by color alone; they always combine color, icons, clear textual statuses, and numeric metrics to support color-blind users and low-light environments.

---

## 2. Color Palette

Optimized for dark-mode GIS interfaces to maximize contrast, minimize eye strain, and keep map overlays distinct.

### 2.1 Core System Colors

| Token | Hex Code | Usage |
|---|---|---|
| `--color-canvas-bg` | `#0B0F19` | Deepest map canvas backdrop |
| `--color-canvas-surface` | `#121824` | Main page dashboard background |
| `--color-canvas-card` | `#1A2333` | Panel and card container color |
| `--color-canvas-elevated` | `#232F45` | Dropdowns, dialogs, hover elements |
| `--color-border-subtle` | `#2E3D56` | Card and section dividers |
| `--color-brand-primary` | `#0070F3` | Interactive states, primary buttons, primary indicators |
| `--color-brand-glow` | `rgba(0,112,243,0.15)` | Selection focus shadow |

### 2.2 AQI Severity Spectrum (CPCB Standard)

| AQI Range | Category | Color Hex | Surface Tint (10% Opacity) |
|---|---|---|---|
| **0 – 50** | Good | `#00D97E` | `rgba(0, 217, 126, 0.1)` |
| **51 – 100** | Satisfactory | `#B8E045` | `rgba(184, 224, 69, 0.1)` |
| **101 – 200** | Moderate | `#FFB020` | `rgba(255, 176, 32, 0.1)` |
| **201 – 300** | Poor | `#FF6B35` | `rgba(255, 107, 53, 0.1)` |
| **301 – 400** | Very Poor | `#E63946` | `rgba(230, 57, 70, 0.1)` |
| **401 – 500**| Severe | `#9B1FCA` | `rgba(155, 31, 202, 0.1)` |

---

## 3. Typography

- **Primary Font Family:** `Inter` (Variable Weight 300–800) – For general UI text, headers, and navigation.
- **Monospace Font Family:** `JetBrains Mono` – For AQI scores, time-series coordinates, and data table numerical metrics.

### 3.1 Type Scale Hierarchy

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--t-display` | `32px` | 800 | `38px` | Critical high-level AQI callouts |
| `--t-h1` | `24px` | 700 | `32px` | Main page title headers |
| `--t-h2` | `20px` | 600 | `28px` | Card section titles |
| `--t-body` | `14px` | 400 | `20px` | General text copy |
| `--t-caption` | `12px` | 400 | `16px` | Timestamps, metadata, micro-labels |

---

## 4. Dashboard Layout

The UI uses a structured, flexible layout grid optimized for standard desktop screens (`1440px` and larger).

```
+-------------------------------------------------------------------------------+
| LOGO  | Top Bar: Search, Alerts, Help, Profile                                |
+-------+-----------------------------------------------------------------------+
|  S  |                                                                 | C   |
|  I  |                                                                 | O   |
|  D  |  Main Working Workspace (Viewport)                              | N   |
|  E  |  - Flex grids                                                   | T   |
|  B  |  - GIS Maps                                                     | E   |
|  A  |  - Visual analytics                                             | X   |
|  R  |                                                                 | T   |
+-----+-----------------------------------------------------------------+-----+
| Status Bar: Ingestion status, active APIs, DB connection health               |
+-------------------------------------------------------------------------------+
```

- **Sidebar Width:** `64px` (collapsed), `240px` (expanded).
- **Context Panel Width:** `380px` (collapsible right drawer for granular ward metrics).
- **Grid System:** 12-column layout with `24px` gutters.

---

## 5. Navigation Structure

```
Overview (/dashboard)
 ├── GIS Map Engine (/map)
 ├── Source Attribution (/attribution)
 ├── 72-Hour Forecast (/forecast)
 ├── AI Policy Recommendations (/recommendations)
 ├── Active Alerts & GRAP (/alerts)
 ├── Historical Analytics (/analytics)
 └── System Settings (/settings)
```

---

## 6. Screen Specifications

### 6.1 Main Dashboard (Overview)
- **Top Metric Cards:** 4-column layout displaying *City Avg AQI*, *Worst Performing Ward*, *Vulnerable Population Exposure*, and *Active Alerts*.
- **Mid Section:** Splits into a 70% width interactive mini GIS choropleth map, and a 30% width real-time alert feed displaying priority trigger lists.
- **Lower Section:** A tabular ward summary sorting wards by risk index, average AQI, and historical trend lines.

---

## 7. Component Library

### 7.1 Buttons
- **Primary:** Full fill `#0070F3` with rounded borders (`8px`). Fades slightly on click/hover.
- **Secondary:** Transparent fill, `1px` border using `--color-border-subtle`, white text label.
- **Action/Ghost:** Borderless, primary color text.

### 7.2 Badges
- **AQI Badges:** Uses CPCB scale colors at 10% fill opacity, paired with matching solid borders and text colors.
- **GRAP Level Badges:** Outlines containing Roman numerals (e.g. `Stage III` in bright red).

---

## 8. Card Specifications

Cards are the primary container elements of the dashboard.
- **Visuals:** Background uses `#1A2333` with rounded borders (`8px`) and a thin shadow (`0 4px 12px rgba(0,0,0,0.15)`).
- **Header:** Contains a small text header (`--t-caption`), followed by a bold section title.
- **Metric display:** Displays high-priority metrics in monospace with a trend arrow next to it.

---

## 9. Chart Specifications

### 9.1 72-Hour Forecast Area Chart
- **Line:** Smooth spline line representing the median prediction (P50).
- **Uncertainty Band:** A shaded area fill representing P10 to P90 probability bands, colored in soft orange with 15% opacity.
- **Threshold Lines:** Horizontal dashed lines representing CPCB health thresholds (e.g., `200` for Poor, `300` for Very Poor).

### 9.2 Source Attribution Donut Chart
- **Slices:** Colored by source category (Vehicular: `#3B9EFF`, Industrial: `#FF6B35`, Construction: `#FFB020`, Biomass: `#E63946`, Dust: `#A8B8D0`).
- **Inner Label:** Dominant source and its exact percentage.

---

## 10. Interactive Map Specification

- **Base Layer:** Dark-style vector map tiles showing city boundary shapes.
- **Heatmap Layer:** Multi-color semi-transparent polygon fills (50% opacity) matching the local ward AQI values.
- **Station Nodes:** Intersecting station circles colored by active sensor values with glowing outlines.
- **Wind Vectors:** Subtle vector arrows showing current wind direction overlays (essential for pollution path attribution).

---

## 11. Page Specifications

### 11.1 Source Attribution Page
Displays source attribution graphs alongside SHAP explainability variables.
- **SHAP Force Plot:** Displays positive variables pushing predicted values higher in red, and negative variables in blue.
- **Satellite Evidence Overlay:** Multi-spectral view overlay displaying nitrogen dioxide ($NO_2$) plume concentrations from Copernicus Sentinel-5P.

### 11.2 AQI Forecast Page
Contains the 72-hour forecast chart, coupled with a time slider matching map choropleth frames.

### 11.3 AI Recommendation Page
Generates structured action steps using LLM templates. Includes calculated impact estimates for each recommended step.

### 11.4 Alerts Page
Lists triggered alerts and active GRAP stages. Shows contact notifications dispatched to ward leaders.

### 11.5 Analytics Page
Provides comparative graphs, historical trends, and raw CSV/PDF report download endpoints.

---

## 12. Responsive Design

While designed primarily for desktop dashboards, layouts collapse into a single-column layout on viewport widths below `1024px`. Side menus convert to collapsible drawer states, and tables scroll horizontally where necessary.

---

## 13. Empty States

Empty modules display a subtle line-art icon (e.g., a diagonal line through a document file) accompanied by descriptive microcopy, such as *"Select a ward from the GIS map to view localized attribution metrics"*.

---

## 14. Loading States

Modules in a loading state display animated skeleton loader blocks with a gradient sweep animation. Map panels show a spinner inside a centered container.

---

## 15. Error States

If an API call fails, the affected card or component displays a warning icon along with a retry action, such as *"Unable to fetch 72-hour forecast. [Retry]"*.

---

## 16. Figma Wireframe Descriptions

```
Screen: Overview Dashboard
 ├── Frame: Desktop (1440x900)
 ├── Auto Layout: Horizontal (Sidebar + Main Canvas)
 └── Grid: 12-Column, 24px Gutter
      ├── Col 1-3:  Avg AQI Card (Glow outline matching current category)
      ├── Col 4-6:  Worst Ward Card (Crimson border alert)
      ├── Col 7-9:  Exposure Card (Yellow warning border)
      └── Col 10-12: Alert Count Card (Red dot status badge)
```

- **Figma Design Elements:** Build responsive elements with Auto Layout using variables to handle margins and paddings. Use primary components for button systems, map markers, and status indicators.

---

*© 2026 AirSight AI. Internal UX Design Document.*  
*Prepared for ET AI Hackathon 2026.*
