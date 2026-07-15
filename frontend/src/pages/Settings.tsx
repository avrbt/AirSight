import React from 'react';
import { Shield, Radio } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-[#A8B8D0] mt-1">Configure workspace preferences, alerting systems, and display configurations.</p>
      </div>

      <div className="bg-[#1A2333] border border-[#2E3D56] rounded-lg divide-y divide-[#2E3D56]">
        <div className="p-6 flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-md">
            <Radio className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-white">AQI Polling Frequency</h3>
            <p className="text-xs text-[#A8B8D0]">Configure how frequently ground sensors stream data updates to dashboard views.</p>
            <select className="mt-2 bg-[#121824] border border-[#2E3D56] text-xs text-white rounded p-1.5 focus:outline-none focus:border-blue-500">
              <option>15 Minutes (Standard)</option>
              <option>5 Minutes</option>
              <option>1 Minute (High CPU Load)</option>
            </select>
          </div>
        </div>

        <div className="p-6 flex items-start gap-4">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-md">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-semibold text-white">Emergency WhatsApp Dispatches</h3>
            <p className="text-xs text-[#A8B8D0]">Allow direct notifications to municipal ward officers during Stage III GRAP events.</p>
            <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#121824] border-[#2E3D56] text-blue-500" />
              <span className="text-xs text-[#A8B8D0]">Enabled</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
