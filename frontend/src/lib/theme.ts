/**
 * AirSight AI — Theme Utilities
 * ─────────────────────────────────────────────────────────────
 * Runtime helpers for AQI-based styling, theme management,
 * and dynamic design system access.
 */

import { aqi } from "./design-tokens";

/* ═══════════════════════════════════════════════════════════
 * AQI HELPERS
 * Map numeric AQI values → severity level → colors & labels
 * ═══════════════════════════════════════════════════════════ */

export type AqiLevel = "good" | "satisfactory" | "moderate" | "poor" | "verypoor" | "severe";

/**
 * Map a numeric AQI value to its CPCB severity level.
 */
export function getAqiLevel(value: number): AqiLevel {
  if (value <= 50) return "good";
  if (value <= 100) return "satisfactory";
  if (value <= 200) return "moderate";
  if (value <= 300) return "poor";
  if (value <= 400) return "verypoor";
  return "severe";
}

/**
 * Get the full AQI metadata for a numeric value.
 */
export function getAqiMeta(value: number) {
  const level = getAqiLevel(value);
  return { level, ...aqi[level] };
}

/**
 * Get the hex color for an AQI value.
 */
export function getAqiColor(value: number): string {
  return aqi[getAqiLevel(value)].color;
}

/**
 * Get the muted (10% opacity) background for an AQI value.
 */
export function getAqiMutedColor(value: number): string {
  return aqi[getAqiLevel(value)].muted;
}

/**
 * Get Tailwind CSS class names for AQI badge styling.
 */
export function getAqiBadgeClass(value: number): string {
  const level = getAqiLevel(value);
  return `badge-aqi-${level}`;
}

/**
 * AQI level → Tailwind text color class mapping
 */
export const aqiTextColorClass: Record<AqiLevel, string> = {
  good:         "text-aqi-good",
  satisfactory: "text-aqi-satisfactory",
  moderate:     "text-aqi-moderate",
  poor:         "text-aqi-poor",
  verypoor:     "text-aqi-verypoor",
  severe:       "text-aqi-severe",
};

/**
 * AQI level → Tailwind background color class mapping
 */
export const aqiBgColorClass: Record<AqiLevel, string> = {
  good:         "bg-aqi-good",
  satisfactory: "bg-aqi-satisfactory",
  moderate:     "bg-aqi-moderate",
  poor:         "bg-aqi-poor",
  verypoor:     "bg-aqi-verypoor",
  severe:       "bg-aqi-severe",
};

/**
 * AQI level → glow shadow class mapping
 */
export const aqiGlowClass: Record<AqiLevel, string> = {
  good:         "shadow-glow-good",
  satisfactory: "shadow-glow-good",
  moderate:     "shadow-glow-moderate",
  poor:         "shadow-glow-poor",
  verypoor:     "shadow-glow-verypoor",
  severe:       "shadow-glow-severe",
};


/* ═══════════════════════════════════════════════════════════
 * TREND HELPERS
 * ═══════════════════════════════════════════════════════════ */

export type TrendDirection = "up" | "down" | "neutral";

/**
 * Determine trend direction from a delta percentage.
 * Threshold avoids micro-fluctuations showing as trends.
 */
export function getTrendDirection(delta: number, threshold = 0.5): TrendDirection {
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "neutral";
}

/**
 * Format a trend delta as a display string (e.g., "+12.3%", "−5.1%")
 */
export function formatTrendDelta(delta: number): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${Math.abs(delta).toFixed(1)}%`;
}

/**
 * Trend direction → Tailwind text color
 * For AQI: "up" is BAD (more pollution), "down" is GOOD
 */
export function getTrendColorClass(direction: TrendDirection, invertedDomain = true): string {
  if (direction === "neutral") return "text-text-secondary";
  if (invertedDomain) {
    // AQI domain: higher = worse
    return direction === "up" ? "text-signal-danger" : "text-signal-success";
  }
  // Normal domain: higher = better
  return direction === "up" ? "text-signal-success" : "text-signal-danger";
}


/* ═══════════════════════════════════════════════════════════
 * THEME MANAGEMENT
 * ═══════════════════════════════════════════════════════════ */

export type Theme = "light" | "dark" | "system";

/**
 * Get the current effective theme.
 */
export function getEffectiveTheme(): "light" | "dark" {
  if (document.documentElement.classList.contains("dark")) return "dark";
  return "light";
}

/**
 * Apply a theme to the document.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }

  localStorage.setItem("airsight-theme", theme);
}

/**
 * Get the stored theme preference.
 */
export function getStoredTheme(): Theme {
  return (localStorage.getItem("airsight-theme") as Theme) ?? "dark";
}

/**
 * Initialize theme on app startup.
 */
export function initTheme(): void {
  applyTheme(getStoredTheme());

  // Listen for system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredTheme() === "system") {
      applyTheme("system");
    }
  });
}


/* ═══════════════════════════════════════════════════════════
 * NUMBER FORMATTING
 * ═══════════════════════════════════════════════════════════ */

/**
 * Format large numbers with K/M/B suffixes for dashboard display.
 */
export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000)     return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000)         return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

/**
 * Format a number as an AQI display string (integer, no decimals).
 */
export function formatAqi(value: number): string {
  return Math.round(value).toString();
}
