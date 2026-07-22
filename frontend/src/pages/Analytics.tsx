import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { mockWards } from '../utils/mockData';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Historical Analytics</h1>
        <p className="text-xs text-[#A8B8D0] mt-1">Cross-ward comparison datasets and seasonal historical metrics.</p>
      </div>

      <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-bold text-white text-sm">AQI Comparison across Municipal Wards</h3>
          <p className="text-xs text-[#A8B8D0] mt-0.5">Average current values from the active sensor array.</p>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWards}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E3D56" />
              <XAxis dataKey="name" stroke="#6B7FA3" fontSize={11} />
              <YAxis stroke="#6B7FA3" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1A2333', borderColor: '#2E3D56' }} />
              <Bar dataKey="aqi" fill="#0070F3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
