import React from 'react';
import type { RegionalActivity } from '../types/admin';

interface GeoActivityCardProps {
  regions: RegionalActivity[];
  onOpenGeoMap?: () => void;
}

export const GeoActivityCard: React.FC<GeoActivityCardProps> = ({ regions, onOpenGeoMap }) => {
  return (
    <div className="bg-black rounded-xl border border-white p-5 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">Regional Mandi Activity</h3>
            <p className="text-[11px] text-slate-300 font-medium">Active trading volume & health score</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-black text-emerald-400 flex items-center justify-center border border-emerald-400">
            <span className="material-symbols-outlined text-lg">map</span>
          </div>
        </div>

        <div className="space-y-3">
          {regions.map((region) => (
            <div key={region.region} className="p-3 bg-black rounded-lg border border-white space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-white">
                <span>{region.region} ({region.state})</span>
                <span className="text-emerald-400 font-mono font-bold">{region.volumeTons} Tons</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                <span>{region.activeFarmers} Farmers</span>
                <span>{region.activeBuyers} Buyers</span>
                <span className="font-bold text-white">Health: {region.healthScore}/100</span>
              </div>

              <div className="w-full h-1.5 bg-black border border-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${region.healthScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white text-right">
        <button
          onClick={onOpenGeoMap}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-end gap-1 ml-auto"
        >
          <span>View Geo Intelligence Map</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};


