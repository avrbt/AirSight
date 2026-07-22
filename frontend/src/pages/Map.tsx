import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { icons, iconSize } from "@/lib/icons";
import { getAqiColor, getAqiBadgeClass } from "@/lib/theme";
import maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ═══════════════════════════════════════════════════════════
 * INTERACTIVE AQI MAP PAGE
 * Uses MapLibre GL JS to render an interactive map container
 * loaded with mock ward polygons, ground sensor monitoring station markers,
 * layer controls, zoom controls, and a detailed information drawer.
 * ═══════════════════════════════════════════════════════════ */

// Mock Monitoring Stations data coordinates (Mumbai center area)
const MONITORING_STATIONS = [
  { id: "s1", name: "Dharavi Sector 5 Station", lat: 19.0380, lng: 72.8538, aqi: 287, type: "Industrial" },
  { id: "s2", name: "Govandi East Sensor", lat: 19.0596, lng: 72.9202, aqi: 241, type: "Industrial" },
  { id: "s3", name: "Mankhurd Crossing Monitor", lat: 19.0485, lng: 72.9322, aqi: 228, type: "Traffic" },
  { id: "s4", name: "Andheri Sports Complex Station", lat: 19.1334, lng: 72.8358, aqi: 178, type: "Residential" },
  { id: "s5", name: "Bandra Reclamation Sensor", lat: 19.0544, lng: 72.8402, aqi: 142, type: "Residential" },
  { id: "s6", name: "Colaba Coast Guard Station", lat: 18.9067, lng: 72.8147, aqi: 88, type: "Background" },
  { id: "s7", name: "Chembur Naka Monitor", lat: 19.0620, lng: 72.8988, aqi: 312, type: "Industrial" }
];

// Mock India / Mumbai Ward GeoJSON generator
const getMockWardsGeoJSON = (wardsList: any[]) => {
  // Center: Mumbai coordinates
  const centers = [
    { name: "Dharavi", lat: 19.0380, lng: 72.8538 },
    { name: "Govandi", lat: 19.0596, lng: 72.9202 },
    { name: "Mankhurd", lat: 19.0485, lng: 72.9322 },
    { name: "Andheri West", lat: 19.1334, lng: 72.8358 },
    { name: "Bandra West", lat: 19.0544, lng: 72.8402 },
    { name: "Colaba", lat: 18.9067, lng: 72.8147 },
    { name: "Chembur", lat: 19.0620, lng: 72.8988 }
  ];

  const features = wardsList.map((ward) => {
    const center = centers.find(c => c.name === ward.name) || { lat: 19.0, lng: 72.8 };
    const r = 0.015; // radius for simple polygon creation
    
    // Generate hex polygon coordinates
    const coordinates = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      coordinates.push([
        center.lng + r * 1.3 * Math.cos(angle),
        center.lat + r * Math.sin(angle)
      ]);
    }
    coordinates.push(coordinates[0]); // Close polygon

    return {
      type: "Feature" as const,
      properties: {
        id: ward.id,
        name: ward.name,
        aqi: ward.aqi,
        color: getAqiColor(ward.aqi),
        grapStage: ward.grapStage,
        pm25: ward.pm25
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [coordinates]
      }
    };
  });

  return {
    type: "FeatureCollection" as const,
    features
  };
};

