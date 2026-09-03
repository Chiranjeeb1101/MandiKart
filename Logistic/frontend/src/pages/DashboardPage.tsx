import React from 'react';
import {
  Truck,
  PackageCheck,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CapacityBar } from '../components/ui/CapacityBar';
import { VEHICLE_STATUS_CONFIG, ORDER_STATUS_LOGISTICS_LABELS, ORDER_STATUS_COLORS } from '../constants/orderStatusLabels';
import { TabKey } from '../components/layout/Sidebar';

export interface DashboardPageProps {
  onNavigate: (tab: TabKey) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { metrics, vehicles, orders, exceptions } = useLogistics();

  const activeVehicles = vehicles.filter(v => v.status === 'IN_TRANSIT' || v.status === 'ASSIGNED');
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'COMPLETED');
  const recentExceptions = exceptions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Live Operations Control
            </span>
            <span className="text-xs text-slate-400">Maharashtra Agricultural Corridor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">
            Logistics & Fleet Command
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time multi-stop farm pickups, cold-chain vehicle allocation, and AI-optimized routes across Nashik, Pune & Mumbai mandis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="md"
            icon={<MapPin className="w-4 h-4" />}
            onClick={() => onNavigate('routes')}
          >
            Route View
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<PackageCheck className="w-4 h-4" />}
            onClick={() => onNavigate('pickups')}
          >
            Manage Pickups
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Fleet"
          value={`${metrics.activeVehicles} / ${metrics.totalVehicles}`}
          subtitle={`${vehicles.filter(v => v.status === 'IDLE').length} Idle · ${vehicles.filter(v => v.status === 'MAINTENANCE').length} Maintenance`}
          icon={<Truck className="w-5 h-5" />}
          accentColor="brand"
          trend={{ value: '100%', isPositive: true, label: 'on schedule' }}
          onClick={() => onNavigate('fleet')}
        />

        <StatCard
          title="Pending Pickups"
          value={metrics.pendingPickups}
          subtitle="Multi-farm child pickups awaiting collection"
          icon={<PackageCheck className="w-5 h-5" />}
          accentColor="amber"
          trend={{ value: '3 Farms', isPositive: true, label: 'scheduled today' }}
          onClick={() => onNavigate('pickups')}
        />

        <StatCard
          title="Orders In Transit"
          value={metrics.inTransitOrders}
          subtitle="Active consignments moving towards Mandi"
          icon={<Navigation className="w-5 h-5" />}
          accentColor="blue"
          trend={{ value: '2,100 kg', isPositive: true, label: 'produce moving' }}
          onClick={() => onNavigate('tracking')}
        />

        <StatCard
          title="Delivered Today"
          value={metrics.completedToday}
          subtitle="Zero spoilage reported across deliveries"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="cyan"
          trend={{ value: '100% PoD', isPositive: true, label: 'OTP verified' }}
          onClick={() => onNavigate('tracking')}
        />
      </div>

      {/* Main Content Split: Active Fleet Overview & Live Order Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Vehicles & Live Route Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Vehicles Real-time Status */}
          <Card
            title="Live Vehicle Deployment"
            subtitle="Current payload, driver allocation, and operational telemetry"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => onNavigate('fleet')}
              >
                View Full Fleet
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map(vehicle => {
                const statusConf = VEHICLE_STATUS_CONFIG[vehicle.status];
                return (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-xl bg-slate-850/70 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-100">
                            {vehicle.regNumber}
                          </span>
                          {vehicle.isRefrigerated && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                              ❄️ Reefer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{vehicle.model}</p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusConf.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                        {statusConf.label}
                      </span>
                    </div>

                    <CapacityBar
                      currentKg={vehicle.currentLoadKg}
                      maxKg={vehicle.capacityKg}
                      className="my-3"
                    />

                    <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Battery/Fuel: <strong className="text-slate-200">{vehicle.fuelPercentage}%</strong></span>
                      <span>Driver: <strong className="text-brand-400">{vehicle.assignedDriverId ? 'Assigned' : 'Unassigned'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Active Orders & Bulk Fulfillments */}
          <Card
            title="Consignments in Transit"
            subtitle="Multi-stop orders advancing through canonical state machine"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => onNavigate('tracking')}
              >
                Track All Orders
              </Button>
            }
          >
            <div className="space-y-3">
              {activeOrders.map(order => {
                const colors = ORDER_STATUS_COLORS[order.status];
                const collectedPickups = order.pickups.filter(p => p.pickupStatus === 'COLLECTED').length;
                const totalPickups = order.pickups.length;

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {order.orderNumber}
                        </span>
                        {order.isBulk && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            Bulk Aggregation
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {ORDER_STATUS_LOGISTICS_LABELS[order.status]}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-100">{order.buyerName}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {order.deliveryAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 md:text-right shrink-0">
                      <div>
                        <div className="text-xs font-semibold text-slate-300">
                          {order.totalQuantityKg.toLocaleString()} kg total
                        </div>
                        {order.isBulk && (
                          <div className="text-[11px] text-cyan-400 font-medium">
                            {collectedPickups} of {totalPickups} Pickups Done
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-0.5">ETA: {order.deliveryEta}</div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('tracking')}
                      >
                        Inspect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Exception Alerts & Operational Quick Hub */}
        <div className="space-y-6">
          {/* Active Exceptions Alert Box */}
          <Card
            title="Operational Alerts"
            subtitle="Breakdowns, traffic diversions & delays"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => onNavigate('exceptions')}
              >
                Manage
              </Button>
            }
          >
            {recentExceptions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-brand-400 mx-auto mb-2 opacity-80" />
                All routes and vehicles operating under normal parameters.
              </div>
            ) : (
              <div className="space-y-3">
                {recentExceptions.map(exc => (
                  <div
                    key={exc.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-300">{exc.incidentCode}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          exc.severity === 'HIGH' || exc.severity === 'CRITICAL'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {exc.severity} Severity
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{exc.description}</p>
                    {exc.actionTaken && (
                      <p className="text-brand-400 text-[11px] pt-1 border-t border-slate-800">
                        Action: {exc.actionTaken}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Dispatch Action Shortcuts */}
          <Card title="Quick Dispatch Actions" subtitle="Standard operating procedures">
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('pickups')}
                className="w-full p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-amber-400" />
                  Assign Vehicle to Bulk Pickup
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('routes')}
                className="w-full p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Run AI Route Optimization
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('tracking')}
                className="w-full p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verify Proof of Delivery (PoD)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('exceptions')}
                className="w-full p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Log Traffic or Vehicle Exception
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
