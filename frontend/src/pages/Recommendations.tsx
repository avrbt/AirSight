import React from 'react';
import { useStore } from '../store/useStore';
import { Brain, ArrowRight, Download } from 'lucide-react';

export const Recommendations: React.FC = () => {
  const { selectedWard } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Policy Recommendations</h1>
          <p className="text-xs text-[#A8B8D0] mt-1">Autonomous intervention protocols generated from predictive modeling pipelines.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Executive Brief</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#2E3D56] pb-4">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Active Policy Recommendation Brief</h2>
              <p className="text-[10px] text-[#A8B8D0]">Focus Ward: {selectedWard?.name || "Global average"}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-[#A8B8D0] leading-relaxed">
            <p>
              Based on localized predictions, current weather stability conditions, and historical source attributions for Andheri West, we recommend activating <strong>GRAP Stage II</strong> local mitigation interventions immediately.
            </p>
            <div className="bg-[#121824] p-4 rounded border border-[#2E3D56] space-y-2">
              <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Intervention Step 1: Construction Halt</span>
              <p className="text-white">Implement a strict halt on construction activities exceeding 500 sqm within the affected area bounds.</p>
              <span className="text-[10px] text-[#00D97E] block">Expected impact: -14 AQI index points.</span>
            </div>
            <div className="bg-[#121824] p-4 rounded border border-[#2E3D56] space-y-2">
              <span className="text-[10px] font-semibold text-[#6B7FA3] uppercase tracking-wider">Intervention Step 2: Traffic Control</span>
              <p className="text-white">Divert heavy commercial vehicles from key central ward highways between 08:00 AM and 11:30 AM.</p>
              <span className="text-[10px] text-[#00D97E] block">Expected impact: -8 AQI index points.</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">Target Performance Projections</h3>
          <div className="p-4 bg-[#121824] border border-[#2E3D56] rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#6B7FA3] block">Estimated Final AQI</span>
              <span className="text-2xl font-mono font-bold text-[#00D97E]">156</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#00D97E]">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>-22 points</span>
            </div>
          </div>
          <div className="p-4 bg-[#121824] border border-[#2E3D56] rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#6B7FA3] block">Target Compliance Time</span>
              <span className="text-2xl font-mono font-bold text-blue-400">4 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
