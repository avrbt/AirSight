export interface WardAQI {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  dominantPollutant: string;
  population: string;
  trend: 'up' | 'down' | 'stable';
  grapStage: string;
}

export const mockWards: WardAQI[] = [
  { id: "w1", name: "Dharavi", aqi: 287, pm25: 124, pm10: 198, no2: 78, dominantPollutant: "PM2.5", population: "3.2L", trend: "up", grapStage: "Stage II" },
  { id: "w2", name: "Govandi", aqi: 241, pm25: 98, pm10: 165, no2: 64, dominantPollutant: "PM2.5", population: "1.8L", trend: "up", grapStage: "Stage II" },
  { id: "w3", name: "Mankhurd", aqi: 228, pm25: 89, pm10: 154, no2: 58, dominantPollutant: "PM2.5", population: "2.1L", trend: "down", grapStage: "Stage I" },
  { id: "w4", name: "Andheri West", aqi: 178, pm25: 62.4, pm10: 98.2, no2: 41.1, dominantPollutant: "PM2.5", population: "3.8L", trend: "stable", grapStage: "Stage I" },
  { id: "w5", name: "Bandra West", aqi: 142, pm25: 51, pm10: 82, no2: 36, dominantPollutant: "PM2.5", population: "2.5L", trend: "down", grapStage: "Stage I" },
  { id: "w6", name: "Colaba", aqi: 88, pm25: 29, pm10: 55, no2: 24, dominantPollutant: "PM10", population: "1.2L", trend: "stable", grapStage: "None" },
  { id: "w7", name: "Chembur", aqi: 312, pm25: 145, pm10: 220, no2: 92, dominantPollutant: "PM2.5", population: "2.9L", trend: "up", grapStage: "Stage III" }
];

export const mockAttribution = {
  industrial: 42.1,
  vehicular: 31.4,
  construction: 18.2,
  biomass: 5.8,
  dust: 2.5
};

export const mockShapValues = [
  { name: "wind_alignment_industrial", value: 14.2, direction: "up", desc: "Wind alignment from industrial clusters" },
  { name: "no2_so2_ratio", value: 8.1, direction: "up", desc: "High ratio indicating industrial combustion footprint" },
  { name: "satellite_hotspot_dist", value: 6.7, direction: "up", desc: "Active thermal hotspots within 1.5km" },
  { name: "morning_traffic_surge", value: 5.4, direction: "up", desc: "High traffic density peak" },
  { name: "ambient_wind_speed", value: -3.1, direction: "down", desc: "Stronger winds scattering local particulates" }
];

export const mockForecast = Array.from({ length: 24 }, (_, i) => {
  const hour = (new Date().getHours() + i) % 24;
  const timeStr = `${hour.toString().padStart(2, '0')}:00`;
  const baseAqi = 178 + Math.sin(i / 3) * 25 + (i * 1.5);
  return {
    time: timeStr,
    p50: Math.round(baseAqi),
    p10: Math.round(baseAqi - 15 - (i * 0.5)),
    p90: Math.round(baseAqi + 20 + (i * 0.8))
  };
});
