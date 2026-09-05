import React, { useState } from 'react';
import type { AdminUser, KpiMetric, OrderSummary, AiInsight, RegionalActivity } from '../types/admin';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KpiCard } from '../components/KpiCard';
import { RecentOrdersTable } from '../components/RecentOrdersTable';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { GeoActivityCard } from '../components/GeoActivityCard';
import { PushNotificationModal } from '../components/PushNotificationModal';

interface DashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [showActionItemModal, setShowActionItemModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [selectedAiInsight, setSelectedAiInsight] = useState<AiInsight | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States for Action Item
  const [actionTitle, setActionTitle] = useState('');
  const [actionDept, setActionDept] = useState('Logistics');
  const [actionPriority, setActionPriority] = useState('HIGH');
  const [actionNotes, setActionNotes] = useState('');

  // Form State for Export
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Mock KPI Metrics
  const kpis: KpiMetric[] = [
    {
      id: 'kpi-1',
      label: 'Gross Market Volume',
      value: '₹1',
      change: '+1%',
      isPositive: true,
      period: 'last month',
      iconName: 'payments',
    },
    {
      id: 'kpi-2',
      label: 'Verified Farmers',
      value: '1',
      change: '+1%',
      isPositive: true,
      period: 'last month',
      iconName: 'agriculture',
    },
    {
      id: 'kpi-3',
      label: 'Active Orders',
      value: '1',
      change: '+1%',
      isPositive: true,
      period: 'last month',
      iconName: 'shopping_cart',
    },
    {
      id: 'kpi-4',
      label: 'Spoilage Risk Rate',
      value: '1%',
      change: '-1%',
      isPositive: true,
      period: 'last month',
      iconName: 'eco',
    },
  ];

  // Mock Orders
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([
    {
      id: 'ord-1',
      orderNumber: '#MK-9402',
      farmerName: 'Ramesh Patel (Nasik Mandi)',
      buyerName: 'BigBasket Bulk Ops',
      produceName: 'Tomatoes (Hybrid Grade A)',
      quantityKg: 1,
      totalAmount: 1,
      status: 'IN_TRANSIT',
      timestamp: '10 mins ago',
    },
  ]);

  // Mock AI Insights
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([
    {
      id: 'ai-1',
      title: 'Spoilage Alert: Transport Truck #LOD-402',
      description: 'Reefer container temp spiked to 24°C on Nagpur → Mumbai route. Spoilage risk for 1kg Oranges.',
      severity: 'HIGH',
      recommendedAction: 'Reroute to Cold Storage Hub (Thane #2)',
      category: 'SPOILAGE_RISK',
      timestamp: '5m ago',
    },
  ]);

  // Mock Regional Data
  const regionalActivity: RegionalActivity[] = [
    { region: 'West Zone', state: 'Maharashtra & Gujarat', activeFarmers: 1, activeBuyers: 1, volumeTons: 1, healthScore: 99 },
  ];

  // Handler for Exporting CSV/JSON Audit File
  const handleDownloadExport = () => {
    if (exportFormat === 'csv') {
      const headers = ['Order ID', 'Farmer', 'Buyer', 'Produce', 'Quantity (kg)', 'Amount (INR)', 'Status', 'Timestamp'];
      const rows = recentOrders.map((o) => [
        o.orderNumber,
        `"${o.farmerName}"`,
        `"${o.buyerName}"`,
        `"${o.produceName}"`,
        o.quantityKg,
        o.totalAmount,
        o.status,
        o.timestamp,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `MandiKart_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(recentOrders, null, 2))}`;
      const link = document.createElement('a');
      link.setAttribute('href', jsonString);
      link.setAttribute('download', `MandiKart_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowExportModal(false);
    triggerToast(`Audit report downloaded successfully in ${exportFormat.toUpperCase()} format!`);
  };

  // Handler for Creating Action Item
  const handleCreateActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;
    setShowActionItemModal(false);
    triggerToast(`Action Item "${actionTitle}" created & dispatched to ${actionDept} team!`);
    setActionTitle('');
    setActionNotes('');
  };

  // Handler for Executing AI Recommendation
  const handleExecuteAiAction = (insight: AiInsight) => {
    setSelectedAiInsight(insight);
  };

  const confirmAiAction = () => {
    if (selectedAiInsight) {
      setAiInsights((prev) => prev.filter((i) => i.id !== selectedAiInsight.id));
      triggerToast(`Executed: "${selectedAiInsight.recommendedAction}"`);
      setSelectedAiInsight(null);
    }
  };

  const handleKpiClick = (kpiId: string) => {
    if (!onNavigateTab) return;
    if (kpiId === 'kpi-1' || kpiId === 'kpi-3') {
      onNavigateTab('orders');
    } else if (kpiId === 'kpi-2') {
      onNavigateTab('farmers');
    } else if (kpiId === 'kpi-4') {
      onNavigateTab('ai-insights');
    }
  };

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
        <Header
          user={user}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          onNavigateTab={onNavigateTab}
        />

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

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowPushModal(true)}
                className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">campaign</span>
                <span>Push App Alert</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-white border border-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Audit Report</span>
              </button>
              <button
                onClick={() => setShowActionItemModal(true)}
                className="px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-extrabold transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Action Item</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} metric={kpi} onClick={() => handleKpiClick(kpi.id)} />
            ))}
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentOrdersTable
                orders={recentOrders}
                onViewAllOrders={() => onNavigateTab?.('orders')}
                onSelectOrder={(order) => setSelectedOrder(order)}
              />
            </div>

            <div className="space-y-6">
              <AiInsightsCard
                insights={aiInsights}
                onExecuteAction={handleExecuteAiAction}
                onOpenWorkbench={() => onNavigateTab?.('ai-insights')}
              />
              <GeoActivityCard
                regions={regionalActivity}
                onOpenGeoMap={() => onNavigateTab?.('logistics')}
              />
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL 1: Export Audit Report ── */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">file_download</span>
                <span>Export Platform Audit Report</span>
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Generate an aggregated transaction audit file containing recent trade settlements, order statuses, and mandi volume breakdowns.
              </p>
              <div className="space-y-1.5">
                <label className="font-extrabold text-white block">File Format</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="accent-emerald-400"
                    />
                    <span>CSV (Spreadsheet)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                      className="accent-emerald-400"
                    />
                    <span>JSON (API Spec)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-black border border-white hover:bg-slate-900 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadExport}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg text-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Create Action Item ── */}
      {showActionItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateActionItem} className="bg-black border border-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">playlist_add</span>
                <span>Create Admin Action Item</span>
              </h3>
              <button type="button" onClick={() => setShowActionItemModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-white block mb-1">Title / Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="e.g. Inspect cold-storage temp logs for Nagpur shipment"
                  className="w-full bg-black border border-white rounded-lg p-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-white block mb-1">Assigned Department</label>
                  <select
                    value={actionDept}
                    onChange={(e) => setActionDept(e.target.value)}
                    className="w-full bg-black border border-white rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="Logistics">Logistics & Fleet</option>
                    <option value="Dispute Ops">Dispute Resolution</option>
                    <option value="Farmer Verification">Farmer Verification</option>
                    <option value="Finance">Finance & Settlements</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-white block mb-1">Priority</label>
                  <select
                    value={actionPriority}
                    onChange={(e) => setActionPriority(e.target.value)}
                    className="w-full bg-black border border-white rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="HIGH">HIGH (Urgent)</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-white block mb-1">Operational Notes & Directives</label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Additional context or instructions for field ops team..."
                  className="w-full bg-black border border-white rounded-lg p-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white">
              <button
                type="button"
                onClick={() => setShowActionItemModal(false)}
                className="px-4 py-2 bg-black border border-white hover:bg-slate-900 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black hover:bg-slate-200 font-extrabold rounded-lg text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Dispatch Action Item</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL 3: Order Details View ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white pb-3">
              <div>
                <span className="text-xs font-mono font-black text-emerald-400">{selectedOrder.orderNumber}</span>
                <h3 className="text-base font-black text-white">Order Transaction Detail</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-white/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller / Farmer:</span>
                  <span className="font-extrabold text-white">{selectedOrder.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Buyer / Recipient:</span>
                  <span className="font-bold text-slate-200">{selectedOrder.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Produce:</span>
                  <span className="font-bold text-white">{selectedOrder.produceName} ({selectedOrder.quantityKg} kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Settlement Value:</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-white/30 pt-2">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-extrabold uppercase text-orange-400">{selectedOrder.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  if (onNavigateTab) onNavigateTab('disputes');
                }}
                className="px-3 py-1.5 bg-black border border-rose-500 text-rose-400 hover:bg-rose-950 rounded-lg text-xs font-bold"
              >
                Flag Dispute
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1.5 bg-black border border-white hover:bg-slate-900 rounded-lg text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const ordId = selectedOrder.id;
                    setRecentOrders((prev) => prev.map((o) => (o.id === ordId ? { ...o, status: 'COMPLETED' } : o)));
                    triggerToast(`Order ${selectedOrder.orderNumber} payout approved & settled!`);
                    setSelectedOrder(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold rounded-lg text-xs"
                >
                  Approve Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Confirm AI Action Execution ── */}
      {selectedAiInsight && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">psychology</span>
                <span>Execute AI Recommendation</span>
              </h3>
              <button onClick={() => setSelectedAiInsight(null)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-white/40 rounded-lg space-y-1.5">
                <p className="font-bold text-white">{selectedAiInsight.title}</p>
                <p className="text-slate-300">{selectedAiInsight.description}</p>
              </div>
              <div className="p-2.5 bg-black border border-orange-500 text-orange-400 rounded-lg">
                <p className="font-extrabold">Action to Dispatch:</p>
                <p className="font-bold">{selectedAiInsight.recommendedAction}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white">
              <button
                onClick={() => setSelectedAiInsight(null)}
                className="px-4 py-2 bg-black border border-white hover:bg-slate-900 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmAiAction}
                className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold rounded-lg text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Execute Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Broadcast Modal */}
      <PushNotificationModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        onSendSuccess={(payload) => {
          setToastMessage(`Push alert "${payload.title}" broadcasted to ${payload.recipientCount} devices!`);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* ── TOAST NOTIFICATION OVERLAY ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white border border-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-xs font-bold leading-snug">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};



