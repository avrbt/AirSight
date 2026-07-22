/**
 * AirSight AI — Design Tokens
 * ─────────────────────────────────────────────────────────────
 * Canonical source of truth for all design system values.
 * Used by components that need runtime access to design values
 * (charts, maps, dynamic styles). CSS variables remain the
 * primary application mechanism via Tailwind classes.
 */

/* ═══════════════════════════════════════════════════════════
 * COLOR PALETTE
 * ═══════════════════════════════════════════════════════════ */

/**
 * Canvas / Surface layers — 4-tier depth hierarchy
 * deep → surface → card → elevated
 */
export const canvas = {
  deep:     "#0B0F19",
  surface:  "#121824",
  card:     "#1A2333",
  elevated: "#232F45",
} as const;

/** Brand accent */
export const brand = {
  primary:  "#0070F3",
  hover:    "#1A8CFF",
  muted:    "#0070F3",
  glow:     "rgba(0, 112, 243, 0.15)",
  glowStrong: "rgba(0, 112, 243, 0.30)",
} as const;

/** Border colors */
export const borders = {
  default:  "#2A3850",
  subtle:   "#2E3D56",
  strong:   "#3D5070",
  brand:    "rgba(0, 112, 243, 0.4)",
} as const;

/** Text hierarchy */
export const text = {
  primary:    "#E8EDF5",
  secondary:  "#A8B8D0",
  tertiary:   "#6B7A90",
  disabled:   "#4A5568",
  inverse:    "#0B0F19",
} as const;

/**
 * AQI Severity Spectrum — CPCB India Standard
 * Each level has: solid color, surface tint (10% opacity), text-safe variant
 */
export const aqi = {
  good:         { color: "#00D97E", muted: "rgba(0, 217, 126, 0.10)",   label: "Good",         range: "0–50" },
  satisfactory: { color: "#B8E045", muted: "rgba(184, 224, 69, 0.10)",  label: "Satisfactory", range: "51–100" },
  moderate:     { color: "#FFB020", muted: "rgba(255, 176, 32, 0.10)",  label: "Moderate",     range: "101–200" },
  poor:         { color: "#FF6B35", muted: "rgba(255, 107, 53, 0.10)",  label: "Poor",         range: "201–300" },
  verypoor:     { color: "#E63946", muted: "rgba(230, 57, 70, 0.10)",   label: "Very Poor",    range: "301–400" },
  severe:       { color: "#9B1FCA", muted: "rgba(155, 31, 202, 0.10)",  label: "Severe",       range: "401–500" },
} as const;

/** Source Attribution chart colors */
export const sourceColors = {
  vehicular:    "#3B9EFF",
  industrial:   "#FF6B35",
  construction: "#FFB020",
  biomass:      "#E63946",
  dust:         "#A8B8D0",
} as const;

/** Signal / status colors */
export const signal = {
  success:  "#00D97E",
  warning:  "#FFB020",
  danger:   "#E63946",
  info:     "#0070F3",
} as const;

/** Chart palette — 5 colors for general charts */
export const chartPalette = [
  "#3B9EFF",   // Blue
  "#00D97E",   // Green
  "#FFB020",   // Amber
  "#A855F7",   // Purple
  "#EC4899",   // Pink
] as const;

/** Extended chart palette — 10 colors for complex visualizations */
export const chartPaletteExtended = [
  "#3B9EFF",
  "#00D97E",
  "#FFB020",
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#E63946",
  "#6366F1",
] as const;


/* ═══════════════════════════════════════════════════════════
 * TYPOGRAPHY
 * ═══════════════════════════════════════════════════════════ */

export const typography = {
  fontFamily: {
    sans:    "'Inter', system-ui, -apple-system, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', monospace",
    display: "'Inter', system-ui, sans-serif",
  },

  /** Type scale matching UI_UX.md spec */
  scale: {
    display:  { size: "2rem",       lineHeight: "2.375rem", weight: 800, tracking: "-0.025em" },
    h1:       { size: "1.5rem",     lineHeight: "2rem",     weight: 700, tracking: "-0.02em" },
    h2:       { size: "1.25rem",    lineHeight: "1.75rem",  weight: 600, tracking: "-0.015em" },
    h3:       { size: "1rem",       lineHeight: "1.5rem",   weight: 600, tracking: "-0.01em" },
    body:     { size: "0.875rem",   lineHeight: "1.25rem",  weight: 400, tracking: "0" },
    bodySm:   { size: "0.8125rem",  lineHeight: "1.125rem", weight: 400, tracking: "0" },
    caption:  { size: "0.75rem",    lineHeight: "1rem",     weight: 400, tracking: "0" },
    overline: { size: "0.6875rem",  lineHeight: "0.875rem", weight: 600, tracking: "0.08em" },
  },

  /** Monospace data display variants */
  dataScale: {
    xl: { size: "1.75rem",  lineHeight: "2rem",    weight: 700 },
    lg: { size: "1.25rem",  lineHeight: "1.5rem",  weight: 600 },
    md: { size: "1rem",     lineHeight: "1.25rem", weight: 500 },
    sm: { size: "0.75rem",  lineHeight: "1rem",    weight: 500 },
  },
} as const;


