import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, DashboardLayout } from "./components/layout";
import { Dashboard } from "./pages/Dashboard";
import { Map as MapPage } from "./pages/Map";
import { Attribution } from "./pages/Attribution";
import { Forecast } from "./pages/Forecast";
import { Recommendations } from "./pages/Recommendations";
import { Alerts } from "./pages/Alerts";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";

/* ═══════════════════════════════════════════════════════════
 * APP ROOT
 * Wraps authenticated routes in the DashboardLayout shell.
 * Login page renders without the dashboard chrome.
 * ═══════════════════════════════════════════════════════════ */

export const App: React.FC = () => {
  const isLoginPage = window.location.pathname === "/login";

  // Login page — no dashboard layout
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Dashboard routes — wrapped in layout shell
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/source-attribution" element={<Attribution />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </SidebarProvider>
  );
};
