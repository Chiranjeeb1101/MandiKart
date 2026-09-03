import React from 'react';
import {
  LayoutDashboard,
  PackageCheck,
  Truck,
  MapPin,
  Navigation,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export type TabKey = 'dashboard' | 'pickups' | 'fleet' | 'routes' | 'tracking' | 'exceptions';

export interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { metrics } = useLogistics();

  const navigationItems = [
    {
      key: 'dashboard' as TabKey,
      label: 'Operations Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      key: 'pickups' as TabKey,
      label: 'Pickup & Assignment',
      icon: <PackageCheck className="w-4 h-4" />,
      badge: metrics.pendingPickups > 0 ? `${metrics.pendingPickups} Pending` : null,
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    {
      key: 'fleet' as TabKey,
      label: 'Vehicles & Drivers',
      icon: <Truck className="w-4 h-4" />,
      badge: `${metrics.activeVehicles}/${metrics.totalVehicles}`,
      badgeColor: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    },
    {
      key: 'routes' as TabKey,
      label: 'Route Planning & Map',
      icon: <MapPin className="w-4 h-4" />,
      badge: 'AI Opt',
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    },
    {
      key: 'tracking' as TabKey,
      label: 'Order Tracking & PoD',
      icon: <Navigation className="w-4 h-4" />,
      badge: metrics.inTransitOrders > 0 ? `${metrics.inTransitOrders} In Transit` : null,
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    },
    {
      key: 'exceptions' as TabKey,
      label: 'Exception Management',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: metrics.openExceptions > 0 ? `${metrics.openExceptions} Open` : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold',
    },
  ];

  const handleSelect = (key: TabKey) => {
    onSelectTab(key);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 h-screen lg:h-[calc(100vh-57px)] w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Links */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Logistics Modules
          </div>

          {navigationItems.map(item => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border leading-tight ${
                      isActive ? 'bg-slate-950/20 text-slate-950 border-slate-950/30' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Quick Hub Status */}
        <div className="p-4 m-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              Dispatch Readiness
            </span>
            <span className="text-brand-400 font-bold">98.4%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full" style={{ width: '98.4%' }} />
          </div>

          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            All Nashik, Dindori & Niphad agri-routes operational with cold-chain monitoring.
          </p>
        </div>
      </aside>
    </>
  );
};
