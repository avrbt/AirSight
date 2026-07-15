import React from 'react';
import { useStore } from '../store/useStore';
import { Shield, Users, Radio, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { mockForecast } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const { wards, setSelectedWard } = useStore();
  const activeAlerts = wards.filter(w => w.aqi > 200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Mumbai Air Quality Dashboard</h1>
        <p className="text-xs text-[#A8B8D0] mt-1">Real-time geospatial intelligence, source attribution, and policy forecasting.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">City Average AQI</span>
            <p className="text-3xl font-mono font-bold text-[#FFB020] mt-1">178</p>
            <p className="text-xs text-[#A8B8D0] mt-1">Moderate · Last updated 2m ago</p>
          </div>
          <div className="w-10 h-10 rounded bg-[#FFB020]/10 flex items-center justify-center text-[#FFB020]">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Critical Area</span>
            <p className="text-3xl font-mono font-bold text-[#E63946] mt-1">Chembur</p>
            <p className="text-xs text-[#A8B8D0] mt-1">AQI 312 · Very Poor</p>
          </div>
          <div className="w-10 h-10 rounded bg-[#E63946]/10 flex items-center justify-center text-[#E63946]">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Exposed Population</span>
            <p className="text-3xl font-mono font-bold text-[#FF6B35] mt-1">5.3 Lakh</p>
            <p className="text-xs text-[#A8B8D0] mt-1">Living in Poor/Severe zones</p>
          </div>
          <div className="w-10 h-10 rounded bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Active Alerts</span>
            <p className="text-3xl font-mono font-bold text-red-500 mt-1">{activeAlerts.length}</p>
            <p className="text-xs text-[#A8B8D0] mt-1">Requires emergency GRAP action</p>
          </div>
          <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main forecast charts & tables layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-bold text-white text-sm">72-Hour AQI Trend Forecast</h3>
            <p className="text-xs text-[#A8B8D0] mt-0.5">Probabilistic confidence bands modeling PM2.5 concentrations.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockForecast}>
                <XAxis dataKey="time" stroke="#6B7FA3" fontSize={10} />
                <YAxis stroke="#6B7FA3" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1A2333', borderColor: '#2E3D56' }} />
                <Area type="monotone" dataKey="p50" stroke="#0070F3" fill="rgba(0,112,243,0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right table sidebar listing wards */}
        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-white text-sm">Ward Severity Rankings</h3>
            <p className="text-xs text-[#A8B8D0] mt-0.5">Click a ward to investigate source attribution.</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {wards.map((w) => (
              <div 
                key={w.id} 
                onClick={() => setSelectedWard(w)}
                className="p-3 bg-[#121824] hover:bg-[#232F45] rounded border border-[#2E3D56] cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-white">{w.name}</span>
                  <p className="text-[10px] text-[#A8B8D0] mt-0.5">Pop: {w.population} · {w.dominantPollutant}</p>
                </div>
                <span className={`font-mono text-sm font-bold ${
                  w.aqi > 300 ? 'text-[#9B1FCA]' :
                  w.aqi > 200 ? 'text-[#E63946]' :
                  w.aqi > 100 ? 'text-[#FFB020]' : 'text-[#00D97E]'
                }`}>{w.aqi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
