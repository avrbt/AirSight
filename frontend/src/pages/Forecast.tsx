import React from 'react';
import { useStore } from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { mockForecast } from '../utils/mockData';
import { Clock } from 'lucide-react';

export const Forecast: React.FC = () => {
  const { selectedWard } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">72-Hour AQI Forecasting</h1>
        <p className="text-xs text-[#A8B8D0] mt-1">Probabilistic predictions with confidence boundaries modeled via deep LSTM neural networks.</p>
      </div>

      <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#2E3D56] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Active Focus Ward: {selectedWard?.name || "Select Ward"}</h2>
            <p className="text-xs text-[#A8B8D0] mt-0.5">Confidence intervals denote 10% and 90% probability thresholds.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A8B8D0] bg-[#121824] px-3 py-1.5 rounded border border-[#2E3D56]">
            <Clock className="w-3.5 h-3.5" />
            <span>Model: LSTM-v1.4.1</span>
          </div>
        </div>

        {/* Main Forecast Area Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockForecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3D56" />
              <XAxis dataKey="time" stroke="#6B7FA3" fontSize={11} />
              <YAxis stroke="#6B7FA3" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1A2333', borderColor: '#2E3D56' }} />
              <Area type="monotone" dataKey="p90" stackId="1" stroke="none" fill="rgba(255, 176, 32, 0.05)" />
              <Area type="monotone" dataKey="p50" stackId="2" stroke="#FFB020" fill="rgba(255, 176, 32, 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="p10" stackId="3" stroke="none" fill="rgba(255, 176, 32, 0.05)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#121824] p-4 rounded border border-[#2E3D56] space-y-1">
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">24-Hour Peak Forecast</span>
            <p className="text-2xl font-mono font-bold text-[#FFB020]">212 AQI</p>
            <p className="text-xs text-[#A8B8D0]">Expected tomorrow at 08:30 AM</p>
          </div>
          <div className="bg-[#121824] p-4 rounded border border-[#2E3D56] space-y-1">
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Met Wind Alignment</span>
            <p className="text-2xl font-mono font-bold text-[#00D97E]">SW 12 m/s</p>
            <p className="text-xs text-[#A8B8D0]">Assists in dispersing pollutants later</p>
          </div>
          <div className="bg-[#121824] p-4 rounded border border-[#2E3D56] space-y-1">
            <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Model Status</span>
            <p className="text-2xl font-mono font-bold text-blue-400">92.4%</p>
            <p className="text-xs text-[#A8B8D0]">Confidence margin based on last 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};
