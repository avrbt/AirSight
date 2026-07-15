import { create } from 'zustand';
import { mockWards, WardAQI } from '../utils/mockData';

interface AppState {
  selectedWard: WardAQI | null;
  setSelectedWard: (ward: WardAQI | null) => void;
  wards: WardAQI[];
  updateWardAQI: (id: string, aqi: number) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedWard: mockWards.find(w => w.id === "w4") || null,
  setSelectedWard: (ward) => set({ selectedWard: ward }),
  wards: mockWards,
  updateWardAQI: (id, aqi) => set((state) => ({
    wards: state.wards.map(w => w.id === id ? { ...w, aqi } : w)
  }))
}));
