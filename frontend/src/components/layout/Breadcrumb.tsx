import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { icons, iconSize } from "@/lib/icons";

/* ═══════════════════════════════════════════════════════════
 * BREADCRUMB
 * Auto-generates breadcrumb trail from the current route.
 * Supports custom label overrides via the routeLabels map.
 * ═══════════════════════════════════════════════════════════ */

/** Human-readable labels for route segments. */
const routeLabels: Record<string, string> = {
  dashboard:       "Overview",
  map:             "Live AQI Map",
  "source-attribution": "Source Attribution",
  forecast:        "72-Hour Forecast",
  recommendations: "AI Advisory",
  alerts:          "Alerts Center",
  analytics:       "Historical Analytics",
  settings:        "Settings",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const crumbs = useMemo<BreadcrumbItem[]>(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    if (segments.length === 0) return [];

    return segments.map((segment, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label =
        routeLabels[segment] ??
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      return {
        label,
        href,
        isLast: i === segments.length - 1,
      };
    });
  }, [location.pathname]);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 min-w-0">
      {/* Region label — always visible */}
      <span className="hidden sm:inline text-caption text-text-tertiary whitespace-nowrap">
        Mumbai Municipal Region
      </span>

      {crumbs.length > 0 && (
        <icons.direction.chevronRight
          className={cn(iconSize.xs, "text-text-disabled flex-shrink-0 hidden sm:block")}
        />
      )}

      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.href}>
          {i > 0 && (
            <icons.direction.chevronRight
              className={cn(iconSize.xs, "text-text-disabled flex-shrink-0")}
            />
          )}

          {crumb.isLast ? (
            <span
              className="text-body-sm font-medium text-text-primary truncate"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href}
              className="text-body-sm text-text-secondary hover:text-text-primary transition-colors truncate"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Static route labels map — can be imported by other components
 * to get human-readable page names.
 */
export { routeLabels };
