import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Map as MapPage } from './pages/Map';
import { Attribution } from './pages/Attribution';
import { Forecast } from './pages/Forecast';
import { Recommendations } from './pages/Recommendations';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { WardDetailDrawer } from './components/WardDetailDrawer';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { selectedWard, setSelectedWard } = useStore();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-[#121824] overflow-hidden">
      {/* Sidebar Nav */}
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar info */}
        <Topbar />

        {/* Content workspace split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Active view component */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#121824]">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/attribution" element={<Attribution />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Collapsible details Drawer */}
          {selectedWard && (
            <WardDetailDrawer 
              ward={selectedWard} 
              onClose={() => setSelectedWard(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
