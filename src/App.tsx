import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts'

// ─── Design tokens — Dark Tech Theme ─────────────────────────────────────────
// Canvas: #070A12  Surface: #121826  Elevated: #1A2236  Border: #1E293B
// Text: #FFFFFF    Secondary: #94A3B8
// AQI: Safe #10B981 · Moderate #F59E0B · Danger #EF4444 · Critical #7C3AED

type AQITier = 'Safe' | 'Moderate' | 'Danger' | 'Critical'

function aqiTier(v: number): AQITier {
  if (v <= 50) return 'Safe'
  if (v <= 100) return 'Moderate'
  if (v <= 150) return 'Danger'
  return 'Critical'
}

const TIER: Record<AQITier, { color: string; bg: string; border: string }> = {
  Safe:     { color: '#10B981', bg: '#10B98118', border: '#10B98140' },
  Moderate: { color: '#F59E0B', bg: '#F59E0B18', border: '#F59E0B40' },
  Danger:   { color: '#EF4444', bg: '#EF444418', border: '#EF444440' },
  Critical: { color: '#7C3AED', bg: '#7C3AED18', border: '#7C3AED40' },
}

// ─── Forecast data — distinct per pollutant × model ──────────────────────────

const HOURS = ['Mon 00', 'Mon 06', 'Mon 12', 'Mon 18', 'Tue 00', 'Tue 06', 'Tue 12', 'Tue 18',
               'Wed 00', 'Wed 06', 'Wed 12', 'Wed 18', 'Thu 00', 'Thu 06', 'Thu 12', 'Thu 18',
               'Fri 00', 'Fri 06', 'Fri 12', 'Fri 18']

// PM2.5 + XGBoost: jagged high-variance spike → crimson projection
const CHART_PM25_XGB = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [62, 94, 148, 72, 88, 115, 53, 134][i] : undefined,
  projected:  i >= 8 ? [78, 142, 68, 188, 95, 162, 74, 198, 88, 154, 119, 212][i - 8] : undefined,
}))

// PM2.5 + LSTM: smoother, rolling
const CHART_PM25_LSTM = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [55, 72, 98, 80, 75, 88, 71, 95][i] : undefined,
  projected:  i >= 8 ? [92, 104, 98, 112, 105, 118, 108, 125, 115, 122, 118, 130][i - 8] : undefined,
}))

// NO2 + LSTM: smooth rolling wave → amber projection
const CHART_NO2_LSTM = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [28, 34, 42, 38, 31, 36, 41, 35][i] : undefined,
  projected:  i >= 8 ? [38, 44, 42, 47, 43, 48, 45, 50, 47, 52, 49, 54][i - 8] : undefined,
}))

// NO2 + XGBoost: spikier
const CHART_NO2_XGB = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [31, 28, 45, 32, 38, 27, 44, 33][i] : undefined,
  projected:  i >= 8 ? [36, 52, 38, 61, 42, 58, 37, 67, 44, 55, 39, 72][i - 8] : undefined,
}))

// PM10 + any: step-stair emerald
const CHART_PM10 = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [44, 44, 68, 68, 52, 52, 78, 78][i] : undefined,
  projected:  i >= 8 ? [72, 72, 92, 92, 80, 80, 104, 104, 88, 88, 110, 110][i - 8] : undefined,
}))

// SO2 + any: low flat with occasional spikes
const CHART_SO2 = HOURS.map((time, i) => ({
  time,
  historical: i < 8 ? [8, 10, 22, 9, 11, 18, 8, 25][i] : undefined,
  projected:  i >= 8 ? [12, 14, 28, 11, 16, 32, 10, 38, 13, 24, 11, 42][i - 8] : undefined,
}))

type PollutantKey = 'PM2.5' | 'PM10' | 'NO2' | 'SO2'
type ModelKey = 'XGBoost' | 'LSTM'

