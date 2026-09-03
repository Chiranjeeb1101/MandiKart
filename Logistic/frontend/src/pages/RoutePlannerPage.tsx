import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Sparkles,
  Truck,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { RouteMap } from '../components/map/RouteMap';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DeliveryRoute, RouteStop } from '../types';

export const RoutePlannerPage: React.FC = () => {
  const { routes, vehicles, drivers, optimizeRoute, updateRouteStopStatus } = useLogistics();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const assignedVehicle = vehicles.find(v => v.id === activeRoute?.vehicleId);
  const assignedDriver = drivers.find(d => d.id === activeRoute?.driverId);

  const handleRunAiOptimization = () => {
    if (!activeRoute) return;
    setIsOptimizing(true);
    setTimeout(() => {
      optimizeRoute(activeRoute.id);
      setIsOptimizing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Route Planning & Map Optimization</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Spoilage Minimization
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic waypoint routing for multi-farm pickups, consolidation hubs, and final mandi wholesale terminals.
          </p>
        </div>

        {/* Route Selector Pill Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {routes.map(route => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRouteId === route.id
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {route.routeCode}
            </button>
          ))}
        </div>
      </div>

      {/* Active Route Overview Stats Bar */}
      {activeRoute && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Distance</span>
            <div className="text-lg font-extrabold text-slate-100 mt-0.5">
              {activeRoute.totalDistanceKm} km
            </div>
            <span className="text-[10px] text-brand-400 font-medium">Highway + Rural bypass</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Transit Duration</span>
            <div className="text-lg font-extrabold text-slate-100 mt-0.5">
              {Math.floor(activeRoute.estimatedDurationMins / 60)}h {activeRoute.estimatedDurationMins % 60}m
            </div>
            <span className="text-[10px] text-slate-400">Traffic-adjusted</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Freshness / Spoilage Priority</span>
            <div className="text-lg font-extrabold text-brand-400 mt-0.5">
              {activeRoute.spoilageRiskPriority} PRIORITY
            </div>
            <span className="text-[10px] text-slate-400">
              {activeRoute.spoilageRiskPriority === 'HIGH' ? 'Cold storage priority' : 'Standard perishable'}
            </span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Driver</span>
              <div className="text-sm font-bold text-slate-200 mt-0.5">
                {assignedDriver?.name || 'Unassigned'}
              </div>
              <span className="text-[10px] font-mono text-brand-400">
                {assignedVehicle?.regNumber || 'Vehicle Pending'}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              loading={isOptimizing}
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={handleRunAiOptimization}
            >
              Optimize
            </Button>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map & Turn-by-Turn Waypoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title={
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-400" />
                <span>Geographic Route Visualizer ({activeRoute?.routeCode})</span>
              </div>
            }
            subtitle="Real-time map showing farm pickups, transit hubs, and wholesale mandis"
            headerAction={
              activeRoute?.lastOptimizedAt && (
                <span className="text-[11px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 font-medium">
                  ✓ AI Optimized
                </span>
              )
            }
            bodyClassName="p-0"
          >
            {activeRoute ? (
              <RouteMap
                stops={activeRoute.stops}
                activeStopIndex={activeRoute.currentStopIndex}
                vehiclePosition={
                  assignedVehicle
                    ? {
                        lat: assignedVehicle.currentLat,
                        lng: assignedVehicle.currentLng,
                        regNumber: assignedVehicle.regNumber,
                      }
                    : undefined
                }
                className="h-[460px] rounded-none border-0"
              />
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">No active route selected</div>
            )}
          </Card>
        </div>

        {/* Turn-by-Turn Schedule (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>Waypoint Sequence</span>
                <span className="text-xs text-slate-400">{activeRoute?.stops.length} Stops</span>
              </div>
            }
            subtitle="Driver manifest and stop progression"
          >
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {activeRoute?.stops.map((stop, index) => {
                const isCompleted = stop.status === 'COMPLETED';
                const isArrived = stop.status === 'ARRIVED';

                return (
                  <div
                    key={stop.stopNumber}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isArrived
                        ? 'bg-sky-500/10 border-sky-500/40 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-slate-850/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : isArrived
                              ? 'bg-sky-400 text-slate-950 animate-pulse'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {stop.stopNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-900 text-slate-300 border border-slate-800">
                              {stop.type}
                            </span>
                            <h5 className="text-xs font-bold text-slate-100">{stop.locationName}</h5>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-1">{stop.address}</p>

                          {stop.cropInfo && (
                            <p className="text-[11px] font-semibold text-brand-400 mt-1">
                              🌱 {stop.cropInfo}
                            </p>
                          )}

                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Contact: {stop.contactPerson} ({stop.contactPhone})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-200 block">ETA {stop.eta}</span>
                        <div className="mt-2 flex flex-col gap-1">
                          {!isCompleted && (
                            <>
                              {!isArrived && (
                                <button
                                  onClick={() =>
                                    updateRouteStopStatus(activeRoute.id, stop.stopNumber, 'ARRIVED')
                                  }
                                  className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold hover:bg-sky-500/25"
                                >
                                  Mark Arrived
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  updateRouteStopStatus(activeRoute.id, stop.stopNumber, 'COMPLETED')
                                }
                                className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 font-semibold hover:bg-brand-500/30"
                              >
                                Complete Stop
                              </button>
                            </>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-400">✓ Done</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
