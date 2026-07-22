import React, { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { icons, iconSize } from "@/lib/icons";

/* ═══════════════════════════════════════════════════════════
 * STATUS BAR (FOOTER)
 * Persistent bottom bar showing system health indicators:
 * ingestion status, active API connections, DB health,
 * and last data refresh timestamp.
 * ═══════════════════════════════════════════════════════════ */

interface StatusItem {
  id: string;
  label: string;
  status: "online" | "degraded" | "offline";
  detail?: string;
}

const systemStatuses: StatusItem[] = [
  { id: "cpcb",  label: "CPCB API",     status: "online",  detail: "v2.1" },
  { id: "imd",   label: "IMD Weather",  status: "online",  detail: "Live" },
  { id: "db",    label: "TimescaleDB",  status: "online",  detail: "3.2ms" },
  { id: "ml",    label: "ML Pipeline",  status: "online",  detail: "GPU" },
];

const statusConfig = {
  online:   { dot: "bg-signal-success",  text: "text-signal-success", label: "Online" },
  degraded: { dot: "bg-signal-warning",  text: "text-signal-warning", label: "Degraded" },
  offline:  { dot: "bg-signal-danger",   text: "text-signal-danger",  label: "Offline" },
} as const;


export const Footer: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulated periodic refresh timestamp
  useEffect(() => {
    const timer = setInterval(() => setLastRefresh(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const refreshTime = useMemo(() => {
    return lastRefresh.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, [lastRefresh]);

  return (
    <footer
      className={cn(
        "h-statusbar flex-shrink-0",
        "bg-canvas-deep/80 backdrop-blur-sm",
        "border-t border-border",
        "px-4 lg:px-6",
        "flex items-center justify-between gap-4",
        "text-overline text-text-tertiary"
      )}
    >
      {/* ── Left: System statuses ──────────────────── */}
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
        {systemStatuses.map((item) => {
          const config = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center gap-1.5 whitespace-nowrap"
              title={`${item.label}: ${config.label}`}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
              <span className="hidden sm:inline">{item.label}</span>
              {item.detail && (
                <span className={cn("hidden md:inline tabular-nums", config.text)}>
                  {item.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Right: Last refresh & version ──────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <icons.action.refresh className={cn(iconSize.xs, "text-text-disabled")} />
          <span className="tabular-nums">{refreshTime}</span>
        </div>

        <div className="w-px h-3 bg-border hidden sm:block" />

        <span className="hidden md:inline tabular-nums">v0.1.0</span>
      </div>
    </footer>
  );
};