function getForecastData(pollutant: PollutantKey, model: ModelKey) {
  if (pollutant === 'PM2.5' && model === 'XGBoost') return { data: CHART_PM25_XGB, color: '#EF4444', unit: 'µg/m³', label: 'PM₂.₅' }
  if (pollutant === 'PM2.5' && model === 'LSTM')    return { data: CHART_PM25_LSTM, color: '#EF4444', unit: 'µg/m³', label: 'PM₂.₅' }
  if (pollutant === 'NO2'  && model === 'LSTM')     return { data: CHART_NO2_LSTM,  color: '#F59E0B', unit: 'ppb',   label: 'NO₂' }
  if (pollutant === 'NO2'  && model === 'XGBoost')  return { data: CHART_NO2_XGB,   color: '#F59E0B', unit: 'ppb',   label: 'NO₂' }
  if (pollutant === 'PM10')                         return { data: CHART_PM10,       color: '#10B981', unit: 'µg/m³', label: 'PM₁₀' }
  return { data: CHART_SO2, color: '#7C3AED', unit: 'ppb', label: 'SO₂' }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ATTRIBUTION_DATA = [
  { name: 'Traffic Emissions', value: 38, color: '#EF4444' },
  { name: 'Industrial Output', value: 27, color: '#F59E0B' },
  { name: 'Agricultural Biomass', value: 18, color: '#10B981' },
  { name: 'Urban Dust', value: 12, color: '#7C3AED' },
  { name: 'Other', value: 5, color: '#64748B' },
]

const SHAP_DATA = [
  { feature: 'Traffic density (8am)', value: 2.4, dir: 1 },
  { feature: 'Wind speed (low)', value: 1.9, dir: 1 },
  { feature: 'Industrial output', value: 1.6, dir: 1 },
  { feature: 'Ambient temperature', value: 0.8, dir: 1 },
  { feature: 'Precipitation (mm)', value: 1.2, dir: -1 },
  { feature: 'Green cover index', value: 0.7, dir: -1 },
  { feature: 'Weekend flag', value: 0.4, dir: -1 },
]

const POLLUTANTS = [
  { name: 'PM₂.₅', value: 58, unit: 'µg/m³', max: 75,  safe: 12  },
  { name: 'PM₁₀',  value: 89, unit: 'µg/m³', max: 150, safe: 54  },
  { name: 'NO₂',   value: 68, unit: 'ppb',   max: 100, safe: 53  },
  { name: 'SO₂',   value: 22, unit: 'ppb',   max: 75,  safe: 35  },
]

const ALERT_LOGS = [
  { id: 1, ward: 'Sector 12 — Industrial',   threshold: 100, aqi: 142, ts: '07:32 AM',            status: 'active'   },
  { id: 2, ward: 'Central Business District', threshold: 80,  aqi: 88,  ts: '05:14 AM',            status: 'active'   },
  { id: 3, ward: 'Residential East Zone',     threshold: 150, aqi: 162, ts: 'Yesterday 11:50 PM',  status: 'resolved' },
  { id: 4, ward: 'Airport Corridor Zone',     threshold: 120, aqi: 115, ts: 'Yesterday 03:22 PM',  status: 'resolved' },
]

const HEALTH_LOG = [
  { ts: '07:41:03', event: 'AQI threshold exceeded — Sector 12 Industrial', type: 'warn' },
  { ts: '07:39:51', event: 'LSTM inference complete — 89% confidence interval', type: 'info' },
  { ts: '07:38:22', event: 'Station SN-008 telemetry received (nominal)', type: 'ok' },
  { ts: '07:37:04', event: 'Alert dispatched — CBD ward AQI crossing', type: 'warn' },
  { ts: '07:35:17', event: 'GIS spatial join complete — 9 ward sectors', type: 'ok' },
  { ts: '07:34:02', event: 'XGBoost batch prediction pipeline finished', type: 'info' },
]

const WARDS = [
  { id: 'w1', name: 'North',       x: 60,  y: 45,  w: 110, h: 75, aqi: 45  },
  { id: 'w2', name: 'Central CBD', x: 178, y: 45,  w: 130, h: 75, aqi: 88  },
  { id: 'w3', name: 'East',        x: 316, y: 45,  w: 100, h: 75, aqi: 62  },
  { id: 'w4', name: 'Industrial',  x: 60,  y: 128, w: 110, h: 85, aqi: 142 },
  { id: 'w5', name: 'River',       x: 178, y: 128, w: 130, h: 85, aqi: 78  },
  { id: 'w6', name: 'Airport',     x: 316, y: 128, w: 100, h: 85, aqi: 115 },
  { id: 'w7', name: 'South',       x: 60,  y: 221, w: 110, h: 75, aqi: 55  },
  { id: 'w8', name: 'Tech Park',   x: 178, y: 221, w: 130, h: 75, aqi: 91  },
  { id: 'w9', name: 'Green Belt',  x: 316, y: 221, w: 100, h: 75, aqi: 32  },
]

const SENSOR_NODES = [
  { id: 'SN-001', name: 'North District Alpha',     ward: 'North',       battery: 94, status: 'active',   signal: -62, lastSeen: '12s ago',  aqi: 45  },
  { id: 'SN-002', name: 'CBD Central Hub',           ward: 'Central CBD', battery: 78, status: 'active',   signal: -54, lastSeen: '8s ago',   aqi: 88  },
  { id: 'SN-003', name: 'East Corridor Beta',        ward: 'East',        battery: 45, status: 'degraded', signal: -78, lastSeen: '43s ago',  aqi: 62  },
  { id: 'SN-004', name: 'Industrial Node Alpha',     ward: 'Industrial',  battery: 12, status: 'degraded', signal: -91, lastSeen: '2m ago',   aqi: 142 },
  { id: 'SN-005', name: 'River District Prime',      ward: 'River',       battery: 88, status: 'active',   signal: -59, lastSeen: '5s ago',   aqi: 78  },
  { id: 'SN-006', name: 'Airport Zone Sentinel',     ward: 'Airport',     battery: 0,  status: 'offline',  signal: null, lastSeen: '18m ago', aqi: 0   },
  { id: 'SN-007', name: 'South Residential Hub',     ward: 'South',       battery: 67, status: 'active',   signal: -66, lastSeen: '21s ago',  aqi: 55  },
  { id: 'SN-008', name: 'Tech Park Omega',            ward: 'Tech Park',   battery: 91, status: 'active',   signal: -51, lastSeen: '3s ago',   aqi: 91  },
  { id: 'SN-009', name: 'Green Belt Monitor',         ward: 'Green Belt',  battery: 55, status: 'active',   signal: -72, lastSeen: '34s ago',  aqi: 32  },
  { id: 'SN-010', name: 'Industrial Node Beta',       ward: 'Industrial',  battery: 22, status: 'degraded', signal: -88, lastSeen: '5m ago',   aqi: 138 },
  { id: 'SN-011', name: 'North District Beta',        ward: 'North',       battery: 81, status: 'active',   signal: -60, lastSeen: '17s ago',  aqi: 42  },
  { id: 'SN-012', name: 'CBD East Node',              ward: 'Central CBD', battery: 73, status: 'active',   signal: -57, lastSeen: '9s ago',   aqi: 85  },
]

const MODEL_METRICS = [
  { epoch: 1,   xgb: 18.4, lstm: 22.1 },
  { epoch: 5,   xgb: 10.2, lstm: 14.8 },
  { epoch: 10,  xgb: 6.8,  lstm: 9.4  },
  { epoch: 20,  xgb: 4.9,  lstm: 6.1  },
  { epoch: 40,  xgb: 4.2,  lstm: 5.2  },
  { epoch: 80,  xgb: 4.1,  lstm: 4.8  },
  { epoch: 120, xgb: 4.05, lstm: 4.6  },
]

const WARDS_LIST = ['Central CBD', 'Sector 12 — Industrial', 'Airport Zone', 'Residential East', 'Green Belt', 'Tech Park', 'River District', 'North District']

// ─── Shared primitives ────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'danger' | 'success' | 'ghost' | 'outline' | 'muted' | 'violet' | 'amber'

function Btn({
  children, onClick, variant = 'primary', size = 'md', full = false, disabled = false, className = '',
}: {
  children: React.ReactNode; onClick?: () => void; variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'; full?: boolean; disabled?: boolean; className?: string
}) {
  const base = `inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] border transition-all duration-150 select-none cursor-pointer
    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 active:scale-[0.96]
    ${full ? 'w-full' : ''} ${disabled ? 'opacity-40 pointer-events-none' : ''}`
  const sizes = { sm: 'px-3 py-1.5 text-xs tracking-wide', md: 'px-4 py-2.5 text-sm tracking-wide', lg: 'px-5 py-3 text-sm tracking-wider', xl: 'px-6 py-3.5 text-sm tracking-widest' }
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-[#070A12] border-cyan-500 shadow-[0_0_16px_#06b6d430] hover:shadow-[0_0_24px_#06b6d450]',
    danger:  'bg-[#EF4444] hover:bg-[#DC2626] text-white border-[#EF4444] shadow-[0_0_12px_#ef444425]',
    success: 'bg-[#10B981] hover:bg-[#059669] text-white border-[#10B981] shadow-[0_0_12px_#10b98125]',
    violet:  'bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-[#7C3AED] shadow-[0_0_12px_#7c3aed25]',
    amber:   'bg-[#F59E0B] hover:bg-[#D97706] text-[#070A12] border-[#F59E0B] shadow-[0_0_12px_#f59e0b25]',
    ghost:   'bg-transparent hover:bg-[#1A2236] text-[#94A3B8] hover:text-white border-transparent',
    outline: 'bg-transparent hover:bg-[#1A2236] text-[#94A3B8] hover:text-white border-[#1E293B] hover:border-[#334155]',
    muted:   'bg-[#1A2236] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border-[#1E293B]',
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >{children}</button>
  )
}

function Input({
  label, type = 'text', placeholder, value, onChange, id, right,
}: {
  label?: string; type?: string; placeholder?: string; value: string
  onChange: (v: string) => void; id?: string; right?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id} className="text-[#94A3B8] text-[10px] font-mono uppercase tracking-[0.12em]">{label}</label>}
      <div className="relative">
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0D1422] border border-[#1E293B] text-white text-sm rounded-[10px] px-4 py-3 font-mono outline-none
            focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-[#334155] transition-all placeholder:text-[#334155]"
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={onChange}
      className={`w-10 h-5 rounded-full border transition-all duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 cursor-pointer shrink-0
        ${checked ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_#06b6d440]' : 'bg-[#0D1422] border-[#1E293B]'}`}
    >
      <span className={`absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[20px]' : 'left-[3px]'}`} />
    </button>
  )
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button role="checkbox" aria-checked={checked} onClick={onChange}
      className="flex items-center gap-3 cursor-pointer group focus:outline-none w-full text-left"
    >
      <span className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all shrink-0
        ${checked ? 'bg-cyan-500 border-cyan-500' : 'bg-[#0D1422] border-[#1E293B] group-hover:border-[#334155]'}`}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#070A12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[#94A3B8] text-sm group-hover:text-white transition-colors">{label}</span>
    </button>
  )
}

function Card({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`bg-[#121826] border border-[#1E293B] rounded-xl ${glow ? 'shadow-[0_0_20px_#06b6d410]' : 'shadow-[0_4px_20px_#00000030]'} ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[#475569] text-[10px] font-mono uppercase tracking-[0.18em] flex items-center gap-2 ${className}`}>
      <span className="h-px w-4 bg-[#1E293B]" />{children}
    </div>
  )
}

function TierBadge({ aqi }: { aqi: number }) {
  const t = aqiTier(aqi); const { color, bg, border } = TIER[t]
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
      style={{ color, backgroundColor: bg, borderColor: border }}>
      {t === 'Danger' ? 'Unhealthy' : t}
    </span>
  )
}

// ─── Feature Brief Modal ──────────────────────────────────────────────────────

