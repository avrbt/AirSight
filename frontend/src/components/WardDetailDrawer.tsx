import React from 'react';
import { WardAQI } from '../utils/mockData';
import { X, TrendingUp, Cpu } from 'lucide-react';
import { mockAttribution } from '../utils/mockData';

interface DrawerProps {
  ward: WardAQI | null;
  onClose: () => void;
}

export const WardDetailDrawer: React.FC<DrawerProps> = ({ ward, onClose }) => {
  if (!ward) return null;

  const aqiColorClass = 
    ward.aqi <= 50 ? 'text-[#00D97E]' :
    ward.aqi <= 100 ? 'text-[#B8E045]' :
    ward.aqi <= 200 ? 'text-[#FFB020]' :
    ward.aqi <= 300 ? 'text-[#FF6B35]' :
    ward.aqi <= 400 ? 'text-[#E63946]' : 'text-[#9B1FCA]';

  return (
    <div className="w-96 bg-[#1A2333] border-l border-[#2E3D56] flex flex-col h-full overflow-y-auto">
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#2E3D56] flex-shrink-0">
        <h3 className="font-bold text-white text-sm">Ward Detail</h3>
        <button onClick={onClose} className="p-1 rounded text-[#A8B8D0] hover:text-white hover:bg-[#232F45] transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Basic Header */}
        <div>
          <h2 className="text-2xl font-bold text-white leading-tight">{ward.name}</h2>
          <p className="text-xs text-[#A8B8D0] mt-1">Zone 3 · Municipal Corporation of Greater Mumbai</p>
        </div>

        {/* AQI Indicator Card */}
        <div className="bg-[#121824] p-4 rounded-lg border border-[#2E3D56] relative overflow-hidden">
          <p className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Current Air Quality Index</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-5xl font-mono font-bold tracking-tight ${aqiColorClass}`}>{ward.aqi}</span>
            <span className={`text-sm font-semibold ${aqiColorClass}`}>{ward.grapStage !== "None" ? ward.grapStage : "Normal"}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#A8B8D0]">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>PM2.5: {ward.pm25} μg/m³ · Dominant: {ward.dominantPollutant}</span>
          </div>
        </div>

        {/* Source Attribution Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#A8B8D0] uppercase tracking-wider">Source Attribution Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(mockAttribution).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs text-white">
                  <span className="capitalize">{key}</span>
                  <span className="font-mono text-[#A8B8D0]">{val}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#121824] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Health Advisory */}
        <div className="bg-[#0070F3]/10 border border-[#0070F3]/30 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <Cpu className="w-4 h-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider">AI Recommendation Action</h4>
          </div>
          <p className="text-xs text-[#A8B8D0] leading-relaxed">
            Industrial output emissions from MIDC cluster zones represent 42% of local AQI spikes. Wind vectors moving SW align emissions towards residential areas. Moratoriums on construction sites &gt; 500 sqm recommended.
          </p>
        </div>
      </div>
    </div>
  );
};