/* ═══════════════════════════════════════════════════════════
 * SPACING
 * ═══════════════════════════════════════════════════════════ */

export const spacing = {
  /** Dashboard grid gutter */
  gutter: "1.5rem",   // 24px per spec
  /** Page content padding */
  pagePadding: "1.5rem",
  /** Sidebar dimensions */
  sidebarCollapsed: "4rem",    // 64px
  sidebarExpanded:  "15rem",   // 240px
  /** Context panel */
  contextPanel: "23.75rem",    // 380px
  /** Top bar height */
  topbar: "3.5rem",            // 56px
  /** Status bar height */
  statusbar: "2rem",           // 32px
  /** Card internal padding */
  cardPadding: "1rem",
  cardPaddingLg: "1.5rem",
} as const;


/* ═══════════════════════════════════════════════════════════
 * SHADOWS
 * ═══════════════════════════════════════════════════════════ */

export const shadows = {
  elevation: {
    1: "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.15)",
    2: "0 2px 4px 0 rgba(0, 0, 0, 0.3), 0 4px 12px 0 rgba(0, 0, 0, 0.15)",
    3: "0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 8px 24px 0 rgba(0, 0, 0, 0.2)",
    4: "0 8px 16px 0 rgba(0, 0, 0, 0.35), 0 16px 48px 0 rgba(0, 0, 0, 0.25)",
  },
  card:       "0 4px 12px rgba(0, 0, 0, 0.15)",
  cardHover:  "0 8px 24px rgba(0, 0, 0, 0.25)",
  glowBrand:  "0 0 20px rgba(0, 112, 243, 0.15), 0 0 40px rgba(0, 112, 243, 0.08)",
} as const;


/* ═══════════════════════════════════════════════════════════
 * BORDER RADIUS
 * ═══════════════════════════════════════════════════════════ */

export const radii = {
  none: "0px",
  sm:   "0.125rem",   // 2px
  md:   "0.375rem",   // 6px
  lg:   "0.5rem",     // 8px — primary card radius per spec
  xl:   "0.625rem",   // 10px
  "2xl":"0.75rem",    // 12px
  full: "9999px",
} as const;


/* ═══════════════════════════════════════════════════════════
 * Z-INDEX SCALE
 * ═══════════════════════════════════════════════════════════ */

export const zIndex = {
  base:     0,
  content:  10,
  sidebar:  30,
  topbar:   40,
  dropdown: 50,
  overlay:  60,
  modal:    70,
  popover:  80,
  toast:    90,
  tooltip:  100,
} as const;


/* ═══════════════════════════════════════════════════════════
 * TRANSITIONS
 * ═══════════════════════════════════════════════════════════ */

export const transitions = {
  duration: {
    fast:    "100ms",
    normal:  "200ms",
    slow:    "300ms",
    slower:  "500ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce:  "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    sharp:   "cubic-bezier(0.4, 0, 0.6, 1)",
  },
} as const;


/* ═══════════════════════════════════════════════════════════
 * BREAKPOINTS
 * ═══════════════════════════════════════════════════════════ */

export const breakpoints = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1440,
  "3xl": 1920,
} as const;


/* ═══════════════════════════════════════════════════════════
 * RECHARTS THEME
 * Pre-configured theme object for Recharts visualizations
 * ═══════════════════════════════════════════════════════════ */

export const rechartsTheme = {
  /** Common axis styling */
  axis: {
    stroke: text.tertiary,
    fontSize: 11,
    fontFamily: typography.fontFamily.sans,
    tickLine: false,
    axisLine: { stroke: borders.subtle, strokeWidth: 1 },
    tick: { fill: text.tertiary },
  },
  /** Grid lines */
  grid: {
    stroke: borders.subtle,
    strokeDasharray: "3 3",
    strokeOpacity: 0.5,
  },
  /** Tooltip */
  tooltip: {
    backgroundColor: canvas.elevated,
    borderColor: borders.subtle,
    borderRadius: 8,
    labelStyle: { color: text.primary, fontWeight: 600, fontSize: 12 },
    itemStyle: { color: text.secondary, fontSize: 12 },
  },
  /** Legend */
  legend: {
    iconSize: 8,
    wrapperStyle: { fontSize: 12, color: text.secondary },
  },
} as const;
