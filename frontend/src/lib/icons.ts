/**
 * AirSight AI — Icon System
 * ─────────────────────────────────────────────────────────────
 * Centralized icon registry using Lucide React.
 * Provides semantic icon mappings for the application domain.
 *
 * Usage:
 *   import { icons } from "@/lib/icons";
 *   <icons.nav.dashboard className="w-5 h-5" />
 *
 * All icons are tree-shakeable through Lucide's ESM exports.
 */

import {
  // Navigation
  LayoutDashboard,
  Map,
  PieChart,
  LineChart,
  BrainCircuit,
  Bell,
  BarChart3,
  Settings,
  ShieldAlert,

  // AQI / Environment
  Wind,
  Thermometer,
  Droplets,
  CloudRain,
  Sun,
  Gauge,
  Activity,
  Leaf,
  Factory,
  Car,
  Construction,
  Flame,

  // Status / Indicators
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronsUpDown,

  // Actions
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  ExternalLink,
  Copy,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  MoreVertical,
  Plus,
  X,
  Eye,
  EyeOff,
  Layers,
  SlidersHorizontal,
  Sliders,

  // Data / Analytics
  FileText,
  FileSpreadsheet,
  Table,
  Calendar,
  CalendarDays,
  MapPin,
  Crosshair,
  Target,
  Zap,

  // Communication
  BellRing,
  MessageSquare,
  Mail,
  Phone,
  Share2,

  // System / UI
  LogOut,
  User,
  Users,
  Building2,
  HelpCircle,
  Loader2,
  Wifi,
  WifiOff,
  Database,
  Server,
  Shield,
  Lock,

  type LucideIcon,
} from "lucide-react";


/* ═══════════════════════════════════════════════════════════
 * ICON REGISTRY — Semantic groupings
 * ═══════════════════════════════════════════════════════════ */

export const icons = {
  /** Navigation menu items */
  nav: {
    dashboard:      LayoutDashboard,
    map:            Map,
    attribution:    PieChart,
    forecast:       LineChart,
    recommendations:BrainCircuit,
    alerts:         Bell,
    analytics:      BarChart3,
    settings:       Settings,
  },

  /** Brand / identity */
  brand: {
    logo:           ShieldAlert,
    shield:         Shield,
  },

  /** Environment / AQI domain */
  environment: {
    wind:           Wind,
    temperature:    Thermometer,
    humidity:        Droplets,
    rain:           CloudRain,
    sun:            Sun,
    gauge:          Gauge,
    activity:       Activity,
    leaf:           Leaf,
  },

  /** Pollution source types */
  source: {
    vehicular:      Car,
    industrial:     Factory,
    construction:   Construction,
    biomass:        Flame,
    dust:           Wind,
  },

  /** Status / severity indicators */
  status: {
    success:        CheckCircle2,
    warning:        AlertTriangle,
    danger:         AlertCircle,
    info:           Info,
    error:          XCircle,
    clock:          Clock,
    live:           Activity,
  },

  /** Trend indicators */
  trend: {
    up:             TrendingUp,
    down:           TrendingDown,
    neutral:        Minus,
    arrowUp:        ArrowUp,
    arrowDown:      ArrowDown,
  },

  /** Action icons */
  action: {
    search:         Search,
    filter:         Filter,
    download:       Download,
    upload:         Upload,
    refresh:        RefreshCw,
    reset:          RotateCcw,
    externalLink:   ExternalLink,
    copy:           Copy,
    maximize:       Maximize2,
    minimize:       Minimize2,
    more:           MoreHorizontal,
    moreVertical:   MoreVertical,
    add:            Plus,
    close:          X,
    view:           Eye,
    hide:           EyeOff,
    layers:         Layers,
    settings:       SlidersHorizontal,
    adjust:         Sliders,
  },

  /** Data / analytics */
  data: {
    file:           FileText,
    spreadsheet:    FileSpreadsheet,
    table:          Table,
    calendar:       Calendar,
    calendarRange:  CalendarDays,
    pin:            MapPin,
    crosshair:      Crosshair,
    target:         Target,
    zap:            Zap,
  },

  /** Communication */
  communication: {
    alertRing:      BellRing,
    message:        MessageSquare,
    email:          Mail,
    phone:          Phone,
    share:          Share2,
  },

  /** Directional / navigation */
  direction: {
    right:          ArrowRight,
    left:           ArrowLeft,
    up:             ArrowUp,
    down:           ArrowDown,
    chevronDown:    ChevronDown,
    chevronRight:   ChevronRight,
    chevronLeft:    ChevronLeft,
    chevronUp:      ChevronUp,
    chevronUpDown:  ChevronsUpDown,
  },

  /** System / infrastructure */
  system: {
    logout:         LogOut,
    user:           User,
    users:          Users,
    building:       Building2,
    help:           HelpCircle,
    loader:         Loader2,
    online:         Wifi,
    offline:        WifiOff,
    database:       Database,
    server:         Server,
    lock:           Lock,
  },
} as const;


/* ═══════════════════════════════════════════════════════════
 * ICON SIZE PRESETS
 * Standardized sizes for consistent icon rendering
 * ═══════════════════════════════════════════════════════════ */

export const iconSize = {
  xs:  "w-3 h-3",       // 12px — inline micro
  sm:  "w-4 h-4",       // 16px — inline text
  md:  "w-5 h-5",       // 20px — standard nav/action
  lg:  "w-6 h-6",       // 24px — prominent
  xl:  "w-8 h-8",       // 32px — hero/empty states
  "2xl": "w-10 h-10",   // 40px — large decorative
} as const;


/* ═══════════════════════════════════════════════════════════
 * TYPE EXPORT
 * ═══════════════════════════════════════════════════════════ */

export type { LucideIcon };
