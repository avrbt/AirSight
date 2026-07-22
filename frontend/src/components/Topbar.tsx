import React from 'react';
import { Search, Bell, Clock, RefreshCw } from 'lucide-react';

export const Topbar: React.FC = () => {
  return (
    <header className="h-14 bg-[#1A2333] border-b border-[#2E3D56] px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-[#A8B8D0]">Mumbai Municipal Region</h2>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#6B7FA3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wards, stations... (Ctrl+K)"
            className="w-full bg-[#121824] border border-[#2E3D56] rounded-md pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#6B7FA3] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-[#00D97E]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing Live (CPCB, IMD)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A8B8D0] bg-[#121824] px-2.5 py-1 rounded border border-[#2E3D56]">
          <Clock className="w-3.5 h-3.5" />
          <span>July 15, 11:22 AM</span>
        </div>
        <button className="relative p-2 text-[#A8B8D0] hover:text-white hover:bg-[#232F45] rounded-full transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
