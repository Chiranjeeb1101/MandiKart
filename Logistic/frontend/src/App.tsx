import React, { useState } from 'react';
import { LogisticsProvider } from './context/LogisticsContext';
import { Shell } from './components/layout/Shell';
import { TabKey } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { PickupsPage } from './pages/PickupsPage';
import { FleetPage } from './pages/FleetPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { TrackingPage } from './pages/TrackingPage';
import { ExceptionsPage } from './pages/ExceptionsPage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <Shell activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
      {activeTab === 'pickups' && <PickupsPage />}
      {activeTab === 'fleet' && <FleetPage />}
      {activeTab === 'routes' && <RoutePlannerPage />}
      {activeTab === 'tracking' && <TrackingPage />}
      {activeTab === 'exceptions' && <ExceptionsPage />}
    </Shell>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
