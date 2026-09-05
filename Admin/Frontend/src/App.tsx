import React, { useState } from 'react';
import type { AdminUser, FarmerUser } from './types/admin';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FarmerDirectory } from './pages/FarmerDirectory';
import { FarmerDetail } from './pages/FarmerDetail';
import { OrdersSettlements } from './pages/OrdersSettlements';
import { DisputeResolution } from './pages/DisputeResolution';
import { LogisticsOverview } from './pages/LogisticsOverview';
import { AiIntelligence } from './pages/AiIntelligence';
import { SystemSettings } from './pages/SystemSettings';
import { PushNotifications } from './pages/PushNotifications';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>({
    id: 'adm-001',
    name: 'Rajesh Sharma',
    email: 'admin@mandikart.gov.in',
    role: 'SUPER_ADMIN',
    department: 'Platform Ops & Oversight',
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerUser | null>(null);

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedFarmer(null);
  };

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId !== 'farmers') {
      setSelectedFarmer(null);
    }
  };

  const handleSelectFarmer = (farmer: FarmerUser) => {
    setSelectedFarmer(farmer);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (selectedFarmer) {
    return (
      <FarmerDetail
        user={currentUser}
        farmer={selectedFarmer}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
        onBackToDirectory={() => setSelectedFarmer(null)}
      />
    );
  }

  if (currentTab === 'farmers') {
    return (
      <FarmerDirectory
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
        onSelectFarmer={handleSelectFarmer}
      />
    );
  }

  if (currentTab === 'orders') {
    return (
      <OrdersSettlements
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  if (currentTab === 'disputes') {
    return (
      <DisputeResolution
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  if (currentTab === 'logistics') {
    return (
      <LogisticsOverview
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  if (currentTab === 'ai-insights') {
    return (
      <AiIntelligence
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  if (currentTab === 'push-notifications') {
    return (
      <PushNotifications
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  if (currentTab === 'settings') {
    return (
      <SystemSettings
        user={currentUser}
        onLogout={handleLogout}
        onNavigateTab={handleTabChange}
      />
    );
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} onNavigateTab={handleTabChange} />;
};

export default App;