export const Map: React.FC = () => {
  const { wards = [], selectedWard, setSelectedWard } = useStore();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibre.Map | null>(null);
  const markersRef = useRef<maplibre.Marker[]>([]);

  // Layer toggle state
  const [layers, setLayers] = useState({
    heatmap: true,
    stations: true,
    satellite: false,
    wind: true
  });

  // Map settings
  const [zoom, setZoom] = useState(11.5);
  const [pitch, setPitch] = useState(45);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => {
      const next = { ...prev, [key]: !prev[key] };
      
      // Toggle visual ground layers directly in MapLibre instance if initialized
      if (mapInstance.current) {
        if (key === "heatmap") {
          const fillVis = next.heatmap ? "visible" : "none";
          if (mapInstance.current.getLayer("ward-fills")) {
            mapInstance.current.setLayoutProperty("ward-fills", "visibility", fillVis);
          }
          if (mapInstance.current.getLayer("ward-outlines")) {
            mapInstance.current.setLayoutProperty("ward-outlines", "visibility", fillVis);
          }
        }
        if (key === "stations") {
          markersRef.current.forEach(marker => {
            marker.getElement().style.display = next.stations ? "block" : "none";
          });
        }
      }
      return next;
    });
  };

  // Zoom helpers
  const zoomIn = () => {
    mapInstance.current?.zoomIn();
  };
  const zoomOut = () => {
    mapInstance.current?.zoomOut();
  };
  const resetCompass = () => {
    mapInstance.current?.easeTo({ bearing: 0, pitch: 45, duration: 1000 });
  };

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Mumbai center coordinates
    const centerLng = 72.8777;
    const centerLat = 19.0760;

    const map = new maplibre.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: "© CartoDB © OpenStreetMap contributors"
          }
        },
        layers: [
          {
            id: "osm-raster",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [centerLng, centerLat],
      zoom: zoom,
      pitch: pitch,
      bearing: -10,
      maxZoom: 16,
      minZoom: 8
    });

    mapInstance.current = map;

    // Track zoom updates
    map.on("zoom", () => {
      setZoom(Number(map.getZoom().toFixed(1)));
    });
    // Track pitch updates
    map.on("pitch", () => {
      setPitch(Number(map.getPitch().toFixed(0)));
    });

    map.on("load", () => {
      // Add GeoJSON source for wards
      const geojsonData = getMockWardsGeoJSON(wards);
      
      map.addSource("wards-geojson", {
        type: "geojson",
        data: geojsonData
      });

      // Ward Polygon Fill Layer (heatmap)
      map.addLayer({
        id: "ward-fills",
        type: "fill",
        source: "wards-geojson",
        layout: {
          visibility: layers.heatmap ? "visible" : "none"
        },
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.25
          ]
        }
      });

      // Ward Outline Layer
      map.addLayer({
        id: "ward-outlines",
        type: "line",
        source: "wards-geojson",
        layout: {
          visibility: layers.heatmap ? "visible" : "none"
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.5,
          "line-opacity": 0.8
        }
      });

      // Handle hover state
      let hoveredFeatureId: string | null = null;
      
      map.on("mousemove", "ward-fills", (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = "pointer";
          const feature = e.features[0];
          const featId = feature.properties?.id;
          
          if (hoveredFeatureId !== featId) {
            hoveredFeatureId = featId;
          }
        }
      });

      map.on("mouseleave", "ward-fills", () => {
        map.getCanvas().style.cursor = "";
        hoveredFeatureId = null;
      });

      // Click to select ward
      map.on("click", "ward-fills", (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const wardId = feature.properties?.id;
          const foundWard = wards.find(w => w.id === wardId);
          if (foundWard) {
            setSelectedWard(foundWard);
          }
        }
      });
    });

    // Clean up
    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapInstance.current = null;
    };
  }, [wards]);

  // Update Ground Sensor Markers dynamically
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!layers.stations) return;

    MONITORING_STATIONS.forEach((station) => {
      const color = getAqiColor(station.aqi);
      
      // Create HTML element for custom glowing marker
      const el = document.createElement("div");
      el.className = "relative cursor-pointer transition-transform duration-normal hover:scale-110 flex items-center justify-center";
      el.style.width = "32px";
      el.style.height = "32px";
      
      // Marker Dot and pulse ring
      el.innerHTML = `
        <div class="absolute w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" style="background-color: ${color}; box-shadow: 0 0 10px ${color}">
          <span class="text-[8px] font-mono font-bold text-white leading-none">${station.aqi}</span>
        </div>
        <div class="absolute w-8 h-8 rounded-full border-2 border-dashed opacity-40 animate-spin-slow" style="border-color: ${color}"></div>
      `;

      // Set up click action to trigger ward select matching nearest station name
      el.addEventListener("click", () => {
        // Try mapping sensor station name to ward list
        const matchedWard = wards.find(w => station.name.toLowerCase().includes(w.name.toLowerCase()));
        if (matchedWard) {
          setSelectedWard(matchedWard);
        } else {
          // Fallback ward select
          const firstWard = wards.find(w => w.id === station.id.replace("s", "w"));
          if (firstWard) setSelectedWard(firstWard);
        }
      });

      // Add to map
      const marker = new maplibre.Marker({ element: el })
        .setLngLat([station.lng, station.lat])
        .addTo(mapInstance.current!);
      
      markersRef.current.push(marker);
    });
  }, [layers.stations, wards]);

  return (
    <div className="h-[calc(100vh-topbar-statusbar-4rem)] flex relative overflow-hidden rounded-xl border border-border bg-canvas-deep">
      {/* ── MAP CONTAINER ── */}
      <div className="flex-1 h-full relative" ref={mapContainer}>
        {/* Layer Controls Panel (Top Left Float) */}
        <div className="absolute top-4 left-4 z-content bg-canvas-card/90 backdrop-blur-md border border-border rounded-lg p-4 w-52 shadow-elevation-2 select-none animate-slide-in-up">
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-3 text-text-primary">
            <icons.action.layers className={cn(iconSize.sm, "text-brand")} />
            <span className="text-overline font-bold uppercase tracking-wider">Map Layers</span>
          </div>
          
          <div className="space-y-2.5">
            {[
              { key: "heatmap", label: "AQI Heatmap", desc: "Ward polygons", icon: icons.environment.gauge },
              { key: "stations", label: "Ground Sensors", desc: "CPCB active nodes", icon: icons.system.database },
              { key: "satellite", label: "Satellite AOD", desc: "Copernicus AOD", icon: icons.data.crosshair },
              { key: "wind", label: "Wind Vectors", desc: "IMD wind arrows", icon: icons.environment.wind }
            ].map(layer => (
              <label
                key={layer.key}
                className="flex items-start gap-2.5 cursor-pointer text-caption text-text-secondary hover:text-text-primary transition-colors"
              >
                <input
                  type="checkbox"
                  checked={layers[layer.key as keyof typeof layers]}
                  onChange={() => toggleLayer(layer.key as keyof typeof layers)}
                  className="rounded border-border bg-canvas-surface text-brand focus:ring-0 focus:ring-offset-0 mt-0.5"
                />
                <div className="leading-tight">
                  <div className="font-semibold text-text-primary flex items-center gap-1">
                    {layer.label}
                  </div>
                  <span className="text-[9px] text-text-tertiary">{layer.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Compass & Navigation controls (Bottom Right Float) */}
        <div className="absolute bottom-4 right-4 z-content flex flex-col gap-1.5 bg-canvas-card border border-border p-1.5 rounded-lg shadow-elevation-2">
          <button
            onClick={zoomIn}
            aria-label="Zoom In"
            className="p-1.5 hover:bg-canvas-elevated text-text-secondary hover:text-text-primary rounded-md transition-colors focus-ring"
          >
            <icons.direction.chevronUp className={iconSize.md} />
          </button>
          <button
            onClick={zoomOut}
            aria-label="Zoom Out"
            className="p-1.5 hover:bg-canvas-elevated text-text-secondary hover:text-text-primary rounded-md transition-colors focus-ring"
          >
            <icons.direction.chevronDown className={iconSize.md} />
          </button>
          <div className="h-px bg-border my-0.5 mx-1" />
          <button
            onClick={resetCompass}
            aria-label="Reset orientation"
            className="p-1.5 hover:bg-canvas-elevated text-text-secondary hover:text-text-primary rounded-md transition-colors focus-ring"
          >
            <icons.data.crosshair className={iconSize.md} />
          </button>
        </div>

        {/* Map Legend Overlay (Bottom Left Float) */}
        <div className="absolute bottom-4 left-4 z-content bg-canvas-card/90 backdrop-blur-md border border-border rounded-lg p-3 w-48 shadow-elevation-2 select-none animate-slide-in-up">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block mb-2">AQI Scale</span>
          <div className="space-y-1">
            {[
              { color: "bg-aqi-good", label: "Good (0-50)" },
              { color: "bg-aqi-satisfactory", label: "Satisfactory (51-100)" },
              { color: "bg-aqi-moderate", label: "Moderate (101-200)" },
              { color: "bg-aqi-poor", label: "Poor (201-300)" },
              { color: "bg-aqi-verypoor", label: "Very Poor (301-400)" },
              { color: "bg-aqi-severe", label: "Severe (401-500)" }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-[10px] text-text-secondary">
                <div className={cn("w-3 h-2 rounded flex-shrink-0", item.color)} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating status metadata details */}
        <div className="absolute top-4 right-4 z-content bg-canvas-card/85 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-elevation-1 text-[10px] text-text-secondary flex items-center gap-3">
          <span className="flex items-center gap-1"><icons.direction.chevronUp className="w-3.5 h-3.5 rotate-95 text-text-tertiary" /> Zoom: {zoom}</span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1"><icons.action.settings className="w-3.5 h-3.5 text-text-tertiary" /> Pitch: {pitch}°</span>
        </div>
      </div>

      {/* ── RIGHT DETAIL DRAWER ── */}
      {selectedWard && (
        <aside className="w-96 border-l border-border bg-canvas-card flex flex-col h-full overflow-y-auto select-none animate-slide-in-right z-content">
          {/* Header */}
          <div className="h-topbar px-4 flex items-center justify-between border-b border-border flex-shrink-0">
            <h3 className="text-body-sm font-semibold text-text-primary">Ward Intelligence Details</h3>
            <button
              onClick={() => setSelectedWard(null)}
              className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas-elevated transition-colors"
            >
              <icons.action.close className={iconSize.sm} />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Name */}
            <div>
              <h2 className="text-h1 text-text-primary font-bold leading-tight">{selectedWard.name}</h2>
              <p className="text-caption text-text-secondary mt-1">Zone 3 · Municipal Corporation of Greater Mumbai</p>
            </div>

            {/* AQI Indicator Panel */}
            <div className="bg-canvas-surface p-4 rounded-xl border border-border relative overflow-hidden shadow-inner-subtle">
              <span className="text-overline font-semibold text-text-secondary uppercase tracking-wider">Current Air Quality Index</span>
              
              <div className="flex items-baseline gap-2 mt-2">
                <span className={cn(
                  "text-5xl font-mono font-bold tracking-tight",
                  selectedWard.aqi <= 50 ? "text-aqi-good" :
                  selectedWard.aqi <= 100 ? "text-aqi-satisfactory" :
                  selectedWard.aqi <= 200 ? "text-aqi-moderate" :
                  selectedWard.aqi <= 300 ? "text-aqi-poor" :
                  selectedWard.aqi <= 400 ? "text-aqi-verypoor" : "text-aqi-severe"
                )}>
                  {selectedWard.aqi}
                </span>
                
                <span className={cn(
                  "text-caption font-semibold px-2 py-0.5 rounded border",
                  getAqiBadgeClass(selectedWard.aqi)
                )}>
                  {selectedWard.grapStage !== "None" ? selectedWard.grapStage : "Normal"}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-3 text-caption text-text-secondary pt-3 border-t border-border/50">
                <icons.trend.up className="w-3.5 h-3.5 text-brand" />
                <span>PM2.5: {selectedWard.pm25} μg/m³ · Dominant: {selectedWard.dominantPollutant}</span>
              </div>
            </div>

            {/* AI Policy action details */}
            <div className="bg-brand/5 border border-brand/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-brand">
                <icons.nav.recommendations className="w-4 h-4" />
                <span className="text-overline font-semibold uppercase tracking-wider">AI Recommendation Action</span>
              </div>
              <p className="text-caption text-text-secondary leading-relaxed">
                Industrial output emissions from MIDC cluster zones represent 42% of local AQI spikes. Wind vectors moving SW align emissions towards residential areas. Moratoriums on construction sites &gt; 500 sqm recommended.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
