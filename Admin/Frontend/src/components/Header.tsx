import React, { useState } from 'react';
import type { AdminUser } from '../types/admin';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  user: AdminUser;
  onOpenMobileSidebar?: () => void;
  onLogout?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenMobileSidebar, onLogout, onNavigateTab }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const notifications = [
    { id: '1', title: 'Spoilage Alert on Nagpur Route', time: '5 mins ago', type: 'risk', unread: true },
    { id: '2', title: 'New Disputed Order #MK-9399', time: '2 hours ago', type: 'dispute', unread: true },
    { id: '3', title: 'Escrow Payout of ₹1,65,000 Settled', time: '4 hours ago', type: 'success', unread: false },
    { id: '4', title: '12 New Farmer Verifications Pending', time: '1 day ago', type: 'info', unread: false },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  return (
    <header className="h-14 bg-black border-b border-white sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 text-white hover:bg-slate-900 border border-white rounded-lg transition-colors"
          aria-label="Open Mobile Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            placeholder="Search farmers, buyers, order IDs (#MK-892), or Mandis..."
            className="w-full pl-9 pr-12 py-1.5 bg-black border border-white rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-1 py-0.5 text-[10px] font-mono text-white bg-black border border-white rounded">
                ⌘K
              </kbd>
            </div>
          )}

          {/* Quick Search Dropdown Results */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white rounded-lg shadow-2xl p-3 z-50 space-y-2">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Matching Search Results for "{searchQuery}"
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchResults(false);
                    if (onNavigateTab) onNavigateTab('farmers');
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-900 border border-transparent hover:border-white text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">Ramesh Patel (Nasik Mandi)</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Verified Farmer • Tomatoes</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSearchResults(false);
                    if (onNavigateTab) onNavigateTab('orders');
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-900 border border-transparent hover:border-white text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">Order #MK-9402</span>
                    <span className="text-[10px] text-orange-400 font-semibold">In Transit • ₹87,500</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3 relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold border border-white rounded-md hover:bg-zinc-800 transition-colors"
          title={`Current Theme: ${theme.toUpperCase()} MODE. Click to toggle.`}
        >
          <span className="material-symbols-outlined text-base">
            {theme === 'dark' ? 'dark_mode' : 'light_mode'}
          </span>
          <span className="hidden sm:inline uppercase">{theme} MODE</span>
        </button>

        {/* System Health Status Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold bg-black border border-emerald-400 text-emerald-400 px-3 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>System Active</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 text-white hover:bg-slate-900 border border-white rounded-lg transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-black"></span>
          </button>

          {/* Notifications Panel Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-black border border-white rounded-xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-white pb-2">
                <span className="text-xs font-black text-white">System Alerts & Notifications</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-black border border-emerald-400 px-1.5 py-0.5 rounded">
                  2 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 bg-black border border-white/40 rounded-lg text-xs space-y-1 hover:border-white">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{n.title}</span>
                      <span className="text-[9px] text-slate-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-xs font-bold text-emerald-400 hover:underline pt-1 border-t border-white"
              >
                Close Alerts Panel
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-white hidden sm:block"></div>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg border border-white bg-black hover:bg-slate-900 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-white text-black font-black flex items-center justify-center text-xs">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-black text-white leading-tight">{user.name}</span>
              <span className="block text-[10px] text-emerald-400 font-bold">{user.role}</span>
            </div>
            <span className="material-symbols-outlined text-sm text-slate-300">expand_more</span>
          </button>

          {/* User Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white rounded-xl shadow-2xl p-3 z-50 space-y-2">
              <div className="border-b border-white pb-2">
                <p className="text-xs font-black text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-400 bg-black border border-emerald-400 px-1.5 py-0.5 rounded">
                  {user.department}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigateTab) onNavigateTab('settings');
                  }}
                  className="w-full text-left px-2 py-1.5 text-white hover:bg-slate-900 border border-transparent hover:border-white rounded flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  <span>System Settings</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2 py-1.5 text-rose-400 hover:bg-rose-950/50 border border-transparent hover:border-rose-500 rounded flex items-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

