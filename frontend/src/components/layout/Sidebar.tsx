import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { icons, iconSize } from "@/lib/icons";
import { useSidebar } from "./SidebarProvider";
import type { LucideIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
 * NAVIGATION ITEMS
 * ═══════════════════════════════════════════════════════════ */

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const primaryNav: NavItem[] = [
  { to: "/dashboard",          label: "Dashboard",          icon: icons.nav.dashboard },
  { to: "/map",                label: "Live AQI Map",       icon: icons.nav.map },
  { to: "/forecast",           label: "Forecast",           icon: icons.nav.forecast },
  { to: "/source-attribution",  label: "Source Attribution", icon: icons.nav.attribution },
  { to: "/alerts",             label: "Alerts",             icon: icons.nav.alerts },
  { to: "/analytics",          label: "Analytics",          icon: icons.nav.analytics },
];

const secondaryNav: NavItem[] = [
  { to: "/settings",           label: "Settings",           icon: icons.nav.settings },
];


/* ═══════════════════════════════════════════════════════════
 * SIDEBAR COMPONENT
 * Desktop: fixed left rail, collapsible 64px↔240px
 * Mobile: hidden (rendered as overlay via MobileNav)
 * ═══════════════════════════════════════════════════════════ */

export const Sidebar: React.FC = () => {
  const { expanded, toggleExpanded } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col flex-shrink-0",
        "bg-canvas-card border-r border-border",
        "transition-[width] duration-300 ease-smooth",
        "h-screen sticky top-0 z-sidebar",
        expanded ? "w-sidebar-expanded" : "w-sidebar-collapsed"
      )}
    >
      {/* ── Brand Header ─────────────────────────────── */}
      <div className="h-topbar flex items-center px-4 border-b border-border justify-between overflow-hidden flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0 shadow-glow-brand">
            <icons.brand.logo className={cn(iconSize.md, "text-white")} />
          </div>
          <span
            className={cn(
              "font-bold text-body tracking-widest text-gradient-brand whitespace-nowrap",
              "transition-all duration-300",
              expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            AIRSIGHT
          </span>
        </div>

        <button
          id="sidebar-toggle"
          onClick={toggleExpanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "p-1.5 rounded-md text-text-secondary",
            "hover:text-text-primary hover:bg-canvas-elevated",
            "transition-colors duration-fast focus-ring",
            expanded ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
          )}
        >
          <icons.direction.chevronLeft
            className={cn(
              iconSize.sm,
              "transition-transform duration-300",
              !expanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* ── Primary Navigation ────────────────────────── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        <NavGroup items={primaryNav} expanded={expanded} />
      </nav>

      {/* ── Secondary Navigation ──────────────────────── */}
      <div className="px-2 pb-2 space-y-0.5">
        <NavGroup items={secondaryNav} expanded={expanded} />
      </div>

      {/* ── User Identity Panel ───────────────────────── */}
      <UserPanel expanded={expanded} />
    </aside>
  );
};


/* ═══════════════════════════════════════════════════════════
 * NAV LINK ITEM
 * ═══════════════════════════════════════════════════════════ */

interface NavGroupProps {
  items: NavItem[];
  expanded: boolean;
  onNavigate?: () => void;
}

const NavGroup: React.FC<NavGroupProps> = ({ items, expanded, onNavigate }) => (
  <>
    {items.map((item) => (
      <SidebarNavLink
        key={item.to}
        item={item}
        expanded={expanded}
        onNavigate={onNavigate}
      />
    ))}
  </>
);

interface SidebarNavLinkProps {
  item: NavItem;
  expanded: boolean;
  onNavigate?: () => void;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({ item, expanded, onNavigate }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg text-body-sm font-medium",
          "transition-all duration-fast no-select",
          expanded ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
          isActive
            ? "bg-brand/10 text-brand"
            : "text-text-secondary hover:bg-canvas-elevated hover:text-text-primary"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
          )}

          <Icon className={cn(iconSize.md, "flex-shrink-0")} />

          {expanded && (
            <span className="truncate">{item.label}</span>
          )}

          {/* Badge */}
          {expanded && item.badge !== undefined && item.badge > 0 && (
            <span className="ml-auto flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-signal-danger text-white text-caption font-semibold">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}

          {/* Collapsed tooltip */}
          {!expanded && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-md bg-canvas-elevated text-text-primary text-caption font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-fast shadow-elevation-3 z-tooltip pointer-events-none">
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};


/* ═══════════════════════════════════════════════════════════
 * USER PANEL (bottom of sidebar)
 * ═══════════════════════════════════════════════════════════ */

interface UserPanelProps {
  expanded: boolean;
}

const UserPanel: React.FC<UserPanelProps> = ({ expanded }) => (
  <div className="flex-shrink-0 p-3 border-t border-border flex items-center gap-3 overflow-hidden bg-canvas-surface/50">
    <div className="w-8 h-8 rounded-full bg-brand flex-shrink-0 flex items-center justify-center text-caption font-bold text-white shadow-elevation-1">
      PS
    </div>
    {expanded && (
      <div className="min-w-0 flex-1">
        <p className="text-caption font-semibold text-text-primary truncate">
          Priya Sharma
        </p>
        <p className="text-overline text-text-tertiary truncate">
          District Collector
        </p>
      </div>
    )}
    {expanded && (
      <button
        aria-label="Log out"
        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-canvas-elevated transition-colors duration-fast focus-ring"
      >
        <icons.system.logout className={iconSize.sm} />
      </button>
    )}
  </div>
);


/* ═══════════════════════════════════════════════════════════
 * MOBILE NAVIGATION OVERLAY
 * Sheet-style drawer for < lg breakpoints
 * ═══════════════════════════════════════════════════════════ */

export const MobileNav: React.FC = () => {
  const { mobileOpen, closeMobile } = useSidebar();

  if (!mobileOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
        onClick={closeMobile}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-modal w-72",
          "bg-canvas-card border-r border-border",
          "flex flex-col lg:hidden",
          "animate-slide-in-left"
        )}
      >
        {/* Header */}
        <div className="h-topbar flex items-center px-4 border-b border-border justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-glow-brand">
              <icons.brand.logo className={cn(iconSize.md, "text-white")} />
            </div>
            <span className="font-bold text-body tracking-widest text-gradient-brand">
              AIRSIGHT
            </span>
          </div>
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors focus-ring"
          >
            <icons.action.close className={iconSize.md} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-none">
          <NavGroup items={primaryNav} expanded={true} onNavigate={closeMobile} />
        </nav>

        {/* Secondary */}
        <div className="px-2 pb-2 space-y-0.5">
          <NavGroup items={secondaryNav} expanded={true} onNavigate={closeMobile} />
        </div>

        {/* User */}
        <UserPanel expanded={true} />
      </aside>
    </>
  );
};


/* ═══════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════ */

export { primaryNav, secondaryNav };
export type { NavItem };
