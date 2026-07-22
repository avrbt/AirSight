import React, { useMemo, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { icons, iconSize } from "@/lib/icons";
import { useSidebar } from "./SidebarProvider";
import { Breadcrumb } from "./Breadcrumb";
import { getStoredTheme, applyTheme, Theme } from "@/lib/theme";

/* ═══════════════════════════════════════════════════════════
 * TOP NAVBAR
 * Sticky bar above the main content area.
 * Contains: mobile toggle, breadcrumbs, search, theme toggle,
 * city selector, notifications dropdown, and user profile.
 * ═══════════════════════════════════════════════════════════ */

const CITIES = [
  { id: "mumbai", label: "Mumbai Metropolitan" },
  { id: "delhi", label: "Delhi NCR" },
  { id: "bangalore", label: "Bengaluru City" },
  { id: "kolkata", label: "Kolkata Region" },
];

export const Topbar: React.FC = () => {
  const { toggleMobileOpen } = useSidebar();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getStoredTheme());
  
  // City selector state
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  
  // Profile state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (cityRef.current && !cityRef.current.contains(target)) {
        setCityDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }) + ", " + currentTime.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [currentTime]);

  const toggleTheme = () => {
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header
      className={cn(
        "h-topbar flex-shrink-0 sticky top-0 z-topbar",
        "bg-canvas-card/95 backdrop-blur-md",
        "border-b border-border",
        "px-4 lg:px-6",
        "flex items-center gap-3 justify-between"
      )}
    >
      {/* ── Left section: Menu toggle & Context ──────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-menu-toggle"
          onClick={toggleMobileOpen}
          aria-label="Open navigation menu"
          className="lg:hidden p-1.5 -ml-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors focus-ring"
        >
          <icons.action.more className={iconSize.md} />
        </button>

        <Breadcrumb />
      </div>

      {/* ── Right section: Actions & Profile ────────── */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* City Selector */}
        <div className="relative" ref={cityRef}>
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-canvas-surface border border-border text-caption text-text-secondary hover:text-text-primary transition-colors focus-ring"
          >
            <icons.data.pin className={cn(iconSize.xs, "text-brand")} />
            <span className="max-w-[80px] sm:max-w-[120px] truncate">{selectedCity.label}</span>
            <icons.direction.chevronDown className="w-3 h-3 text-text-tertiary" />
          </button>
          
          {cityDropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-canvas-elevated shadow-elevation-3 py-1 z-dropdown animate-scale-in">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-caption transition-colors hover:bg-canvas-surface",
                    city.id === selectedCity.id ? "text-brand font-medium" : "text-text-secondary"
                  )}
                >
                  {city.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Input */}
        <div className="hidden md:block relative">
          <icons.action.search className={cn(iconSize.sm, "text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none")} />
          <input
            id="global-search"
            type="text"
            placeholder="Search wards, sensors..."
            className={cn(
              "w-44 lg:w-56 bg-canvas-surface border border-border rounded-lg",
              "pl-9 pr-4 py-1.5",
              "text-caption text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30",
              "transition-colors duration-fast"
            )}
          />
        </div>

        {/* Mobile Search Button */}
        <button
          aria-label="Search"
          className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors focus-ring"
        >
          <icons.action.search className={iconSize.md} />
        </button>

        {/* Live sync */}
        <div className="hidden lg:flex items-center gap-1.5 text-caption text-signal-success px-2.5 py-1.5 rounded-lg bg-signal-success/8 border border-signal-success/15">
          <span className="status-dot-live" />
          <span className="font-medium">Live</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors focus-ring"
        >
          {currentTheme === "dark" ? (
            <icons.environment.sun className={iconSize.md} />
          ) : (
            <icons.environment.leaf className={iconSize.md} />
          )}
        </button>

        {/* Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-caption text-text-secondary bg-canvas-surface px-2.5 py-1.5 rounded-lg border border-border">
          <icons.status.clock className={iconSize.xs} />
          <span className="tabular-nums whitespace-nowrap">{formattedTime}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            aria-label="Notifications"
            className="relative p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors focus-ring"
          >
            <icons.nav.alerts className={iconSize.md} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-signal-danger rounded-full ring-2 ring-canvas-card animate-pulse" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-1 w-72 rounded-lg border border-border bg-canvas-elevated shadow-elevation-3 py-2 z-dropdown animate-scale-in">
              <div className="px-3 pb-2 border-b border-border flex justify-between items-center">
                <span className="font-semibold text-text-primary text-caption">Active Alerts</span>
                <span className="text-[10px] text-brand hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                <div className="px-3 py-2 border-b border-border/50 hover:bg-canvas-surface cursor-pointer transition-colors">
                  <div className="flex justify-between">
                    <span className="text-caption font-medium text-signal-danger">GRAP Stage III Active</span>
                    <span className="text-[9px] text-text-tertiary">Just now</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">Severe AQI triggers construction moratoriums in Zone 3.</p>
                </div>
                <div className="px-3 py-2 hover:bg-canvas-surface cursor-pointer transition-colors">
                  <div className="flex justify-between">
                    <span className="text-caption font-medium text-signal-warning">MIDC Sensor Spike</span>
                    <span className="text-[9px] text-text-tertiary">10m ago</span>
                  </div>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-snug">Station 12 reports industrial PM10 exceeds 350 μg/m³.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-canvas-elevated transition-colors focus-ring"
          >
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-caption font-bold text-white shadow-elevation-1">
              PS
            </div>
          </button>
          
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-canvas-elevated shadow-elevation-3 py-1.5 z-dropdown animate-scale-in">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-caption font-semibold text-text-primary truncate">Priya Sharma</p>
                <p className="text-[10px] text-text-tertiary truncate">District Collector</p>
              </div>
              <button className="w-full text-left px-3 py-2 text-caption text-text-secondary hover:text-text-primary hover:bg-canvas-surface transition-colors flex items-center gap-2">
                <icons.system.user className="w-3.5 h-3.5" /> Profile Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-caption text-text-secondary hover:text-text-primary hover:bg-canvas-surface transition-colors flex items-center gap-2">
                <icons.system.lock className="w-3.5 h-3.5" /> Security Logs
              </button>
              <div className="border-t border-border mt-1.5 pt-1">
                <button className="w-full text-left px-3 py-2 text-caption text-signal-danger hover:bg-canvas-surface transition-colors flex items-center gap-2">
                  <icons.system.logout className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
