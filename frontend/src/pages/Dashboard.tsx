import React, { useMemo } from "react";
import { useStore } from "@/store/useStore";
import { icons, iconSize } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { getAqiLevel } from "@/lib/theme";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockForecast, mockAttribution } from "@/utils/mockData";
import { rechartsTheme } from "@/lib/design-tokens";

/* ═══════════════════════════════════════════════════════════
 * REUSABLE KPI CARD COMPONENT
 * ═══════════════════════════════════════════════════════════ */

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  accentClass?: string;
  bgColorClass?: string;
  glowClass?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  icon,
  accentClass = "text-brand",
  bgColorClass = "bg-brand/10",
  glowClass,
}) => {
  return (
    <Card className={cn("transition-all duration-normal hover:shadow-card-hover border-border relative overflow-hidden", glowClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-overline font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", bgColorClass, accentClass)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-mono font-bold text-text-primary tracking-tight tabular-nums">
          {value}
        </div>
        <p className="text-caption text-text-secondary mt-1.5 truncate">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════
 * MAIN DASHBOARD PAGE
 * ═══════════════════════════════════════════════════════════ */

export const Dashboard: React.FC = () => {
  const { wards = [] } = useStore();

  const activeAlerts = wards.filter((w) => w.aqi > 200);
  const highRiskWards =
    wards
      .filter((w) => w.aqi > 200)
      .map((w) => w.name)
      .join(", ") || "None";

  // Calculate current average AQI dynamically from store wards
  const avgAqiVal = useMemo(() => {
    if (wards.length === 0) return 178;
    return Math.round(wards.reduce((acc, w) => acc + w.aqi, 0) / wards.length);
  }, [wards]);

  const aqiLevel = getAqiLevel(avgAqiVal);

  // Format dataset for Donut chart
  const attributionData = Object.entries(mockAttribution).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const ATTRIBUTION_COLORS = ["#FF6B35", "#3B9EFF", "#FFB020", "#E63946", "#A8B8D0"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-display text-text-primary flex items-center gap-2.5">
          <icons.status.live className="w-7 h-7 text-brand animate-pulse" />
          Dashboard Home
        </h1>
        <p className="text-body-sm text-text-secondary mt-1.5">
          Real-time geospatial analytics, source attribution fingerprinting, and 72-hour forecasting modules.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* KPI 1: Current Avg AQI */}
        <KpiCard
          title="Current Avg AQI"
          value={avgAqiVal}
          description={`${aqiLevel.charAt(0).toUpperCase() + aqiLevel.slice(1)} · Updated 2m ago`}
          icon={<icons.environment.gauge className={iconSize.md} />}
          accentClass={cn(
            avgAqiVal <= 50 ? "text-aqi-good" :
            avgAqiVal <= 100 ? "text-aqi-satisfactory" :
            avgAqiVal <= 200 ? "text-aqi-moderate" :
            avgAqiVal <= 300 ? "text-aqi-poor" :
            avgAqiVal <= 400 ? "text-aqi-verypoor" : "text-aqi-severe"
          )}
          bgColorClass={cn(
            avgAqiVal <= 50 ? "bg-aqi-good/10" :
            avgAqiVal <= 100 ? "bg-aqi-satisfactory/10" :
            avgAqiVal <= 200 ? "bg-aqi-moderate/10" :
            avgAqiVal <= 300 ? "bg-aqi-poor/10" :
            avgAqiVal <= 400 ? "bg-aqi-verypoor/10" : "bg-aqi-severe/10"
          )}
          glowClass={cn(
            avgAqiVal <= 50 ? "shadow-glow-good" :
            avgAqiVal <= 100 ? "shadow-glow-good" :
            avgAqiVal <= 200 ? "shadow-glow-moderate" :
            avgAqiVal <= 300 ? "shadow-glow-poor" :
            avgAqiVal <= 400 ? "shadow-glow-verypoor" : "shadow-glow-severe"
          )}
        />

        {/* KPI 2: High Risk Wards */}
        <KpiCard
          title="High Risk Wards"
          value={activeAlerts.length}
          description={`Wards: ${highRiskWards}`}
          icon={<icons.brand.logo className={iconSize.md} />}
          accentClass="text-signal-danger"
          bgColorClass="bg-signal-danger/10"
          glowClass={activeAlerts.length > 0 ? "shadow-glow-verypoor" : undefined}
        />

        {/* KPI 3: Active Alerts */}
        <KpiCard
          title="Active Alerts"
          value={activeAlerts.length}
          description="Requires emergency GRAP checks"
          icon={<icons.status.warning className={iconSize.md} />}
          accentClass="text-signal-warning"
          bgColorClass="bg-signal-warning/10"
          glowClass={activeAlerts.length > 0 ? "shadow-glow-moderate" : undefined}
        />

        {/* KPI 4: Prediction Accuracy */}
        <KpiCard
          title="Prediction Accuracy"
          value="94.2%"
          description="Model calibration baseline"
          icon={<icons.data.target className={iconSize.md} />}
          accentClass="text-signal-success"
          bgColorClass="bg-signal-success/10"
          glowClass="shadow-glow-good"
        />
      </div>

      {/* Secondary layout: Charts & Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        
        {/* Trend Area Chart (Recharts) */}
        <Card className="lg:col-span-2 border-border p-6 space-y-4">
          <div>
            <CardTitle className="text-h3 text-text-primary flex items-center gap-2">
              <icons.trend.up className={cn(iconSize.md, "text-brand")} />
              72-Hour AQI Trend Forecast
            </CardTitle>
            <CardDescription className="text-caption text-text-secondary mt-1">
              PM2.5 confidence dispersion forecast using deep learning LSTM models.
            </CardDescription>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray={rechartsTheme.grid.strokeDasharray} stroke={rechartsTheme.grid.stroke} opacity={rechartsTheme.grid.strokeOpacity} />
                <XAxis dataKey="time" {...rechartsTheme.axis} />
                <YAxis {...rechartsTheme.axis} />
                <Tooltip contentStyle={rechartsTheme.tooltip} />
                <Area type="monotone" dataKey="p50" stroke="#0070F3" fill="rgba(0,112,243,0.08)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pollution Source Attribution Donut Chart */}
        <Card className="border-border p-6 flex flex-col space-y-4">
          <div>
            <CardTitle className="text-h3 text-text-primary">Source Attribution Breakdown</CardTitle>
            <CardDescription className="text-caption text-text-secondary mt-1">
              XGBoost fingerprints of municipal pollution emissions.
            </CardDescription>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ATTRIBUTION_COLORS[index % ATTRIBUTION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={rechartsTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-4 border-t border-border">
            {attributionData.map((d, index) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ATTRIBUTION_COLORS[index % ATTRIBUTION_COLORS.length] }}></div>
                <span className="capitalize text-text-secondary truncate">{d.name}</span>
                <span className="font-mono text-text-primary font-bold ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Recommendations Card */}
        <Card className="lg:col-span-3 bg-brand/5 border-brand/20 p-6 space-y-4 shadow-glow-brand">
          <div className="flex items-center gap-2 text-brand">
            <icons.nav.recommendations className="w-5 h-5 animate-pulse" />
            <CardTitle className="text-overline font-bold uppercase tracking-wider">AI Policy Recommendations & GRAP Triggers</CardTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-canvas-surface p-4 rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-2 text-signal-success">
                <icons.status.success className="w-4 h-4" />
                <span className="text-caption font-semibold">Active Recommendation: Construction Moratorium</span>
              </div>
              <p className="text-caption text-text-secondary leading-relaxed">
                Industrial output emissions from MIDC cluster zones represent 42.1% of local AQI spikes. Wind vectors moving SW align emissions towards residential areas. Moratoriums on construction sites &gt; 500 sqm recommended.
              </p>
            </div>
            <div className="bg-canvas-surface p-4 rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-2 text-signal-warning">
                <icons.data.file className="w-4 h-4" />
                <span className="text-caption font-semibold">Policy Brief Projections</span>
              </div>
              <p className="text-caption text-text-secondary leading-relaxed">
                Implementing vehicle restrictions and traffic diversions on Central Ward arterial routes between 08:00 AM and 11:30 AM is estimated to reduce PM2.5 counts by 18% over the next 24 hours.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
