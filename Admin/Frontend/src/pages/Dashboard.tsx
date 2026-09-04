import React, { useState } from 'react';
import type { AdminUser, KpiMetric, OrderSummary, AiInsight, RegionalActivity } from '../types/admin';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KpiCard } from '../components/KpiCard';
import { RecentOrdersTable } from '../components/RecentOrdersTable';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { GeoActivityCard } from '../components/GeoActivityCard';

interface DashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock KPI Metrics
  const kpis: KpiMetric[] = [
    {
      id: 'kpi-1',
      label: 'Gross Market Volume',
      value: '₹1.48 Cr',
      change: '+14.2%',
      isPositive: true,
      period: 'last month',
      iconName: 'payments',
    },
    {
      id: 'kpi-2',
      label: 'Verified Farmers',
      value: '1,420',
      change: '+8.6%',
      isPositive: true,
      period: 'last month',
      iconName: 'agriculture',
    },
    {
      id: 'kpi-3',
      label: 'Active Orders',
      value: '342',
      change: '+18.4%',
      isPositive: true,
      period: 'last month',
      iconName: 'shopping_cart',
    },
    {
      id: 'kpi-4',
      label: 'Spoilage Risk Rate',
      value: '0.8%',
      change: '-4.1%',
      isPositive: true,
      period: 'last month',
      iconName: 'eco',
    },
  ];

  // Mock Orders
  const recentOrders: OrderSummary[] = [
    {
      id: 'ord-1',
      orderNumber: '#MK-9402',
      farmerName: 'Ramesh Patel (Nasik Mandi)',
      buyerName: 'BigBasket Bulk Ops',
      produceName: 'Tomatoes (Hybrid Grade A)',
      quantityKg: 2500,
      totalAmount: 87500,
      status: 'IN_TRANSIT',
      timestamp: '10 mins ago',
    },
    {
      id: 'ord-2',
      orderNumber: '#MK-9401',
      farmerName: 'Gurpreet Singh (Ludhiana Mandi)',
      buyerName: 'Punjab Organic Retails',
      produceName: 'Wheat (Sharbati Gold)',
      quantityKg: 5000,
      totalAmount: 165000,
      status: 'PICKUP_SCHEDULED',
      timestamp: '25 mins ago',
    },
    {
      id: 'ord-3',
      orderNumber: '#MK-9400',
      farmerName: 'Anita Devi (Patna Mandi)',
      buyerName: 'FreshCart Direct Consumer',
      produceName: 'Potato (Jyoti Fresh)',
      quantityKg: 1200,
      totalAmount: 31200,
      status: 'COMPLETED',
      timestamp: '1 hour ago',
    },
    {
      id: 'ord-4',
      orderNumber: '#MK-9399',
      farmerName: 'Suresh Kumar (Nagpur Mandi)',
      buyerName: 'AgroExport Co-Op',
      produceName: 'Oranges (Nagpur Grade 1)',
      quantityKg: 800,
      totalAmount: 56000,
      status: 'DISPUTED',
      timestamp: '2 hours ago',
    },
    {
      id: 'ord-5',
      orderNumber: '#MK-9398',
      farmerName: 'Vikram Jadhav (Pune Mandi)',
      buyerName: 'Hotel Taj Procurement',
      produceName: 'Onion (Red Nashik)',
      quantityKg: 3000,
      totalAmount: 75000,
      status: 'DELIVERED',
      timestamp: '3 hours ago',
    },
  ];

  // Mock AI Insights
  const aiInsights: AiInsight[] = [
    {
      id: 'ai-1',
      title: 'Spoilage Alert: Transport Truck #LOD-402',
      description: 'Reefer container temp spiked to 24°C on Nagpur → Mumbai route. Spoilage risk for 800kg Oranges.',
      severity: 'HIGH',
      recommendedAction: 'Reroute to Cold Storage Hub (Thane #2)',
      category: 'SPOILAGE_RISK',
      timestamp: '5m ago',
    },
    {
      id: 'ai-2',
      title: 'Price Volatility: Tomato Crop Forecast',
      description: 'Heavy rains in Kolar & Nashik expected to reduce arrivals by 18%. Price surge of +12% forecasted for Delhi-NCR.',
      severity: 'MEDIUM',
      recommendedAction: 'Notify wholesale buyers to pre-book',
      category: 'PRICE_VOLATILITY',
      timestamp: '18m ago',
    },
  ];

  // Mock Regional Data
  const regionalActivity: RegionalActivity[] = [
    { region: 'West Zone', state: 'Maharashtra & Gujarat', activeFarmers: 580, activeBuyers: 320, volumeTons: 650, healthScore: 94 },
    { region: 'North Zone', state: 'Punjab & Haryana', activeFarmers: 490, activeBuyers: 210, volumeTons: 820, healthScore: 91 },
    { region: 'East Zone', state: 'Bihar & West Bengal', activeFarmers: 350, activeBuyers: 180, volumeTons: 410, healthScore: 88 },
  ];

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          if (onNavigateTab) {
            onNavigateTab(tabId);
          }
        }}
        onLogout={onLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1500px] w-full mx-auto">
          {/* Clean Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Real-time operational visibility across direct trading, logistics, and dispute cases.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-white border border-white rounded-lg text-xs font-bold transition-colors">
                Export Audit Report
              </button>
              <button className="px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-extrabold transition-colors shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Action Item</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} metric={kpi} />
            ))}
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentOrdersTable orders={recentOrders} />
            </div>

            <div className="space-y-6">
              <AiInsightsCard insights={aiInsights} />
              <GeoActivityCard regions={regionalActivity} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


