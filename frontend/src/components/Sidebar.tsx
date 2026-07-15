import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  LineChart, 
  PieChart, 
  Bell, 
  BrainCircuit,
  BarChart3, 
  Settings,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  setExpanded: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/map", label: "Live AQI Map", icon: MapIcon },
    { to: "/attribution", label: "Attribution", icon: PieChart },
    { to: "/forecast", label: "Forecast", icon: LineChart },
    { to: "/recommendations", label: "AI Advisory", icon: BrainCircuit },
    { to: "/alerts", label: "Alerts Center", icon: Bell },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside 
      className={`bg-[#1A2333] border-r border-[#2E3D56] flex flex-col transition-all duration-300 ${
        expanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-[#2E3D56] justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          {expanded && (
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              AIRSIGHT
            </span>
          )}
        </div>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-[#A8B8D0] hover:text-white p-1 rounded hover:bg-[#232F45] transition-colors"
        >
          {expanded ? "◀" : "▶"}
        </button>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 pl-2.5'
                    : 'text-[#A8B8D0] hover:bg-[#232F45] hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {expanded && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Identity panel */}
      <div className="p-3 border-t border-[#2E3D56] flex items-center gap-3 overflow-hidden bg-[#121824]/50">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/10">
          PS
        </div>
        {expanded && (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Priya Sharma</p>
            <p className="text-[10px] text-[#A8B8D0] truncate">District Collector</p>
          </div>
        )}
      </div>
    </aside>
  );
};
