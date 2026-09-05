import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'farmers', label: 'Farmer Directory', icon: 'agriculture', badge: '1', badgeType: 'info' },
    { id: 'orders', label: 'Orders & Settlements', icon: 'receipt_long' },
    { id: 'disputes', label: 'Dispute Resolution', icon: 'gavel', badge: '1 Open', badgeType: 'warning' },
    { id: 'logistics', label: 'Logistics Overview', icon: 'local_shipping' },
    { id: 'ai-insights', label: 'AI Intelligence', icon: 'psychology', badge: 'Live', badgeType: 'success' },
    { id: 'push-notifications', label: 'Push Notifications', icon: 'campaign', badge: 'Broadcast', badgeType: 'success' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black border-r border-white py-5 text-white">
      {/* Brand Header */}
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-extrabold shadow-sm">
            <span className="material-symbols-outlined fill text-lg">eco</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white tracking-tight">MandiKart</span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-black px-1.5 py-0.5 rounded border border-emerald-400">
              Admin
            </span>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-white hover:bg-slate-900 border border-white p-1 rounded"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 sidebar-scroll overflow-y-auto">
        <div className="px-2.5 pb-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Platform Operations
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold text-xs transition-colors duration-150 border ${
                isActive
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'text-white border-transparent hover:border-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-lg ${
                  isActive ? 'text-black fill' : 'text-slate-300'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    item.badgeType === 'warning'
                      ? 'bg-black text-orange-400 border border-orange-400'
                      : item.badgeType === 'success'
                      ? 'bg-black text-emerald-400 border border-emerald-400'
                      : isActive
                      ? 'bg-black text-white border border-black'
                      : 'bg-black text-slate-300 border border-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Sign Out */}
      <div className="px-4 pt-4 mt-auto border-t border-white space-y-2">
        <div className="px-3 py-2 bg-black rounded-lg border border-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">Database Engine</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-emerald-400">v2.4.1</span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white border border-rose-500 hover:bg-rose-950/80 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-rose-400">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[260px] h-screen sticky top-0 left-0 z-40 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-[260px] max-w-[80vw] h-full bg-black border-r border-white z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};



