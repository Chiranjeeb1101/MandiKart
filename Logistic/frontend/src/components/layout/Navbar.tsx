import React from 'react';
import { Truck, Bell, Shield, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateExceptions?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateExceptions }) => {
  const { metrics, exceptions } = useLogistics();
  const openAlerts = exceptions.filter(e => e.status !== 'RESOLVED');

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Truck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-100">
                  Mandi<span className="text-brand-400">Kart</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 border border-brand-500/30">
                  Logistics
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Operations & Dispatch Console · SIH 26033
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Order ID, Vehicle MH-15, Driver, or Farmer..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Right: Actions & User Role */}
        <div className="flex items-center gap-3">
          {/* Active Fleet Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span>
              <strong className="text-slate-100">{metrics.activeVehicles}</strong> / {metrics.totalVehicles} Vehicles Active
            </span>
          </div>

          {/* Exception Alert Button */}
          <button
            onClick={onNavigateExceptions}
            className={`relative p-2 rounded-lg border transition-all ${
              openAlerts.length > 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={`${openAlerts.length} Active Exceptions`}
          >
            <Bell className="w-4 h-4" />
            {openAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {openAlerts.length}
              </span>
            )}
          </button>

          {/* User Role Pill (Role-Gated per Master Guide §5) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 text-xs font-bold">
              LS
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-brand-400" />
                <span className="text-xs font-semibold text-slate-200">Logistics Staff</span>
              </div>
              <p className="text-[10px] text-slate-400">Nashik Command Hub</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
