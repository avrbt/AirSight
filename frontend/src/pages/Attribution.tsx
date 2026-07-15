import React from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockAttribution, mockShapValues } from '../utils/mockData';
import { BrainCircuit, ArrowUp, ArrowDown } from 'lucide-react';

export const Attribution: React.FC = () => {
  const { selectedWard } = useStore();
  
  const attributionData = Object.entries(mockAttribution).map(([key, val]) => ({
    name: key,
    value: val
  }));

  const COLORS = ['#FF6B35', '#3B9EFF', '#FFB020', '#E63946', '#A8B8D0'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Pollution Source Attribution</h1>
        <p className="text-xs text-[#A8B8D0] mt-1">AI-powered fingerprinting showing local contributing factors and explainable SHAP features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Attribution pie breakdown */}
        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Source Breakdown: {selectedWard?.name || "Global average"}</h2>
            <p className="text-xs text-[#A8B8D0] mt-0.5">XGBoost fingerprints of local municipal emission signatures.</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {attributionData.map((d, index) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="capitalize text-white">{d.name}</span>
                <span className="text-[#A8B8D0] font-mono">({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* SHAP explainability variables */}
        <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2E3D56] pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
                SHAP Explainability Features
              </h2>
              <p className="text-xs text-[#A8B8D0] mt-0.5">Model variable weights driving local AQI adjustments.</p>
            </div>
          </div>
          <div className="space-y-3">
            {mockShapValues.map((feature, idx) => (
              <div key={idx} className="p-3 bg-[#121824] rounded border border-[#2E3D56] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">{feature.name}</span>
                  <span className="text-[10px] text-[#A8B8D0]">{feature.desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white">+{feature.value}%</span>
                  {feature.direction === "up" ? (
                    <ArrowUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
