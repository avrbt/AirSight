import React from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const Alerts: React.FC = () => {
  const { wards } = useStore();
  const alerts = wards.filter(w => w.aqi > 200);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Alerts & GRAP Triggers</h1>
          <p className="text-xs text-[#A8B8D0] mt-1">Real-time alerts triggered by AQI threshold crossings.</p>
        </div>
      </div>

      <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Active Graded Response Action Plan (GRAP) Alerts</h3>
        <div className="space-y-3">
          {alerts.map((w) => (
            <div key={w.id} className="p-4 bg-[#121824] border-l-4 border-red-500 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{w.name} Ward Spikes</h4>
                  <p className="text-xs text-[#A8B8D0] mt-0.5">AQI value has crossed {w.aqi}. PM2.5 stands at {w.pm25} μg/m³.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-semibold">{w.grapStage} Triggered</span>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-[#A8B8D0]">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <p className="text-sm font-medium">All wards within nominal bounds. No active alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
