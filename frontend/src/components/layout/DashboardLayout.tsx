import React, { type ReactNode } from "react";
import { Sidebar, MobileNav } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";

/* ═══════════════════════════════════════════════════════════
 * DASHBOARD LAYOUT
 * Top-level shell that composes sidebar, topbar, main content,
 * and footer into the standard AirSight dashboard structure.
 *
 * Layout structure:
 * ┌──────────────────────────────────────────────────────────┐
 * │ SIDEBAR │ TOPBAR                                         │
 * │         ├────────────────────────────────────────────────┤
 * │         │ MAIN CONTENT (scrollable)                      │
 * │         │                                                │
 * │         │                                                │
 * │         ├────────────────────────────────────────────────┤
 * │         │ FOOTER (status bar)                            │
 * └──────────────────────────────────────────────────────────┘
 *
 * On mobile (< lg):
 * - Sidebar is hidden, replaced by MobileNav overlay
 * - Topbar shows hamburger toggle
 * ═══════════════════════════════════════════════════════════ */

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-canvas-surface overflow-hidden">
      {/* ── Desktop Sidebar ────────────────────────── */}
      <Sidebar />

      {/* ── Mobile Navigation Overlay ──────────────── */}
      <MobileNav />

      {/* ── Main area (right of sidebar) ───────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <Topbar />

        {/* Scrollable content area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>

        {/* Status bar footer */}
        <Footer />
      </div>
    </div>
  );
};