function FeatureBrief({ onClose, onDemo }: { onClose: () => void; onDemo: () => void }) {
  const features = [
    {
      icon: '◎', title: 'Real-Time GIS Spatial Heatmaps',
      desc: 'Ward-level spatial granularity with live telemetry overlay across 9 metropolitan sectors. Dynamic heatmap layers, boundary overlays, and sensor node visualisation.',
      color: '#10B981',
    },
    {
      icon: '⟿', title: 'Dual AI Forecasting Engine',
      desc: 'XGBoost for spatial feature matrices + LSTM for temporal trend sequences. 30-day horizon, 89% confidence, pollutant-specific curve shapes.',
      color: '#06B6D4',
    },
    {
      icon: '✦', title: 'Explainable AI (XAI) Attribution',
      desc: 'SHAP force plots identifying source sector contributions. Traffic, Industrial, Biomass, Urban Dust weighted per spatial cell with exportable datasheet.',
      color: '#F59E0B',
    },
    {
      icon: '◈', title: 'Automated Incident Dispatch',
      desc: 'Configurable AQI threshold triggers per ward. Email relay, in-app push, and webhook broadcast channels with one-click citizen alert dispatch.',
      color: '#EF4444',
    },
  ]
  const stack = ['Python FastAPI', 'PostgreSQL / PostGIS', 'XGBoost / LSTM', 'React TypeScript', 'Tailwind CSS v4']

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070A12]/90 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0D1422] border border-[#1E293B] rounded-2xl shadow-[0_24px_80px_#000000d0] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 py-6 border-b border-[#1E293B] bg-[#121826] shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 text-lg">◎</span>
              <span className="text-cyan-400 text-[10px] font-mono tracking-[0.25em] uppercase">AirSight · Hackathon Build</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-xl font-bold leading-tight">
              Next-Gen Atmospheric Intelligence<br />& AI Attribution Platform
            </h2>
          </div>
          <button onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 text-[#94A3B8] hover:text-white bg-[#1A2236] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#334155] rounded-[10px] text-xs font-mono transition-all cursor-pointer focus:outline-none active:scale-95 shrink-0">
            ✕ CLOSE BRIEF
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6 space-y-7">
          {/* Feature cards */}
          <div>
            <SectionLabel className="mb-4">Core Capability Matrix</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.title} className="bg-[#121826] border border-[#1E293B] rounded-xl p-5 hover:border-[#334155] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: f.color + '18', color: f.color }}>
                      {f.icon}
                    </span>
                    <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-sm font-bold leading-snug">{f.title}</div>
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <SectionLabel className="mb-4">System Tech Stack</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <div key={s} className="px-4 py-2 bg-[#121826] border border-[#1E293B] rounded-full text-xs font-mono text-[#94A3B8] hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { v: '9', l: 'Ward Sectors' }, { v: '46', l: 'IoT Nodes' },
              { v: '89%', l: 'Model Accuracy' }, { v: '38ms', l: 'Inference Time' },
            ].map((s) => (
              <div key={s.l} className="bg-[#121826] border border-[#1E293B] rounded-xl p-4 text-center">
                <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-cyan-400 text-2xl font-bold">{s.v}</div>
                <div className="text-[#475569] text-[10px] font-mono mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-7 py-5 border-t border-[#1E293B] bg-[#121826] shrink-0">
          <Btn variant="primary" size="xl" full onClick={() => { onDemo(); onClose() }}>
            EXPLORE LIVE DASHBOARD DEMO →
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function AuthPage({ onLogin, onBrief }: { onLogin: () => void; onBrief: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [terms, setTerms] = useState(false)
  const [toast, setToast] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const handleRegister = () => {
    if (!username || !email || !password) {
      setToast({ type: 'error', msg: '⚠ Account Not Found! Please complete all fields before registering.' })
      return
    }
    setToast({ type: 'success', msg: '✓ Registration Successful! Proceed to Login.' })
    setTimeout(() => { setMode('login'); setToast(null) }, 1800)
  }

  const EyeBtn = () => (
    <button onClick={() => setShowPw(!showPw)}
      className="text-[#475569] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1A2236] focus:outline-none cursor-pointer"
    >
      {showPw
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  )

  return (
    <div className="flex h-screen bg-[#070A12] overflow-hidden relative">
      {/* System status bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-20 border-b border-[#1E293B]/50">
        <button onClick={onBrief}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] hover:bg-[#121826] border border-transparent hover:border-[#1E293B] transition-all cursor-pointer focus:outline-none active:scale-95 group">
          <span className="text-cyan-400 text-base group-hover:drop-shadow-[0_0_6px_#06b6d4]">◎</span>
          <span style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-sm font-bold tracking-wider group-hover:text-cyan-400 transition-colors">AirSight</span>
        </button>
        <div className="flex items-center gap-2 bg-[#121826] border border-[#10B981]/30 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#10B981] text-[10px] font-mono font-bold tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Left — GIS graphic */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden border-r border-[#1E293B]">
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {Array.from({ length: 32 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke="#06b6d4" strokeWidth="0.5" />
              <line x1="0" y1={i * 40} x2="100%" y2={i * 40} stroke="#06b6d4" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
        <div className="flex-1 flex items-center justify-center p-12 pt-20">
          <svg viewBox="40 35 380 275" className="w-full max-w-lg">
            {WARDS.map((w) => {
              const { color, bg, border } = TIER[aqiTier(w.aqi)]
              return (
                <g key={w.id}>
                  <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={bg} stroke={border} strokeWidth="1.5" rx={6} />
                  <text x={w.x + w.w / 2} y={w.y + w.h / 2 - 8} textAnchor="middle" fill="#475569" fontSize={9} fontFamily="'JetBrains Mono'">{w.name}</text>
                  <text x={w.x + w.w / 2} y={w.y + w.h / 2 + 10} textAnchor="middle" fill={color} fontSize={16} fontFamily="'JetBrains Mono'" fontWeight="700">{w.aqi}</text>
                </g>
              )
            })}
            {WARDS.map((w) => {
              const { color } = TIER[aqiTier(w.aqi)]
              const cx = w.x + w.w / 2, cy = w.y + w.h / 2
              return (
                <g key={w.id + 'n'}>
                  <circle cx={cx} cy={cy} r={18} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
                  <circle cx={cx} cy={cy} r={4} fill={color} />
                </g>
              )
            })}
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#070A12] to-transparent px-10 py-10 pt-24">
          <div className="text-cyan-400 text-[10px] font-mono tracking-[0.25em] uppercase mb-2">◎ National Hackathon Build</div>
          <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-3xl font-bold leading-tight mb-3">
            AI-Powered Air Quality<br />Intelligence Platform
          </div>
          <p className="text-[#64748B] text-sm leading-relaxed max-w-md">Real-time GIS telemetry, XGBoost + LSTM dual-model forecasting, SHAP explainability across 9 metropolitan ward sectors.</p>
          <div className="flex gap-10 mt-6">
            {[{ v: '9', l: 'Ward Sectors' }, { v: '89%', l: 'Model Accuracy' }, { v: '38ms', l: 'Inference Time' }, { v: '46', l: 'Sensor Nodes' }].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-cyan-400 text-2xl font-bold">{s.v}</div>
                <div className="text-[#475569] text-[10px] font-mono mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — auth card */}
      <div className="w-full lg:w-[460px] shrink-0 flex flex-col items-center justify-center p-8 bg-[#070A12] pt-20">
        <div className="w-full max-w-sm">
          {/* Toast */}
          {toast && (
            <div className={`mb-5 px-4 py-3 rounded-xl border text-sm font-mono transition-all ${
              toast.type === 'error'
                ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                : 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
            }`}>
              {toast.msg}
            </div>
          )}

          <div className="mb-7">
            <div className="text-cyan-400 text-[10px] font-mono tracking-[0.25em] uppercase mb-3">◎ AirSight · Secure Access</div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-2xl font-bold">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-[#64748B] text-sm mt-1.5">
              {mode === 'login' ? 'Authenticate into your monitoring command center' : 'Join the AirSight research network today'}
            </p>
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <Input label="Full Name" placeholder="Arya Menon" value={fullName} onChange={setFullName} id="fn" />
            )}
            <Input label="Username" placeholder="arya.menon" value={username} onChange={setUsername} id="un" />
            {mode === 'register' && (
              <Input label="Email Address" type="email" placeholder="user@domain.com" value={email} onChange={setEmail} id="em" />
            )}
            <Input label="Secure Password" type={showPw ? 'text' : 'password'} placeholder="••••••••••••"
              value={password} onChange={setPassword} id="pw" right={<EyeBtn />} />

            {mode === 'register' && (
              <div className="pt-1">
                <Checkbox checked={terms} onChange={() => setTerms(!terms)}
                  label="I agree to AirSight Terms & Conditions" />
              </div>
            )}
            {mode === 'login' && (
              <div className="flex items-center justify-between pt-1">
                <Checkbox checked={remember} onChange={() => setRemember(!remember)} label="Remember Me" />
                <Btn variant="ghost" size="sm" onClick={() => {}}>Forgot Password Recovery?</Btn>
              </div>
            )}

            <div className="pt-2">
              {mode === 'login'
                ? <Btn variant="primary" size="xl" full onClick={onLogin}>SECURE AIRSIGHT LOG IN →</Btn>
                : <Btn variant="primary" size="xl" full onClick={handleRegister}>REGISTER NEW ACCOUNT →</Btn>
              }
            </div>
          </div>

          <div className="mt-6 text-center">
            {mode === 'login'
              ? <span className="text-[#64748B] text-sm">Don&apos;t have an account?{' '}
                  <button onClick={() => { setMode('register'); setToast(null) }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 cursor-pointer focus:outline-none transition-colors">
                    SWITCH TO REGISTER
                  </button>
                </span>
              : <span className="text-[#64748B] text-sm">Already registered?{' '}
                  <button onClick={() => { setMode('login'); setToast(null) }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 cursor-pointer focus:outline-none transition-colors">
                    SWITCH TO LOGIN
                  </button>
                </span>
            }
          </div>

          <div className="mt-8 pt-6 border-t border-[#1E293B] text-center">
            <p className="text-[#334155] text-[11px] font-mono">National Hackathon · AirSight v3.0 · Jul 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar + Nav ────────────────────────────────────────────────────────────

type Page = 'dashboard' | 'map' | 'forecast' | 'attribution' | 'alerts' | 'sensors' | 'models'

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard',   label: 'Dashboard',    icon: '⬡' },
  { id: 'map',         label: 'Spatial Map',  icon: '◎' },
  { id: 'forecast',    label: 'Forecast',     icon: '⟿' },
  { id: 'attribution', label: 'Attribution',  icon: '✦' },
  { id: 'alerts',      label: 'Alert Studio', icon: '◈' },
  { id: 'sensors',     label: 'Sensor Grid',  icon: '⚡' },
  { id: 'models',      label: 'Model Lab',    icon: '⬠' },
]

function Sidebar({ page, setPage, onLogout, onBrief }: { page: Page; setPage: (p: Page) => void; onLogout: () => void; onBrief: () => void }) {
  return (
    <nav className="flex flex-col w-14 lg:w-56 shrink-0 bg-[#0C111C] border-r border-[#1E293B] h-full">
      <button onClick={onBrief}
        className="px-4 py-5 border-b border-[#1E293B] hidden lg:flex items-center gap-2.5 w-full text-left hover:bg-[#121826] transition-colors cursor-pointer focus:outline-none group">
        <span className="text-cyan-400 text-xl group-hover:drop-shadow-[0_0_6px_#06b6d4] transition-all">◎</span>
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white text-sm font-bold tracking-wider group-hover:text-cyan-400 transition-colors">AirSight</div>
          <div className="text-[#334155] text-[9px] font-mono">Click for Feature Brief</div>
        </div>
      </button>
      <div className="px-2 lg:px-2.5 pt-4 flex-1 flex flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-all duration-150 w-full cursor-pointer
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/20
              ${page === item.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_#06b6d415]'
                : 'text-[#64748B] hover:text-white hover:bg-[#1A2236] border border-transparent active:scale-95'
              }`}
          >
            <span className="text-base leading-none shrink-0">{item.icon}</span>
            <span className="text-[13px] font-medium hidden lg:block" style={{ fontFamily: "'Outfit', sans-serif" }}>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="px-2.5 py-4 border-t border-[#1E293B]">
        <div className="hidden lg:flex items-center gap-2 mb-3 px-1">
          <div className="w-8 h-8 rounded-[10px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">A</div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">Arya Menon</div>
            <div className="text-[#475569] text-[10px] font-mono">Analyst · Mumbai</div>
          </div>
        </div>
        <Btn variant="outline" size="sm" full onClick={onLogout}>
          <span className="hidden lg:inline">Sign Out</span>
          <span className="lg:hidden">↩</span>
        </Btn>
      </div>
    </nav>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ page, onBrief }: { page: Page; onBrief: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [areaSearch, setAreaSearch] = useState('')
  const [gpsActive, setGpsActive] = useState(false)
  const [gpsLabel, setGpsLabel] = useState('')

  const handleGps = () => {
    setGpsActive(true)
    setGpsLabel('Locating…')
    setTimeout(() => {
      setGpsLabel('Mumbai — 19.076°N 72.877°E')
      setGpsActive(false)
    }, 1800)
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E293B] bg-[#0C111C] shrink-0 gap-3">
      {/* Breadcrumb + logo */}
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onBrief}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#1A2236] border border-transparent hover:border-[#1E293B] transition-all cursor-pointer focus:outline-none active:scale-95 group">
          <span className="text-cyan-400 text-sm group-hover:drop-shadow-[0_0_4px_#06b6d4]">◎</span>
          <span className="text-[#334155] text-xs font-mono hidden sm:inline group-hover:text-cyan-400 transition-colors">AirSight</span>
        </button>
        <span className="text-[#1E293B] hidden sm:inline text-xs">/</span>
        <span className="text-white text-xs font-mono font-semibold capitalize">{page}</span>
      </div>

      {/* GPS location engine */}
      <div className="flex items-center gap-2 flex-1 min-w-0 max-w-xl mx-2">
        <button onClick={handleGps} disabled={gpsActive}
          className={`flex items-center gap-2 px-3 py-2 rounded-[10px] border text-xs font-semibold transition-all cursor-pointer focus:outline-none active:scale-95 shrink-0
            ${gpsActive
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse'
              : 'bg-[#121826] border-[#1E293B] hover:border-cyan-500/40 hover:bg-cyan-500/5 text-[#94A3B8] hover:text-cyan-400'
            }`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span>📍</span>
          <span className="hidden md:inline">{gpsActive ? 'Detecting…' : gpsLabel || 'Detect Live GPS Location'}</span>
        </button>
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#334155]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={areaSearch} onChange={(e) => setAreaSearch(e.target.value)}
            placeholder="Search any ward, sector or postal code…"
            className="w-full bg-[#121826] border border-[#1E293B] text-[#94A3B8] text-xs rounded-[10px] pl-8 pr-3 py-2 font-mono outline-none focus:border-cyan-500/40 hover:border-[#334155] transition-all placeholder:text-[#334155]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-[#121826] border border-[#1E293B] hover:border-[#334155] text-[#64748B] hover:text-white transition-all cursor-pointer focus:outline-none active:scale-95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#0C111C]">2</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-[#121826] border border-[#1E293B] rounded-xl shadow-[0_8px_32px_#000000a0] z-50">
              <div className="px-4 py-3 border-b border-[#1E293B] flex items-center justify-between">
                <span className="text-white text-sm font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>Alert Hub</span>
                <span className="text-[#EF4444] text-[10px] font-mono font-semibold">2 ACTIVE</span>
              </div>
              {ALERT_LOGS.filter((a) => a.status === 'active').map((a) => (
                <div key={a.id} className="px-4 py-3 border-b border-[#1A2236] hover:bg-[#1A2236] transition-colors cursor-pointer">
                  <div className="text-white text-xs font-semibold">{a.ward}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: TIER[aqiTier(a.aqi)].color, fontFamily: "'JetBrains Mono', monospace" }} className="text-xs font-bold">AQI {a.aqi}</span>
                    <TierBadge aqi={a.aqi} />
                  </div>
                </div>
              ))}
              <div className="p-3 flex justify-end">
                <Btn variant="ghost" size="sm" onClick={() => setNotifOpen(false)}>Dismiss All</Btn>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-l border-[#1E293B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#10B981] text-[10px] font-mono font-semibold hidden sm:inline">LIVE</span>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function AQIGauge({ value, onClick }: { value: number; onClick: () => void }) {
  const t = aqiTier(value); const { color, bg, border } = TIER[t]
  const r = 68, circ = 2 * Math.PI * r, dash = circ * Math.min(value / 300, 1)
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-4 p-5 rounded-xl border hover:border-[#334155] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 active:scale-[0.98] w-full group"
      style={{ borderColor: border, backgroundColor: bg }}
    >
      <div className="relative">
        <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
          <circle cx="88" cy="88" r={r} fill="none" stroke="#1E293B" strokeWidth="10" />
          <circle cx="88" cy="88" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 44, fontWeight: 700, lineHeight: 1 }}>{value}</span>
          <span className="text-[#475569] text-[10px] font-mono mt-1">US EPA · AQI</span>
        </div>
      </div>
      <div className="px-5 py-2 rounded-full text-sm font-bold border" style={{ color, borderColor: border, backgroundColor: bg, fontFamily: "'Outfit', sans-serif" }}>
        Unhealthy — Sensitive Groups
      </div>
      <span className="text-[#334155] text-[10px] font-mono group-hover:text-cyan-400 transition-colors">Click for micro-diagnostic detail →</span>
    </button>
  )
}

function Dashboard() {
  const currentAQI = 142
  const [microOpen, setMicroOpen] = useState(false)
  const [expandedPoll, setExpandedPoll] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'City AQI Index',   value: '142', sub: 'Danger · Mumbai Metro', color: '#EF4444' },
          { label: 'Active Alerts',    value: '2',   sub: 'Sectors 12 & CBD',     color: '#EF4444' },
          { label: 'Stations Online',  value: '42',  sub: '3 degraded · 1 offline', color: '#F59E0B' },
          { label: 'Last Sync',        value: '07:41', sub: 'AM · 19 Jul 2026',   color: '#64748B' },
        ].map((m) => (
          <Card key={m.label} className="p-5">
            <div className="text-[#475569] text-[10px] font-mono uppercase tracking-[0.15em] mb-3">{m.label}</div>
            <div style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-2xl font-bold leading-none mb-1">{m.value}</div>
            <div className="text-[#475569] text-[10px] font-mono">{m.sub}</div>
          </Card>
        ))}
      </div>

      {/* Micro-diagnostic panel */}
      {microOpen && (
        <Card className="p-5 border-cyan-500/20" glow>
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Micro-Diagnostic Deep View</SectionLabel>
            <Btn variant="ghost" size="sm" onClick={() => setMicroOpen(false)}>✕ Close</Btn>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Ozone (O₃)', '31 ppb', '#10B981'], ['CO', '0.6 ppm', '#10B981'], ['Benzene', '1.8 µg/m³', '#F59E0B'],
              ['Lead (Pb)', '0.02 µg/m³', '#10B981'], ['NH₃', '4.2 ppb', '#F59E0B'], ['H₂S', '0.04 ppm', '#10B981']].map(([k, v, c]) => (
              <div key={k as string} className="bg-[#0D1422] border border-[#1E293B] rounded-xl p-3">
                <div className="text-[#475569] text-[10px] font-mono mb-1.5">{k}</div>
                <div style={{ color: c as string, fontFamily: "'JetBrains Mono', monospace" }} className="text-sm font-bold">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge */}
        <Card className="p-6 flex flex-col gap-4">
          <SectionLabel>Mumbai Metro · Live AQI</SectionLabel>
          <AQIGauge value={currentAQI} onClick={() => setMicroOpen(!microOpen)} />
          <div className="bg-[#0D1422] rounded-xl p-4 border border-[#1E293B]">
            <div className="text-[#475569] text-[10px] font-mono uppercase tracking-wider mb-2">Health Advisory</div>
            <p className="text-[#64748B] text-xs leading-relaxed">
              <span className="text-[#EF4444] font-semibold">Danger level reached.</span> Sensitive groups must stay indoors. Masks mandatory for all outdoor activity in Industrial and CBD sectors.
            </p>
          </div>
        </Card>

        {/* Pollutant grid */}
        <Card className="p-6 flex flex-col gap-4">
          <SectionLabel>Multi-Pollutant Grid Array</SectionLabel>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {POLLUTANTS.map((p) => {
              const pct = (p.value / p.max) * 100
              const col = pct > 70 ? '#EF4444' : pct > 40 ? '#F59E0B' : '#10B981'
              const isExp = expandedPoll === p.name
              return (
                <div key={p.name} className="bg-[#0D1422] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-3 hover:border-[#334155] hover:shadow-[0_0_12px_#06b6d410] transition-all">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-white text-xs font-semibold">{p.name}</span>
                    <Btn variant={isExp ? 'primary' : 'muted'} size="sm" onClick={() => setExpandedPoll(isExp ? null : p.name)} className="text-[9px] !px-2 !py-1 shrink-0">
                      {isExp ? '✕' : '↗'}
                    </Btn>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span style={{ color: col, fontFamily: "'JetBrains Mono', monospace" }} className="text-2xl font-bold">{p.value}</span>
                    <span className="text-[#475569] text-[9px] font-mono">{p.unit}</span>
                  </div>
                  <div>
                    <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%`, backgroundColor: col, boxShadow: `0 0 6px ${col}` }} className="h-full rounded-full" />
                    </div>
                    <div className="flex justify-between text-[#334155] text-[9px] font-mono mt-1">
                      <span>0</span><span>Max: {p.max}</span>
                    </div>
                  </div>
                  {isExp && (
                    <div className="text-[#64748B] text-[10px] font-mono bg-[#121826] rounded-lg px-3 py-2 border border-[#1E293B]">
                      Safe: {p.safe} {p.unit} · Current at {((p.value / p.safe) * 100).toFixed(0)}% of limit
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* System log */}
        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionLabel>Real-Time System Log</SectionLabel>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-[9px] font-mono font-semibold">STREAMING</span>
            </div>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
            {HEALTH_LOG.map((e, i) => (
              <div key={i} className="flex gap-3 items-start pb-2.5 border-b border-[#1A2236] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${e.type === 'warn' ? 'bg-[#F59E0B]' : e.type === 'ok' ? 'bg-[#10B981]' : 'bg-cyan-400'}`} />
                <div className="min-w-0">
                  <div className="text-[#334155] text-[9px] font-mono">{e.ts}</div>
                  <div className="text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">{e.event}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn variant="outline" size="sm" onClick={() => {}}>View Full System Log →</Btn>
        </Card>
      </div>
    </div>
  )
}

// ─── Map ──────────────────────────────────────────────────────────────────────

function MapPage() {
  const [layers, setLayers] = useState({ heatmap: true, stations: true, boundaries: true })
  const [timeSlider, setTimeSlider] = useState(8)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState<typeof WARDS[0] | null>(null)
  const nudge = (d: number) => setTimeSlider((t) => Math.max(0, Math.min(23, t + d)))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-[#1E293B] bg-[#0C111C] shrink-0 flex items-center justify-between">
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold">Immersive GIS Spatial Ward Map</div>
          <div className="text-[#475569] text-[10px] font-mono mt-0.5">Mumbai Metropolitan · 9 Monitoring Zones · Ward Boundary Engine</div>
        </div>
        <TierBadge aqi={142} />
      </div>
      <div className="relative flex-1 overflow-hidden bg-[#070A12]">
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          {Array.from({ length: 28 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke="#0EA5E9" strokeWidth="0.4" />
              <line x1="0" y1={i * 40} x2="100%" y2={i * 40} stroke="#0EA5E9" strokeWidth="0.4" />
            </g>
          ))}
        </svg>

        {/* Ward map */}
        <svg viewBox="40 35 380 275" className="absolute inset-0 w-full" style={{ height: 'calc(100% - 60px)' }}>
          {layers.heatmap && WARDS.map((w) => {
            const { bg } = TIER[aqiTier(w.aqi)]
            return <rect key={w.id} x={w.x} y={w.y} width={w.w} height={w.h} fill={bg} rx={4}
              onMouseEnter={() => setHovered(w)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" />
          })}
          {layers.boundaries && WARDS.map((w) => {
            const { color, border } = TIER[aqiTier(w.aqi)]
            return <rect key={w.id + 'b'} x={w.x} y={w.y} width={w.w} height={w.h} fill="none"
              stroke={hovered?.id === w.id ? color : border} strokeWidth={hovered?.id === w.id ? 2 : 1.5} rx={4}
              onMouseEnter={() => setHovered(w)} onMouseLeave={() => setHovered(null)} className="cursor-pointer" />
          })}
          {WARDS.map((w) => {
            const { color } = TIER[aqiTier(w.aqi)]
            return (
              <g key={w.id + 'l'}>
                <text x={w.x + w.w / 2} y={w.y + w.h / 2 - 8} textAnchor="middle" fill="#334155" fontSize={8} fontFamily="'JetBrains Mono'">{w.name}</text>
                <text x={w.x + w.w / 2} y={w.y + w.h / 2 + 10} textAnchor="middle" fill={color} fontSize={16} fontFamily="'JetBrains Mono'" fontWeight="700">{w.aqi}</text>
              </g>
            )
          })}
          {layers.stations && WARDS.map((w) => {
            const { color } = TIER[aqiTier(w.aqi)]
            const cx = w.x + w.w / 2, cy = w.y + w.h / 2
            return (
              <g key={w.id + 's'} className="cursor-pointer" onMouseEnter={() => setHovered(w)} onMouseLeave={() => setHovered(null)}>
                <circle cx={cx} cy={cy} r={14} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity={0.5} />
                <circle cx={cx} cy={cy} r={5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
              </g>
            )
          })}
        </svg>

        {/* Layer control */}
        <div className="absolute top-4 left-4 bg-[#121826] border border-[#1E293B] rounded-xl p-5 shadow-[0_8px_32px_#000000a0] w-52">
          <SectionLabel className="mb-4">Layer Control Panel</SectionLabel>
          <div className="space-y-4">
            {([
              { key: 'heatmap' as const, label: 'Toggle Heatmap Density' },
              { key: 'stations' as const, label: 'Toggle Sensor Nodes' },
              { key: 'boundaries' as const, label: 'Toggle Ward Boundaries' },
            ]).map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg hover:bg-[#1A2236] transition-colors">
                <Checkbox checked={layers[key]} onChange={() => setLayers((p) => ({ ...p, [key]: !p[key] }))} label={label} />
                <Toggle checked={layers[key]} onChange={() => setLayers((p) => ({ ...p, [key]: !p[key] }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute top-4 right-4 bg-[#121826] border border-[#1E293B] rounded-xl p-5 shadow-[0_8px_32px_#000000a0] pointer-events-none">
            <div className="text-[#475569] text-[10px] font-mono uppercase mb-1">{hovered.name} Ward</div>
            <div style={{ color: TIER[aqiTier(hovered.aqi)].color, fontFamily: "'JetBrains Mono', monospace" }} className="text-4xl font-bold">{hovered.aqi}</div>
            <div className="mt-1"><TierBadge aqi={hovered.aqi} /></div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-16 right-4 bg-[#121826] border border-[#1E293B] rounded-xl p-4 shadow-xl">
          <SectionLabel className="mb-3">Hazard Scale</SectionLabel>
          {(['Safe', 'Moderate', 'Danger', 'Critical'] as AQITier[]).map((t) => (
            <div key={t} className="flex items-center gap-2 mb-2 last:mb-0">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: TIER[t].color }} />
              <span className="text-[#64748B] text-[11px]">{t === 'Danger' ? 'Unhealthy' : t}</span>
            </div>
          ))}
        </div>

        {/* Playback bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0C111C] border-t border-[#1E293B] px-5 py-3 flex items-center gap-3">
          <Btn variant="outline" size="sm" onClick={() => nudge(-3)}>◀ REWIND</Btn>
          <Btn variant={playing ? 'muted' : 'success'} size="sm" onClick={() => setPlaying((p) => !p)}>
            {playing ? '⏸ PAUSE PREDICTION' : '▶ RUN SIMULATION'}
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => nudge(3)}>FAST FORWARD ▶▶</Btn>
          <span className="text-[#334155] text-[10px] font-mono shrink-0">00:00</span>
          <input type="range" min={0} max={23} value={timeSlider} onChange={(e) => setTimeSlider(Number(e.target.value))} className="flex-1" />
          <span className="text-[#334155] text-[10px] font-mono shrink-0">23:00</span>
          <div className="bg-[#121826] border border-[#1E293B] px-3 py-1.5 rounded-[10px] shrink-0">
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-cyan-400 text-sm font-bold">
              {String(timeSlider).padStart(2, '0')}:00
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#121826] border border-[#1E293B] rounded-xl p-3 text-xs font-mono shadow-xl">
      <div className="text-[#475569] mb-2">{label}</div>
      {payload.map((p: any) => p.value != null && (
        <div key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-6">
          <span>{p.dataKey === 'historical' ? 'Historical' : 'Projected'}</span>
          <span className="font-bold">{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function ForecastPage() {
  const [pollutant, setPollutant] = useState<PollutantKey>('PM2.5')
  const [model, setModel] = useState<ModelKey>('XGBoost')
  const [interval, setInterval_] = useState<'24h' | '3d' | '7d' | '30d'>('3d')
  const [modelOpen, setModelOpen] = useState(false)
  const slices = { '24h': 8, '3d': 12, '7d': 16, '30d': 20 }
  const { data, color, unit, label } = getForecastData(pollutant, model)
  const slicedData = data.slice(0, slices[interval])

  // Derive description for current selection
  const variant = pollutant === 'PM2.5' && model === 'XGBoost'
    ? 'Jagged high-variance spike curve'
    : pollutant === 'NO2' && model === 'LSTM'
    ? 'Smooth rolling wave curve'
    : pollutant === 'PM10'
    ? 'Step-stair trend pattern'
    : 'Spiky irregular profile'

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold text-base">Time-Series Predictive Forecasting Hub</div>
          <div className="text-[#475569] text-[10px] font-mono mt-1">
            {label} · {variant} · {model} · Confidence 89%
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Model dropdown */}
          <div className="relative">
            <Btn variant="outline" size="md" onClick={() => setModelOpen(!modelOpen)}>
              <span className="text-cyan-400">◈</span>
              <span>ML Pipeline: {model} Regressor</span>
              <span className="text-[#334155]">▾</span>
            </Btn>
            {modelOpen && (
              <div className="absolute right-0 top-11 w-56 bg-[#121826] border border-[#1E293B] rounded-xl overflow-hidden shadow-[0_8px_32px_#000000c0] z-50">
                {(['XGBoost', 'LSTM'] as ModelKey[]).map((m) => (
                  <button key={m} onClick={() => { setModel(m); setModelOpen(false) }}
                    className={`w-full px-4 py-3 text-left text-xs font-mono transition-colors cursor-pointer focus:outline-none
                      ${model === m ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-[#94A3B8] hover:bg-[#1A2236] hover:text-white'}`}>
                    {m === 'XGBoost' ? 'XGBoost Spatial Model' : 'LSTM Sequential Model'}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Granularity */}
          <div className="flex bg-[#121826] border border-[#1E293B] rounded-[10px] overflow-hidden text-xs font-mono">
            {(['24h', '3d', '7d', '30d'] as const).map((t) => (
              <button key={t} onClick={() => setInterval_(t)}
                className={`px-3.5 py-2.5 transition-colors cursor-pointer focus:outline-none ${interval === t ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-[#64748B] hover:text-white hover:bg-[#1A2236]'}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pollutant pill tabs */}
      <div className="flex flex-wrap gap-2">
        {(['PM2.5', 'PM10', 'NO2', 'SO2'] as PollutantKey[]).map((p) => {
          const isActive = pollutant === p
          const colMap: Record<PollutantKey, string> = { 'PM2.5': '#EF4444', 'PM10': '#10B981', 'NO2': '#F59E0B', 'SO2': '#7C3AED' }
          return (
            <button key={p} onClick={() => setPollutant(p)}
              className={`px-5 py-2.5 rounded-full border text-xs font-semibold font-mono transition-all cursor-pointer focus:outline-none active:scale-[0.96]
                ${isActive ? 'text-[#070A12] border-transparent shadow-[0_0_12px_rgba(0,0,0,0.5)]' : 'bg-[#121826] border-[#1E293B] text-[#64748B] hover:text-white hover:border-[#334155]'}`}
              style={isActive ? { backgroundColor: colMap[p], boxShadow: `0 0 16px ${colMap[p]}50` } : {}}
            >
              {p === 'PM2.5' ? 'PM₂.₅' : p === 'PM10' ? 'PM₁₀' : p}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5"><div className="w-5 h-0.5" style={{ backgroundColor: color }} /><span className="text-[#475569]">Historical</span></div>
          <div className="flex items-center gap-1.5"><div className="w-5 h-0.5 border-t-2 border-dashed" style={{ borderColor: color }} /><span className="text-[#475569]">Projected</span></div>
        </div>
      </div>

      <Card className="p-5" glow>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={slicedData} margin={{ top: 8, right: 16, left: -20, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" tick={{ fill: '#334155', fontSize: 10, fontFamily: "'JetBrains Mono'" }} tickLine={false} axisLine={{ stroke: '#1E293B' }} interval={1} />
            <YAxis tick={{ fill: '#334155', fontSize: 10, fontFamily: "'JetBrains Mono'" }} tickLine={false} axisLine={false} unit={` ${unit}`} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={pollutant === 'NO2' ? 53 : pollutant === 'SO2' ? 35 : pollutant === 'PM10' ? 54 : 12}
              stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Safe', fill: '#10B981', fontSize: 9 }} />
            <Line type={pollutant === 'NO2' && model === 'LSTM' ? 'monotone' : pollutant === 'PM10' ? 'stepAfter' : 'linear'}
              dataKey="historical" stroke={color} strokeWidth={2.5} dot={false} connectNulls={false}
              style={{ filter: `drop-shadow(0 0 4px ${color}60)` }} />
            <Line type={pollutant === 'NO2' && model === 'LSTM' ? 'monotone' : pollutant === 'PM10' ? 'stepAfter' : 'linear'}
              dataKey="projected" stroke={color} strokeWidth={2} dot={false} strokeDasharray="6 4" connectNulls={false}
              style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peak Forecast',  value: slicedData.reduce((mx, d) => Math.max(mx, d.projected ?? 0), 0).toFixed(0), note: 'Highest projected value', color },
          { label: 'Avg Projected',  value: Math.round(slicedData.filter(d => d.projected != null).reduce((s, d) => s + (d.projected ?? 0), 0) / Math.max(1, slicedData.filter(d => d.projected != null).length)).toString(), note: 'Mean over window', color },
          { label: 'Unit',           value: unit, note: `${label} measurement`, color: '#64748B' },
          { label: 'Confidence',     value: '89%', note: `${model} ensemble`, color: '#06B6D4' },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-[#475569] text-[10px] font-mono uppercase tracking-wider mb-2">{s.label}</div>
            <div style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-xl font-bold mb-1">{s.value}</div>
            <div className="text-[#334155] text-[9px] font-mono">{s.note}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Attribution ──────────────────────────────────────────────────────────────

const DonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  if (value < 8) return null
  const R = Math.PI / 180, r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * R), y = cy + r * Math.sin(-midAngle * R)
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontFamily="'JetBrains Mono'" fontWeight="700">{value}%</text>
}

function AttributionPage() {
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [shapFilter, setShapFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const maxShap = Math.max(...SHAP_DATA.map((d) => d.value))
  const filteredShap = SHAP_DATA.filter((d) => shapFilter === 'all' || (shapFilter === 'positive' ? d.dir > 0 : d.dir < 0))

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold text-base">ML Pollutant Attribution & Transparency Platform</div>
        <div className="text-[#475569] text-[10px] font-mono mt-1">Explainable AI · SHAP v0.41 · XGBoost inference · Base prediction: AQI 42</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut */}
        <Card className="p-6 flex flex-col gap-4">
          <SectionLabel>Source Sector Distribution</SectionLabel>
          <div className="flex items-center justify-center">
            <PieChart width={260} height={200}>
              <Pie data={ATTRIBUTION_DATA} cx={130} cy={100} innerRadius={52} outerRadius={90}
                paddingAngle={2} dataKey="value" labelLine={false} label={DonutLabel}>
                {ATTRIBUTION_DATA.map((d) => (
                  <Cell key={d.name} fill={d.color} opacity={activeSource && activeSource !== d.name ? 0.2 : 1} style={{ cursor: 'pointer' }} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1">
            {ATTRIBUTION_DATA.map((d) => (
              <button key={d.name} onClick={() => setActiveSource(activeSource === d.name ? null : d.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] border transition-all cursor-pointer focus:outline-none active:scale-[0.98]
                  ${activeSource === d.name ? 'border-[#1E293B] bg-[#1A2236]' : 'border-transparent hover:bg-[#1A2236]'}`}
              >
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[#94A3B8] text-xs flex-1 text-left">{d.name}</span>
                <div className="w-24 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div style={{ width: `${d.value}%`, backgroundColor: d.color }} className="h-full" />
                </div>
                <span style={{ color: d.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-xs w-8 text-right font-semibold">{d.value}%</span>
              </button>
            ))}
          </div>
        </Card>

        {/* SHAP */}
        <Card className="p-6 flex flex-col gap-4">
          <div>
            <SectionLabel>SHAP Force Plot Visualization</SectionLabel>
            <div className="text-[#475569] text-[9px] font-mono mt-1">Prediction: AQI 142 · Base: 42 · Δ+100 explained</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Btn variant="danger" size="sm" onClick={() => {}}>EXPORT DATASHEET ↓</Btn>
            <Btn variant="outline" size="sm" onClick={() => setShapFilter(shapFilter === 'all' ? 'positive' : shapFilter === 'positive' ? 'negative' : 'all')}>
              FILTER MODEL FEATURES · {shapFilter === 'all' ? 'ALL' : shapFilter === 'positive' ? '↑ PUSH' : '↓ REDUCE'}
            </Btn>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[#334155] px-[calc(40%+6px)]">
            <span>← Decreases AQI</span><span>Increases AQI →</span>
          </div>
          <div className="space-y-3 flex-1">
            {filteredShap.map((d) => {
              const w = (d.value / maxShap) * 44
              return (
                <div key={d.feature} className="flex items-center gap-2">
                  <div className="w-36 text-[#64748B] text-[10px] text-right shrink-0 pr-2 leading-snug">{d.feature}</div>
                  <div className="flex-1 flex items-center h-6">
                    <div className="w-1/2 flex justify-end">
                      {d.dir < 0 && <div className="h-5 rounded-[4px]" style={{ width: `${w * 2}%`, backgroundColor: '#3B82F6', minWidth: 4, boxShadow: '0 0 6px #3B82F660' }} />}
                    </div>
                    <div className="w-px h-6 bg-[#1E293B] mx-0.5" />
                    <div className="w-1/2">
                      {d.dir > 0 && <div className="h-5 rounded-[4px]" style={{ width: `${w * 2}%`, backgroundColor: '#EF4444', minWidth: 4, boxShadow: '0 0 6px #EF444460' }} />}
                    </div>
                  </div>
                  <span style={{ color: d.dir > 0 ? '#EF4444' : '#3B82F6', fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] w-10 shrink-0 text-right font-semibold">
                    {d.dir > 0 ? '+' : '-'}{d.value}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-5 pt-3 border-t border-[#1E293B] text-[10px] font-mono">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#EF4444]" /><span className="text-[#475569]">Increases AQI</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#3B82F6]" /><span className="text-[#475569]">Decreases AQI</span></div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

function AlertsPage() {
  const [form, setForm] = useState({ ward: 'Central CBD', threshold: 100, email: true, inapp: true, webhook: false })
  const [saved, setSaved] = useState(false)
  const [dispatched, setDispatched] = useState<number[]>([])
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold text-base">Targeted Emergency Alert Simulation Studio</div>
        <div className="text-[#475569] text-[10px] font-mono mt-1">Configure crisis triggers · Active incident logs · Dispatch broadcast system</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config form */}
        <Card className="p-6 flex flex-col gap-5">
          <SectionLabel>Crisis Parameter Configuration Form</SectionLabel>
          <div className="flex flex-col gap-2">
            <label className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider">Select Target Threat Zone / Ward ▾</label>
            <div className="relative">
              <select value={form.ward} onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))}
                className="w-full bg-[#0D1422] border border-[#1E293B] text-white text-sm rounded-[10px] px-4 py-3 font-mono outline-none hover:border-[#334155] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer appearance-none">
                {WARDS_LIST.map((w) => <option key={w}>{w}</option>)}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none text-xs">▾</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider">AQI Threshold Boundary</label>
              <div className="flex items-center gap-2">
                <span style={{ color: TIER[aqiTier(form.threshold)].color, fontFamily: "'JetBrains Mono', monospace" }} className="text-xl font-bold">{form.threshold}</span>
                <TierBadge aqi={form.threshold} />
              </div>
            </div>
            <input type="range" min={25} max={250} step={5} value={form.threshold} onChange={(e) => setForm((f) => ({ ...f, threshold: Number(e.target.value) }))} className="w-full" />
            <div className="flex justify-between text-[#334155] text-[9px] font-mono">
              <span>25 · Safe</span><span>100 · Moderate</span><span>150 · Danger</span><span>250</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider">Notification Channel Targets</div>
            {[
              { key: 'email' as const,   label: 'Email Relay Switch Box' },
              { key: 'inapp' as const,   label: 'System Push Notification Toggle' },
              { key: 'webhook' as const, label: 'External Webhook API Relay Toggle' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2.5 px-3 rounded-[10px] border border-[#1E293B] hover:bg-[#1A2236] transition-colors">
                <Checkbox checked={form[key]} onChange={() => setForm((f) => ({ ...f, [key]: !f[key] }))} label={label} />
                <Toggle checked={form[key]} onChange={() => setForm((f) => ({ ...f, [key]: !f[key] }))} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <Btn variant={saved ? 'success' : 'primary'} size="lg" full onClick={save}>
              {saved ? '✓ CONFIGURATION SAVED' : 'SAVE ALERT CONFIGURATION'}
            </Btn>
            <Btn variant="outline" size="lg" onClick={() => setForm({ ward: 'Central CBD', threshold: 100, email: true, inapp: true, webhook: false })}>Reset</Btn>
          </div>
        </Card>

        {/* Incident table */}
        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionLabel>Active Incident Logs</SectionLabel>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[#EF4444] text-[9px] font-mono font-semibold">2 ACTIVE</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  {['Ward Zone', 'Threshold', 'Live AQI', 'Timestamp', 'Response'].map((h) => (
                    <th key={h} className="text-left text-[#334155] font-mono text-[9px] uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2236]">
                {ALERT_LOGS.map((a) => (
                  <tr key={a.id} className="hover:bg-[#1A2236] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="text-white text-xs font-semibold leading-snug">{a.ward}</div>
                      <div className="mt-1">
                        {a.status === 'active'
                          ? <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-[8px] font-semibold rounded-full border border-[#EF4444]/30 uppercase">● Active</span>
                          : <span className="px-2 py-0.5 bg-[#1E293B] text-[#475569] text-[8px] font-mono rounded-full border border-[#1E293B] uppercase">○ Resolved</span>
                        }
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-[#64748B]">{a.threshold}</td>
                    <td className="py-3.5 pr-4">
                      <span style={{ color: TIER[aqiTier(a.aqi)].color, fontFamily: "'JetBrains Mono', monospace" }} className="font-bold text-sm">{a.aqi}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-[#475569] font-mono whitespace-nowrap text-[10px]">{a.ts}</td>
                    <td className="py-3.5">
                      {dispatched.includes(a.id)
                        ? <span className="text-[#10B981] text-[10px] font-mono font-bold">✓ DISPATCHED</span>
                        : <Btn variant="danger" size="sm" onClick={() => setDispatched((p) => [...p, a.id])}>DISPATCH CITIZEN ALERT BROADCAST</Btn>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[#334155] text-[10px] font-mono">4 of 12 incidents shown</span>
            <Btn variant="ghost" size="sm" onClick={() => {}}>View All Incidents →</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Sensors ──────────────────────────────────────────────────────────────────

function SensorsPage() {
  const [pinged, setPinged] = useState<string[]>([])
  const active = 42, degraded = 3, offline = 1
  const ping = (id: string) => { setPinged((p) => [...p, id]); setTimeout(() => setPinged((p) => p.filter((x) => x !== id)), 2000) }
  const batteryColor = (v: number) => v > 60 ? '#10B981' : v > 20 ? '#F59E0B' : '#EF4444'
  const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
    active:   { color: '#10B981', bg: '#10B98115', border: '#10B98140' },
    degraded: { color: '#F59E0B', bg: '#F59E0B15', border: '#F59E0B40' },
    offline:  { color: '#EF4444', bg: '#EF444415', border: '#EF444440' },
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold text-base">Sensor Health & Edge Node Orchestration Grid</div>
        <div className="text-[#475569] text-[10px] font-mono mt-1">IoT telemetry hardware streams · {active + degraded + offline} ward sector nodes · Real-time diagnostics</div>
      </div>

      {/* Status tiles */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Web-Nodes',        value: active,   color: '#10B981', bg: '#10B98115', border: '#10B98140', icon: '✓' },
          { label: 'Degraded Field Stations', value: degraded, color: '#F59E0B', bg: '#F59E0B15', border: '#F59E0B40', icon: '⚠' },
          { label: 'Offline Geo-Sensors',     value: offline,  color: '#EF4444', bg: '#EF444415', border: '#EF444440', icon: '✕' },
        ].map((m) => (
          <button key={m.label}
            className="rounded-xl p-5 text-left border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/20 active:scale-[0.98] hover:shadow-[0_0_16px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: m.bg, borderColor: m.border }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider leading-tight">{m.label}</span>
              <span className="text-lg" style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-4xl font-bold">{m.value}</div>
            <div className="text-[#475569] text-[10px] font-mono mt-1">of {active + degraded + offline} total</div>
          </button>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionLabel>Node Deployment Catalog</SectionLabel>
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" onClick={() => {}}>Export Node Report ↓</Btn>
            <Btn variant="muted" size="sm" onClick={() => setPinged([])}>Clear Diagnostics</Btn>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {SENSOR_NODES.map((s) => {
            const isPinged = pinged.includes(s.id)
            const bCol = batteryColor(s.battery)
            const ss = statusStyle[s.status]
            return (
              <div key={s.id} className={`bg-[#0D1422] border rounded-xl p-4 transition-all ${isPinged ? 'border-cyan-500/40 shadow-[0_0_16px_#06b6d420]' : 'border-[#1E293B] hover:border-[#334155]'}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{s.name}</div>
                    <div className="text-[#334155] text-[10px] font-mono mt-0.5">{s.id}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold border shrink-0 capitalize"
                    style={{ color: ss.color, backgroundColor: ss.bg, borderColor: ss.border }}>
                    {s.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569] text-[10px] font-mono">Ward</span>
                    <span className="text-[#64748B] text-[10px] font-mono bg-[#121826] px-2 py-0.5 rounded-md border border-[#1E293B]">{s.ward}</span>
                  </div>
                  {s.status !== 'offline' && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#475569] text-[10px] font-mono">Live AQI</span>
                      <span style={{ color: TIER[aqiTier(s.aqi)].color, fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-bold">{s.aqi}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[#475569] text-[10px] font-mono w-12 shrink-0">Battery</span>
                    <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                      <div style={{ width: `${s.battery}%`, backgroundColor: bCol, boxShadow: `0 0 4px ${bCol}` }} className="h-full rounded-full" />
                    </div>
                    <span style={{ color: bCol, fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] w-8 text-right font-semibold">{s.battery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569] text-[10px] font-mono">Signal</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[#64748B] text-[10px]">{s.signal !== null ? `${s.signal} dBm` : 'No signal'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569] text-[10px] font-mono">Last seen</span>
                    <span style={{ color: ss.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-semibold">{s.lastSeen}</span>
                  </div>
                </div>
                <Btn variant={isPinged ? 'success' : s.status === 'offline' ? 'danger' : 'outline'} size="sm" full onClick={() => ping(s.id)} disabled={isPinged}>
                  {isPinged ? '✓ DIAGNOSTIC COMPLETE' : 'Ping Edge Node Diagnostic'}
                </Btn>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Model Lab ────────────────────────────────────────────────────────────────

function ModelsPage() {
  const [activeModel, setActiveModel] = useState<'xgb' | 'lstm'>('xgb')
  const [epochs, setEpochs] = useState(80)
  const [lr, setLr] = useState('0.001')
  const [depth, setDepth] = useState(6)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const runPipeline = () => {
    setRunning(true); setProgress(0)
    const iv = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(iv); setRunning(false); return 100 } return p + 4 })
    }, 80)
  }

  const ChartTipModel = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#121826] border border-[#1E293B] rounded-xl p-3 text-xs font-mono shadow-xl">
        <div className="text-[#475569] mb-1">Epoch {label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-4">
            <span>{p.name}</span><span className="font-bold">{p.value?.toFixed(2)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif" }} className="text-white font-semibold text-base">XAI Model Benchmarking & Hyperparameter Studio</div>
        <div className="text-[#475569] text-[10px] font-mono mt-1">Architecture evaluation · Live pipeline comparison · Training lab</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <SectionLabel className="mb-4">Architecture Selector</SectionLabel>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setActiveModel('xgb')}
                className={`flex items-center gap-4 p-4 rounded-[10px] border-2 transition-all cursor-pointer focus:outline-none active:scale-[0.98]
                  ${activeModel === 'xgb' ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_16px_#06b6d415]' : 'border-[#1E293B] bg-[#0D1422] hover:border-[#334155]'}`}>
                <span className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeModel === 'xgb' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-[#1A2236] text-[#475569]'}`}>⬠</span>
                <div className="text-left">
                  <div className="text-white text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Activate XGBoost Spatial Regressor</div>
                  <div className="text-[#64748B] text-xs mt-0.5">Gradient boosted trees · spatial feature matrix</div>
                </div>
                {activeModel === 'xgb' && <span className="ml-auto text-cyan-400 text-lg">✓</span>}
              </button>
              <button onClick={() => setActiveModel('lstm')}
                className={`flex items-center gap-4 p-4 rounded-[10px] border-2 transition-all cursor-pointer focus:outline-none active:scale-[0.98]
                  ${activeModel === 'lstm' ? 'border-[#7C3AED]/40 bg-[#7C3AED]/5 shadow-[0_0_16px_#7C3AED15]' : 'border-[#1E293B] bg-[#0D1422] hover:border-[#334155]'}`}>
                <span className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeModel === 'lstm' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'bg-[#1A2236] text-[#475569]'}`}>∿</span>
                <div className="text-left">
                  <div className="text-white text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Activate LSTM Recurrent Temporal Network</div>
                  <div className="text-[#64748B] text-xs mt-0.5">Sequential deep learning · temporal patterns</div>
                </div>
                {activeModel === 'lstm' && <span className="ml-auto text-[#7C3AED] text-lg">✓</span>}
              </button>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4 flex-1">
            <SectionLabel>Performance Comparison · RMSE Loss</SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MODEL_METRICS} margin={{ top: 4, right: 12, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="epoch" tick={{ fill: '#334155', fontSize: 9, fontFamily: "'JetBrains Mono'" }} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
                <YAxis tick={{ fill: '#334155', fontSize: 9, fontFamily: "'JetBrains Mono'" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTipModel />} />
                <Line type="monotone" dataKey="xgb" stroke="#06B6D4" strokeWidth={2} dot={false} name="XGBoost" />
                <Line type="monotone" dataKey="lstm" stroke="#7C3AED" strokeWidth={2} dot={false} name="LSTM" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'XGBoost RMSE', value: '4.05', color: '#06B6D4', bg: '#06B6D415', border: '#06B6D430' },
                { label: 'LSTM RMSE',    value: '4.60', color: '#7C3AED', bg: '#7C3AED15', border: '#7C3AED30' }].map((m) => (
                <div key={m.label} className="rounded-xl p-4 border" style={{ backgroundColor: m.bg, borderColor: m.border }}>
                  <div className="text-[#475569] text-[9px] font-mono mb-2">{m.label}</div>
                  <div style={{ color: m.color, fontFamily: "'JetBrains Mono', monospace" }} className="text-xl font-bold">RMSE {m.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — tuning */}
        <Card className="p-5 flex flex-col gap-5">
          <SectionLabel>Model Parameter Adjustment Deck</SectionLabel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider">Training Epochs</label>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-cyan-400 text-xl font-bold">{epochs}</span>
            </div>
            <div className="flex items-center gap-3">
              <Btn variant="outline" size="md" onClick={() => setEpochs((e) => Math.max(10, e - 10))}><span className="text-lg font-bold">−</span></Btn>
              <input type="range" min={10} max={500} step={10} value={epochs} onChange={(e) => setEpochs(Number(e.target.value))} className="flex-1" />
              <Btn variant="outline" size="md" onClick={() => setEpochs((e) => Math.min(500, e + 10))}><span className="text-lg font-bold">+</span></Btn>
            </div>
          </div>

          <Input label="Learning Rate (η)" value={lr} onChange={setLr} placeholder="e.g. 0.001" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[#64748B] text-[10px] font-mono uppercase tracking-wider">
                {activeModel === 'xgb' ? 'Max Tree Depth' : 'LSTM Hidden Units'}
              </label>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[#7C3AED] text-xl font-bold">
                {activeModel === 'xgb' ? depth : depth * 16}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Btn variant="outline" size="md" onClick={() => setDepth((d) => Math.max(1, d - 1))}><span className="text-lg font-bold">−</span></Btn>
              <input type="range" min={1} max={12} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="flex-1" />
              <Btn variant="outline" size="md" onClick={() => setDepth((d) => Math.min(12, d + 1))}><span className="text-lg font-bold">+</span></Btn>
            </div>
          </div>

          <div className="bg-[#0D1422] border border-[#1E293B] rounded-xl p-4 font-mono text-[10px] space-y-1.5">
            <div className="text-[#334155] uppercase tracking-wider mb-2">Active Configuration</div>
            <div><span className="text-[#475569]">model: </span><span className="text-cyan-400 font-semibold">{activeModel === 'xgb' ? 'xgboost_spatial' : 'lstm_temporal'}</span></div>
            <div><span className="text-[#475569]">epochs: </span><span className="text-[#10B981] font-semibold">{epochs}</span></div>
            <div><span className="text-[#475569]">learning_rate: </span><span className="text-[#10B981] font-semibold">{lr}</span></div>
            <div><span className="text-[#475569]">{activeModel === 'xgb' ? 'max_depth' : 'hidden_units'}: </span><span className="text-[#7C3AED] font-semibold">{activeModel === 'xgb' ? depth : depth * 16}</span></div>
          </div>

          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-[#64748B]">Training pipeline in progress...</span>
                <span className="text-cyan-400 font-semibold">{progress}%</span>
              </div>
              <div className="h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10B981' : '#06B6D4', boxShadow: `0 0 8px ${progress === 100 ? '#10B981' : '#06B6D4'}`, transition: 'width 0.1s linear' }} className="h-full rounded-full" />
              </div>
            </div>
          )}

          <Btn variant={running ? 'muted' : activeModel === 'xgb' ? 'primary' : 'violet'} size="xl" full onClick={runPipeline} disabled={running}>
            {running ? `⟳ TRAINING IN PROGRESS... ${progress}%` : '▶ RUN LIVE BACKEND RE-TRAINING PIPELINE'}
          </Btn>
        </Card>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [page, setPage] = useState<Page>('dashboard')
  const [briefOpen, setBriefOpen] = useState(false)

  const openBrief = () => setBriefOpen(true)
  const closeBrief = () => setBriefOpen(false)

  if (!authed) return (
    <>
      <AuthPage onLogin={() => setAuthed(true)} onBrief={openBrief} />
      {briefOpen && <FeatureBrief onClose={closeBrief} onDemo={() => setAuthed(true)} />}
    </>
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="flex h-screen bg-[#070A12] text-white overflow-hidden">
      {briefOpen && <FeatureBrief onClose={closeBrief} onDemo={() => { setPage('dashboard'); closeBrief() }} />}
      <Sidebar page={page} setPage={setPage} onLogout={() => setAuthed(false)} onBrief={openBrief} />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <Header page={page} onBrief={openBrief} />
        <div className="flex-1 overflow-hidden">
          {page === 'dashboard'   && <Dashboard />}
          {page === 'map'         && <MapPage />}
          {page === 'forecast'    && <ForecastPage />}
          {page === 'attribution' && <AttributionPage />}
          {page === 'alerts'      && <AlertsPage />}
          {page === 'sensors'     && <SensorsPage />}
          {page === 'models'      && <ModelsPage />}
        </div>
      </main>
    </div>
  )
}
