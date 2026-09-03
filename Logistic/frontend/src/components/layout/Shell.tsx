import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, TabKey } from './Sidebar';

export interface ShellProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ activeTab, onSelectTab, children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNavigateExceptions={() => onSelectTab('exceptions')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
