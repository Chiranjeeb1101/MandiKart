import React from 'react';
import type { AdminUser } from '../types/admin';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  user: AdminUser;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme();

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
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </div>
          <input
            type="text"
            placeholder="Search farmers, buyers, order IDs (#MK-892), or Mandis..."
            className="w-full pl-9 pr-12 py-1.5 bg-black border border-white rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1 py-0.5 text-[10px] font-mono text-white bg-black border border-white rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button (Light/Dark Mode) */}
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

        {/* System Health Status Badge - Green */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold bg-black border border-emerald-400 text-emerald-400 px-3 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>System Active</span>
        </div>

        {/* Notification Alert - Orange Dot */}
        <button className="p-1.5 text-white hover:bg-slate-900 border border-white rounded-lg transition-colors relative" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-black"></span>
        </button>

        <div className="h-5 w-px bg-white hidden sm:block"></div>

        {/* User Badge */}
        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg border border-white bg-black hover:bg-slate-900 transition-colors">
          <div className="w-7 h-7 rounded-full bg-white text-black font-black flex items-center justify-center text-xs">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-black text-white leading-tight">{user.name}</span>
            <span className="block text-[10px] text-emerald-400 font-bold">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
