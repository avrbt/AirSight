import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';

export const Map: React.FC = () => {
  const { wards, selectedWard, setSelectedWard } = useStore();
  const [selectedLayers, setSelectedLayers] = useState<string[]>(["aqi"]);

  const toggleLayer = (layer: string) => {
    setSelectedLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex relative overflow-hidden rounded-lg border border-[#2E3D56]">
      {/* Mapbox simulation container */}
      <div className="flex-1 bg-[#0b0f19] relative flex items-center justify-center">
        {/* Mock Map Vector Grid Layer */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Mocking Wards choropleth polygons */}
        <div className="relative w-[500px] h-[500px]">
          {wards.map((w, index) => {
            const colors = ["#E63946", "#FF6B35", "#FFB020", "#B8E045", "#00D97E", "#9B1FCA"];
            const color = colors[index % colors.length];
            const isSelected = selectedWard?.id === w.id;
            
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWard(w)}
                style={{ 
                  left: `${50 + (index * 60)}px`, 
                  top: `${100 + (Math.sin(index) * 80)}px`,
                  backgroundColor: selectedLayers.includes("aqi") ? `${color}22` : "transparent",
                  borderColor: isSelected ? "#0070F3" : `${color}88`,
                  borderWidth: isSelected ? "3px" : "1.5px"
                }}
                className="absolute w-36 h-28 rounded-lg flex flex-col items-center justify-center p-2 text-center select-none cursor-pointer transition-all hover:scale-105 hover:bg-[#232F45]/50 group"
              >
                <span className="text-[10px] text-[#A8B8D0] uppercase font-semibold">{w.name}</span>
                <span className="text-lg font-mono font-bold text-white mt-1">{w.aqi}</span>
                <span className="text-[9px] text-[#6B7FA3] mt-0.5">{w.grapStage}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Map Navigation Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-[#1A2333] p-2 rounded-lg border border-[#2E3D56]">
          <button className="p-2 hover:bg-[#232F45] text-[#A8B8D0] hover:text-white rounded transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-[#232F45] text-[#A8B8D0] hover:text-white rounded transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-[#232F45] text-[#A8B8D0] hover:text-white rounded transition-colors"><Compass className="w-4 h-4" /></button>
        </div>

        {/* Floating Layer Controls Panel */}
        <div className="absolute top-6 left-6 bg-[#1A2333] border border-[#2E3D56] rounded-lg p-4 w-52 space-y-3">
          <div className="flex items-center gap-2 text-white border-b border-[#2E3D56] pb-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Map Layers</span>
          </div>
          <div className="space-y-2">
            {[
              { id: "aqi", label: "AQI Heatmap" },
              { id: "stations", label: "Ground Sensors" },
              { id: "satellite", label: "Satellite AOD" },
              { id: "traffic", label: "Traffic Density" }
            ].map(layer => (
              <label key={layer.id} className="flex items-center gap-2 cursor-pointer text-xs text-[#A8B8D0] hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedLayers.includes(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  className="rounded bg-[#121824] border-[#2E3D56] text-blue-500 focus:ring-0"
                />
                <span>{layer.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
