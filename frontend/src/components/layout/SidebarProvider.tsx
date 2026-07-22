import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/* ═══════════════════════════════════════════════════════════
 * SIDEBAR CONTEXT
 * Manages sidebar expanded/collapsed/mobile-open state.
 * Consumed by Sidebar, Topbar (mobile toggle), and DashboardLayout.
 * ═══════════════════════════════════════════════════════════ */

interface SidebarContextValue {
  /** Whether the desktop sidebar is expanded (true) or collapsed (false). */
  expanded: boolean;
  /** Toggle desktop sidebar between expanded/collapsed. */
  toggleExpanded: () => void;
  /** Explicitly set the expanded state. */
  setExpanded: (val: boolean) => void;

  /** Whether the mobile sidebar drawer is currently open. */
  mobileOpen: boolean;
  /** Toggle the mobile sidebar drawer. */
  toggleMobileOpen: () => void;
  /** Close the mobile sidebar drawer. */
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Hook to access sidebar state from any descendant component.
 */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a <SidebarProvider>");
  }
  return ctx;
}

interface SidebarProviderProps {
  children: ReactNode;
  /** Initial expanded state for desktop. Defaults to true. */
  defaultExpanded?: boolean;
}

/**
 * Provider that wraps the dashboard layout tree.
 * Handles persistence of sidebar preference via localStorage.
 */
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultExpanded = true,
}) => {
  const [expanded, setExpandedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("airsight-sidebar-expanded");
      return stored !== null ? stored === "true" : defaultExpanded;
    } catch {
      return defaultExpanded;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const setExpanded = useCallback((val: boolean) => {
    setExpandedState(val);
    try {
      localStorage.setItem("airsight-sidebar-expanded", String(val));
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  const toggleMobileOpen = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close mobile drawer on route change (resize past breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        toggleExpanded,
        setExpanded,
        mobileOpen,
        toggleMobileOpen,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
