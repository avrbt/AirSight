/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      /* ──────────────────────────────────────────────
       * COLOR SYSTEM
       * Combines shadcn/ui CSS-variable tokens with
       * AirSight domain-specific palette.
       * ──────────────────────────────────────────── */
      colors: {
        // --- shadcn/ui semantic tokens (CSS-var driven) ---
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:             "hsl(var(--sidebar-background))",
          foreground:          "hsl(var(--sidebar-foreground))",
          primary:             "hsl(var(--sidebar-primary))",
          "primary-foreground":"hsl(var(--sidebar-primary-foreground))",
          accent:              "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border:              "hsl(var(--sidebar-border))",
          ring:                "hsl(var(--sidebar-ring))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        // --- AirSight canvas layers (deep→surface→card→elevated) ---
        canvas: {
          DEFAULT:  "hsl(var(--canvas))",
          deep:     "hsl(var(--canvas-deep))",
          surface:  "hsl(var(--canvas-surface))",
          card:     "hsl(var(--canvas-card))",
          elevated: "hsl(var(--canvas-elevated))",
        },

        // --- Intelligence brand color ---
        brand: {
          DEFAULT:  "hsl(var(--brand))",
          hover:    "hsl(var(--brand-hover))",
          muted:    "hsl(var(--brand-muted))",
          glow:     "var(--brand-glow)",
        },

        // --- AQI severity spectrum (CPCB India standard) ---
        aqi: {
          good:          "hsl(var(--aqi-good))",
          "good-muted":  "var(--aqi-good-muted)",
          satisfactory:          "hsl(var(--aqi-satisfactory))",
          "satisfactory-muted":  "var(--aqi-satisfactory-muted)",
          moderate:          "hsl(var(--aqi-moderate))",
          "moderate-muted":  "var(--aqi-moderate-muted)",
          poor:          "hsl(var(--aqi-poor))",
          "poor-muted":  "var(--aqi-poor-muted)",
          verypoor:          "hsl(var(--aqi-verypoor))",
          "verypoor-muted":  "var(--aqi-verypoor-muted)",
          severe:          "hsl(var(--aqi-severe))",
          "severe-muted":  "var(--aqi-severe-muted)",
        },

        // --- Source attribution chart colors ---
        source: {
          vehicular:    "hsl(var(--source-vehicular))",
          industrial:   "hsl(var(--source-industrial))",
          construction: "hsl(var(--source-construction))",
          biomass:      "hsl(var(--source-biomass))",
          dust:         "hsl(var(--source-dust))",
        },

        // --- Signal / status colors ---
        signal: {
          success:  "hsl(var(--signal-success))",
          warning:  "hsl(var(--signal-warning))",
          danger:   "hsl(var(--signal-danger))",
          info:     "hsl(var(--signal-info))",
        },

        // --- Neutral text hierarchy ---
        "text-primary":   "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary":  "hsl(var(--text-tertiary))",
        "text-disabled":  "hsl(var(--text-disabled))",
      },

      /* ──────────────────────────────────────────────
       * BORDER RADIUS
       * ──────────────────────────────────────────── */
      borderRadius: {
        "2xl": "calc(var(--radius) + 4px)",
        xl:    "calc(var(--radius) + 2px)",
        lg:    "var(--radius)",
        md:    "calc(var(--radius) - 2px)",
        sm:    "calc(var(--radius) - 4px)",
      },

      /* ──────────────────────────────────────────────
       * TYPOGRAPHY
       * Inter (300-800) for UI, JetBrains Mono for data
       * ──────────────────────────────────────────── */
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Design spec type scale
        "display":  ["2rem",    { lineHeight: "2.375rem", fontWeight: "800", letterSpacing: "-0.025em" }],
        "h1":       ["1.5rem",  { lineHeight: "2rem",     fontWeight: "700", letterSpacing: "-0.02em" }],
        "h2":       ["1.25rem", { lineHeight: "1.75rem",  fontWeight: "600", letterSpacing: "-0.015em" }],
        "h3":       ["1rem",    { lineHeight: "1.5rem",   fontWeight: "600", letterSpacing: "-0.01em" }],
        "body":     ["0.875rem",{ lineHeight: "1.25rem",  fontWeight: "400" }],
        "body-sm":  ["0.8125rem",{ lineHeight: "1.125rem", fontWeight: "400" }],
        "caption":  ["0.75rem", { lineHeight: "1rem",     fontWeight: "400" }],
        "overline": ["0.6875rem",{ lineHeight: "0.875rem", fontWeight: "600", letterSpacing: "0.08em" }],
        // Monospace data variants
        "data-xl":  ["1.75rem", { lineHeight: "2rem",     fontWeight: "700", letterSpacing: "-0.02em" }],
        "data-lg":  ["1.25rem", { lineHeight: "1.5rem",   fontWeight: "600" }],
        "data-md":  ["1rem",    { lineHeight: "1.25rem",  fontWeight: "500" }],
        "data-sm":  ["0.75rem", { lineHeight: "1rem",     fontWeight: "500" }],
      },

      /* ──────────────────────────────────────────────
       * SPACING
       * Extended scale for dashboard layouts
       * ──────────────────────────────────────────── */
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "17":  "4.25rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "34":  "8.5rem",
        "sidebar-collapsed": "4rem",    // 64px
        "sidebar-expanded":  "15rem",   // 240px
        "context-panel":     "23.75rem",// 380px
        "topbar":            "3.5rem",  // 56px
        "statusbar":         "2rem",    // 32px
      },

      /* ──────────────────────────────────────────────
       * BOX SHADOWS
       * Multi-layer shadow system for depth hierarchy
       * ──────────────────────────────────────────── */
      boxShadow: {
        // Elevation hierarchy
        "elevation-1":  "0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.15)",
        "elevation-2":  "0 2px 4px 0 rgba(0, 0, 0, 0.3), 0 4px 12px 0 rgba(0, 0, 0, 0.15)",
        "elevation-3":  "0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 8px 24px 0 rgba(0, 0, 0, 0.2)",
        "elevation-4":  "0 8px 16px 0 rgba(0, 0, 0, 0.35), 0 16px 48px 0 rgba(0, 0, 0, 0.25)",
        // Card shadows (per UI_UX.md spec: 0 4px 12px rgba(0,0,0,0.15))
        "card":         "0 4px 12px rgba(0, 0, 0, 0.15)",
        "card-hover":   "0 8px 24px rgba(0, 0, 0, 0.25)",
        // Brand glow effects
        "glow-brand":   "0 0 20px rgba(0, 112, 243, 0.15), 0 0 40px rgba(0, 112, 243, 0.08)",
        "glow-brand-lg":"0 0 30px rgba(0, 112, 243, 0.25), 0 0 60px rgba(0, 112, 243, 0.12)",
        // AQI severity glows
        "glow-good":      "0 0 16px rgba(0, 217, 126, 0.2)",
        "glow-moderate":  "0 0 16px rgba(255, 176, 32, 0.2)",
        "glow-poor":      "0 0 16px rgba(255, 107, 53, 0.25)",
        "glow-verypoor":  "0 0 16px rgba(230, 57, 70, 0.25)",
        "glow-severe":    "0 0 16px rgba(155, 31, 202, 0.25)",
        // Inner shadows for inset elements
        "inner-subtle":   "inset 0 1px 2px rgba(0, 0, 0, 0.2)",
        "inner-deep":     "inset 0 2px 6px rgba(0, 0, 0, 0.3)",
      },

      /* ──────────────────────────────────────────────
       * WIDTH / HEIGHT / SIZING
       * Common dashboard widths
       * ──────────────────────────────────────────── */
      width: {
        "sidebar-collapsed": "4rem",
        "sidebar-expanded":  "15rem",
        "context-panel":     "23.75rem",
      },
      maxWidth: {
        "dashboard": "1440px",
        "content":   "1200px",
      },
      minHeight: {
        "card": "8rem",
        "chart": "16rem",
      },

      /* ──────────────────────────────────────────────
       * Z-INDEX
       * Layering hierarchy
       * ──────────────────────────────────────────── */
      zIndex: {
        "base":       "0",
        "content":    "10",
        "sidebar":    "30",
        "topbar":     "40",
        "dropdown":   "50",
        "overlay":    "60",
        "modal":      "70",
        "popover":    "80",
        "toast":      "90",
        "tooltip":    "100",
      },

      /* ──────────────────────────────────────────────
       * TRANSITIONS / ANIMATIONS
       * ──────────────────────────────────────────── */
      transitionDuration: {
        "DEFAULT": "200ms",
        "fast":    "100ms",
        "normal":  "200ms",
        "slow":    "300ms",
        "slower":  "500ms",
      },
      transitionTimingFunction: {
        "bounce":  "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth":  "cubic-bezier(0.4, 0, 0.2, 1)",
        "sharp":   "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to:   { opacity: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(0)" },
        },
        "slide-in-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
          from: { transform: "translateY(-8px)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to:   { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 112, 243, 0.2)" },
          "50%":      { boxShadow: "0 0 20px rgba(0, 112, 243, 0.4)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.6", transform: "scale(0.8)" },
        },
        "skeleton-sweep": {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down":   "accordion-down 0.2s ease-out",
        "accordion-up":     "accordion-up 0.2s ease-out",
        "fade-in":          "fade-in 0.2s ease-out",
        "fade-out":         "fade-out 0.15s ease-in",
        "slide-in-right":   "slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out-right":  "slide-out-right 0.25s cubic-bezier(0.4, 0, 0.6, 1)",
        "slide-in-left":    "slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-up":      "slide-in-up 0.25s ease-out",
        "slide-in-down":    "slide-in-down 0.25s ease-out",
        "scale-in":         "scale-in 0.2s ease-out",
        "pulse-glow":       "pulse-glow 2s ease-in-out infinite",
        "pulse-dot":        "pulse-dot 1.5s ease-in-out infinite",
        "skeleton":         "skeleton-sweep 1.8s ease-in-out infinite",
        "spin-slow":        "spin-slow 3s linear infinite",
      },

      /* ──────────────────────────────────────────────
       * GRID / LAYOUT
       * 12-column dashboard grid (24px gutter per spec)
       * ──────────────────────────────────────────── */
      gridTemplateColumns: {
        "dashboard":    "repeat(12, minmax(0, 1fr))",
        "metrics-4":    "repeat(4, minmax(0, 1fr))",
        "metrics-3":    "repeat(3, minmax(0, 1fr))",
        "overview":     "7fr 3fr",
        "detail":       "1fr 380px",
      },
      gap: {
        "gutter":  "1.5rem",  // 24px per spec
      },

      /* ──────────────────────────────────────────────
       * BACKDROP BLUR
       * For glassmorphism overlays
       * ──────────────────────────────────────────── */
      backdropBlur: {
        xs:  "2px",
        "2xl": "40px",
      },

      /* ──────────────────────────────────────────────
       * OPACITY
       * Semantic opacity values
       * ──────────────────────────────────────────── */
      opacity: {
        "2":  "0.02",
        "3":  "0.03",
        "8":  "0.08",
        "12": "0.12",
        "15": "0.15",
        "85": "0.85",
        "92": "0.92",
        "97": "0.97",
      },
    },

    /* ──────────────────────────────────────────────
     * BREAKPOINTS
     * Dashboard-optimized screen sizes
     * ──────────────────────────────────────────── */
    screens: {
      "sm":   "640px",
      "md":   "768px",
      "lg":   "1024px",
      "xl":   "1280px",
      "2xl":  "1440px",
      "3xl":  "1920px",
    },
  },
  plugins: [require("tailwindcss-animate")],
}
