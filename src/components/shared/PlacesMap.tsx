"use client";

import { useEffect, useState } from "react";
import { Place } from "@/types";
import { cn } from "@/lib/utils";

interface PlacesMapProps {
  places: Place[];
  className?: string;
}

const categoryColors: Record<string, string> = {
  restaurant: "#f97316", // orange-500
  grocery: "#22c55e", // green-500
  mosque: "#14b8a6", // teal-500
  butcher: "#f43f5e", // rose-500
  cafe: "#f59e0b", // amber-500
  bakery: "#eab308", // yellow-500
  "study-spot": "#3b82f6", // blue-500
  cowork: "#a855f7", // purple-500
};

const categoryIcons: Record<string, string> = {
  restaurant: "🍽️",
  grocery: "🛒",
  mosque: "🕌",
  butcher: "🥩",
  cafe: "☕",
  bakery: "🥐",
  "study-spot": "📚",
  cowork: "💻",
};

export function PlacesMap({ places, className }: PlacesMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [Map, setMap] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet components only on client side
    import("react-leaflet").then((mod) => {
      setMap(() => mod.MapContainer as React.ComponentType<Record<string, unknown>>);
    });
  }, []);

  if (!isClient || !Map) {
    return (
      <div className={cn("relative h-[500px] w-full rounded-2xl border border-white/10 bg-zinc-900/50 flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span className="text-sm text-zinc-400">Loading map...</span>
        </div>
      </div>
    );
  }

  // Filter places with valid coordinates
  const placesWithCoords = places.filter(p => p.lat && p.lng);
  
  // Munich city center coordinates
  const center: [number, number] = [48.1351, 11.5820];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10", className)}>
      <MapWrapper 
        places={placesWithCoords} 
        center={center}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-white/10 bg-zinc-900/90 p-3 backdrop-blur-sm">
        <p className="mb-2 text-xs font-medium text-zinc-400">Legend</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(categoryIcons).slice(0, 6).map(([key, icon]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-sm">{icon}</span>
              <span className="text-xs capitalize text-zinc-400">
                {key.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate component to handle the actual map rendering
function MapWrapper({ 
  places, 
  center, 
}: { 
  places: Place[]; 
  center: [number, number]; 
}) {
  const [leaflet, setLeaflet] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>;
    TileLayer: React.ComponentType<Record<string, unknown>>;
    Marker: React.ComponentType<Record<string, unknown>>;
    Popup: React.ComponentType<Record<string, unknown>>;
  } | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    // Import Leaflet and react-leaflet on client side
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([reactLeaflet, leafletLib]) => {
      setLeaflet({
        MapContainer: reactLeaflet.MapContainer as unknown as React.ComponentType<Record<string, unknown>>,
        TileLayer: reactLeaflet.TileLayer as unknown as React.ComponentType<Record<string, unknown>>,
        Marker: reactLeaflet.Marker as unknown as React.ComponentType<Record<string, unknown>>,
        Popup: reactLeaflet.Popup as unknown as React.ComponentType<Record<string, unknown>>,
      });
      setL(leafletLib.default);
    });
  }, []);

  if (!leaflet || !L) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-zinc-900/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span className="text-sm text-zinc-400">Loading map...</span>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = leaflet;

  // Create custom icons for each category
  const createIcon = (category: string) => {
    const color = categoryColors[category] || "#10b981";
    const emoji = categoryIcons[category] || "📍";
    
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.slug}
          position={[place.lat!, place.lng!]}
          icon={createIcon(place.category)}
        >
          <Popup>
            <div className="min-w-[200px] p-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{categoryIcons[place.category]}</span>
                <span className="font-semibold text-zinc-900">{place.name}</span>
              </div>
              <p className="text-xs text-zinc-600 mb-2">{place.address}</p>
              {place.description && (
                <p className="text-xs text-zinc-500 line-clamp-2">{place.description}</p>
              )}
              {place.rating && (
                <p className="text-xs mt-1">
                  <span className="text-amber-500">★</span> {place.rating}
                </p>
              )}
              {(place.website || (place.lat && place.lng)) && (
                <div className="flex gap-2 mt-2">
                  {place.lat && place.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Directions →
                    </a>
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
