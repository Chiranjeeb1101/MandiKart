import React, { useEffect, useRef, useState } from 'react';
import { RouteStop } from '../../types';
import L from 'leaflet';
import { MapPin, Navigation, List, AlertTriangle } from 'lucide-react';

export interface RouteMapProps {
  stops: RouteStop[];
  activeStopIndex?: number;
  vehiclePosition?: { lat: number; lng: number; regNumber?: string };
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  activeStopIndex = 0,
  vehiclePosition,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [viewMode, setViewMode] = useState<'MAP' | 'LIST'>('MAP');
  const [mapError, setMapError] = useState<boolean>(false);

  useEffect(() => {
    if (viewMode !== 'MAP' || !mapContainerRef.current) return;

    try {
      // If map already exists, remove it before re-initializing
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center around Nashik / Maharashtra agri corridor if stops exist
      const initialLat = stops[0]?.lat || 19.9975;
      const initialLng = stops[0]?.lng || 73.7898;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 10,
        zoomControl: true,
      });

      // Dark theme map tiles from CartoDB or OpenStreetMap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom marker icons
      const createCustomIcon = (type: string, number: number, status: string) => {
        const bgColor =
          status === 'COMPLETED'
            ? '#10b981'
            : status === 'ARRIVED'
            ? '#38bdf8'
            : type === 'DELIVERY'
            ? '#6366f1'
            : '#f59e0b';

        return L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              background-color: ${bgColor};
              color: #0f172a;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 12px;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ">
              ${number}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
      };

      const latLngs: [number, number][] = [];

      // Add stops to map
      stops.forEach(stop => {
        latLngs.push([stop.lat, stop.lng]);
        const marker = L.marker([stop.lat, stop.lng], {
          icon: createCustomIcon(stop.type, stop.stopNumber, stop.status),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 2px;">
              Stop #${stop.stopNumber} · ${stop.type}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #f8fafc;">
              ${stop.locationName}
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
              ${stop.address}
            </div>
            ${
              stop.cropInfo
                ? `<div style="font-size: 12px; font-weight: 600; color: #34d399; margin-top: 6px;">
                    🌱 ${stop.cropInfo}
                  </div>`
                : ''
            }
            <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; border-top: 1px solid #334155; padding-top: 4px;">
              ETA: <strong style="color: #f1f5f9;">${stop.eta}</strong> | Status: <strong style="color: #38bdf8;">${stop.status}</strong>
            </div>
          </div>
        `);
      });

      // Add Live Vehicle position if provided
      if (vehiclePosition) {
        const truckIcon = L.divIcon({
          className: 'truck-marker',
          html: `
            <div style="
              background-color: #0f172a;
              color: #10b981;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #10b981;
              box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
            ">
              🚚
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([vehiclePosition.lat, vehiclePosition.lng], { icon: truckIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: Inter, sans-serif;">
              <strong>Live Vehicle Tracking</strong><br/>
              ${vehiclePosition.regNumber || 'Assigned Fleet Vehicle'}
            </div>
          `);
      }

      // Draw polyline connecting stops
      if (latLngs.length > 1) {
        const polyline = L.polyline(latLngs, {
          color: '#10b981',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
        }).addTo(map);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } else if (latLngs.length === 1) {
        map.setView(latLngs[0], 12);
      }
    } catch (err) {
      console.error('Leaflet map error:', err);
      setMapError(true);
      setViewMode('LIST');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, vehiclePosition, viewMode]);

  return (
    <div className={`relative rounded-xl overflow-hidden glass-panel border border-slate-800 ${className}`}>
      {/* View Mode Toggle Header */}
      <div className="absolute top-3 right-3 z-20 flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-lg">
        <button
          onClick={() => setViewMode('MAP')}
          disabled={mapError}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            viewMode === 'MAP'
              ? 'bg-brand-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Map View
        </button>
        <button
          onClick={() => setViewMode('LIST')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            viewMode === 'LIST'
              ? 'bg-brand-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          Stop Sequence List
        </button>
      </div>

      {mapError && (
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Map tiles offline — switched automatically to fallback ordered stop sequence.
        </div>
      )}

      {/* MAP VIEW */}
      {viewMode === 'MAP' && !mapError ? (
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
      ) : (
        /* GRACEFUL FALLBACK LIST VIEW (Master Guide §3 acceptance criteria) */
        <div className="p-5 overflow-y-auto max-h-[480px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <List className="w-4 h-4 text-brand-400" />
              Turn-by-Turn Route Stops ({stops.length} Total)
            </h4>
            <span className="text-xs text-slate-400">Chronological Sequence</span>
          </div>

          <div className="space-y-3">
            {stops.map((stop, index) => {
              const isCurrent = index === activeStopIndex;
              return (
                <div
                  key={stop.stopNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-brand-500/10 border-brand-500/40 shadow-lg shadow-brand-500/5'
                      : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          stop.status === 'COMPLETED'
                            ? 'bg-emerald-500 text-slate-950'
                            : stop.status === 'ARRIVED'
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {stop.stopNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {stop.type}
                          </span>
                          <h5 className="text-sm font-semibold text-slate-100">{stop.locationName}</h5>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {stop.address}
                        </p>
                        {stop.cropInfo && (
                          <p className="text-xs font-medium text-brand-400 mt-1.5">
                            Cargo: {stop.cropInfo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-200">ETA {stop.eta}</span>
                      <div className="mt-1">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                            stop.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : stop.status === 'ARRIVED'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {stop.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
