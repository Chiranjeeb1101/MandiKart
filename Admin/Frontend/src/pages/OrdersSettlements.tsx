import React, { useState } from 'react';
import type { AdminUser } from '../types/admin';
import type { DetailedOrder, EscrowStatus } from '../types/ordersAndDisputes';
import { MOCK_ORDERS } from './OrdersAndDisputesMock';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface OrdersSettlementsProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const OrdersSettlements: React.FC<OrdersSettlementsProps> = ({
  user,
  onLogout,
  onNavigateTab,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<DetailedOrder[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);

  // Escrow Action Handler
  const handleReleaseEscrow = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          escrowStatus: 'RELEASED_TO_FARMER' as EscrowStatus,
          status: 'COMPLETED'
        };
      }
      return order;
    }));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, escrowStatus: 'RELEASED_TO_FARMER', status: 'COMPLETED' } : null);
    }
  };

  const handleRefundBuyer = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          escrowStatus: 'REFUNDED_TO_BUYER' as EscrowStatus,
          status: 'DISPUTED'
        };
      }
      return order;
    }));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, escrowStatus: 'REFUNDED_TO_BUYER', status: 'DISPUTED' } : null);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  // Calculate Metrics
  const totalVolume = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalEscrowLocked = orders
    .filter(o => o.escrowStatus === 'HELD_IN_ESCROW')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const completedSettlements = orders.filter(o => o.status === 'COMPLETED').length;
  const activeDisputes = orders.filter(o => o.status === 'DISPUTED').length;

  const getStatusBadge = (status: DetailedOrder['status']) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-emerald-950 text-emerald-400 border border-emerald-400">
            <span className="material-symbols-outlined text-sm mr-1">check_circle</span> {status}
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-rose-950 text-rose-400 border border-rose-400">
            <span className="material-symbols-outlined text-sm mr-1">warning</span> DISPUTED
          </span>
        );
      case 'IN_TRANSIT':
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-orange-950 text-orange-400 border border-orange-400">
            <span className="material-symbols-outlined text-sm mr-1">schedule</span> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
            <span className="material-symbols-outlined text-sm mr-1">inventory_2</span> {status}
          </span>
        );
    }
  };

  const getEscrowBadge = (escrow: EscrowStatus) => {
    switch (escrow) {
      case 'RELEASED_TO_FARMER':
        return (
          <span className="inline-flex items-center text-xs text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-sm mr-1">verified_user</span> RELEASED TO FARMER
          </span>
        );
      case 'REFUNDED_TO_BUYER':
        return (
          <span className="inline-flex items-center text-xs text-rose-400 font-bold">
            <span className="material-symbols-outlined text-sm mr-1">settings_backup_restore</span> REFUNDED TO BUYER
          </span>
        );
      case 'PARTIAL_SPLIT':
        return (
          <span className="inline-flex items-center text-xs text-orange-400 font-bold">
            <span className="material-symbols-outlined text-sm mr-1">call_split</span> 50/50 PARTIAL SPLIT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs text-orange-400 font-bold">
            <span className="material-symbols-outlined text-sm mr-1">lock</span> HELD IN ESCROW
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      <Sidebar
        activeTab="orders"
        onTabChange={onNavigateTab}
        onLogout={onLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1500px] w-full mx-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-white">Orders & Escrow Settlements</h1>
              <p className="text-sm text-zinc-400 mt-1">Real-time telemetry of direct produce trade transactions, payment escrow status, and automated settlements.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-xs font-mono text-emerald-400 border border-emerald-400 bg-emerald-950 px-3 py-1.5 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
                SETTLEMENT ENGINE ACTIVE
              </div>
            </div>
          </div>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black border border-white p-5 rounded-none shadow-none">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono tracking-widest uppercase">Total Gross Volume</span>
                <span className="material-symbols-outlined text-emerald-400">payments</span>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">₹{totalVolume.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +18.4% vs last week
              </div>
            </div>

            <div className="bg-black border border-white p-5 rounded-none shadow-none">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono tracking-widest uppercase">Escrow Locked Funds</span>
                <span className="material-symbols-outlined text-orange-400">lock</span>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">₹{totalEscrowLocked.toLocaleString()}</div>
              <div className="text-xs text-orange-400 mt-2 font-mono">
                Across {orders.filter(o => o.escrowStatus === 'HELD_IN_ESCROW').length} active trades
              </div>
            </div>

            <div className="bg-black border border-white p-5 rounded-none shadow-none">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono tracking-widest uppercase">Completed Settlements</span>
                <span className="material-symbols-outlined text-emerald-400">check_circle</span>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{completedSettlements}</div>
              <div className="text-xs text-zinc-400 mt-2 font-mono">
                Avg release time: 1.2 hrs
              </div>
            </div>

            <div className="bg-black border border-white p-5 rounded-none shadow-none">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono tracking-widest uppercase">Active Disputes</span>
                <span className="material-symbols-outlined text-rose-400">gavel</span>
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{activeDisputes}</div>
              <div className="text-xs text-rose-400 mt-2 font-mono">
                Requires tribunal review
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-black border border-white p-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">search</span>
              <input 
                type="text"
                placeholder="Search Order ID, Farmer, Buyer, Crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black text-white border border-white text-sm font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-zinc-400 text-sm">filter_list</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black text-white border border-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-white"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_TRANSIT">IN_TRANSIT</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>
            </div>
          </div>

          {/* Orders Main Table & Detail Split Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table */}
            <div className={`${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'} bg-black border border-white overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-white text-zinc-400 font-mono text-xs uppercase">
                      <th className="p-3">Order ID & Date</th>
                      <th className="p-3">Farmer & Buyer</th>
                      <th className="p-3">Produce Detail</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Escrow State</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredOrders.map(order => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-zinc-900/60 transition-colors ${selectedOrder?.id === order.id ? 'bg-zinc-900 border-l-4 border-l-white' : ''}`}
                      >
                        <td className="p-3 font-mono">
                          <div className="text-white font-bold">{order.id}</div>
                          <div className="text-xs text-zinc-400">{order.timestamp.split('T')[0]}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-white font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-emerald-400">person</span> {order.farmerName}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-zinc-500">store</span> {order.buyerName}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-white font-medium">{order.cropName}</div>
                          <div className="text-xs text-zinc-400 font-mono">{order.quantityKg} kg @ ₹{order.pricePerKg}/kg</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-white">
                          ₹{order.totalPrice.toLocaleString()}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-3 font-mono">
                          {getEscrowBadge(order.escrowStatus)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 text-xs border border-white hover:bg-white hover:text-black font-mono transition-colors inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">visibility</span> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                          No transactions matched the specified search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Detail Drawer Panel */}
            {selectedOrder && (
              <div className="bg-black border border-white p-5 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white pb-3">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 uppercase">Selected Order Telemetry</span>
                      <h3 className="text-xl font-black text-white">{selectedOrder.id}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="text-zinc-400 hover:text-white text-xs font-mono border border-zinc-700 px-2 py-1"
                    >
                      [CLOSE]
                    </button>
                  </div>

                  {/* Status Overview */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono border border-zinc-800 p-3 bg-zinc-950">
                    <div>
                      <span className="text-zinc-500 block">TRADE STATUS</span>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">ESCROW TELEMETRY</span>
                      <div className="mt-1">{getEscrowBadge(selectedOrder.escrowStatus)}</div>
                    </div>
                  </div>

                  {/* Trade Parties */}
                  <div className="space-y-3 border-b border-zinc-800 pb-4">
                    <h4 className="text-xs font-mono uppercase text-zinc-400">Transaction Counterparties</h4>
                    <div className="bg-zinc-950 border border-zinc-800 p-3 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Seller (Farmer):</span>
                        <span className="text-white font-bold">{selectedOrder.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Location:</span>
                        <span className="text-zinc-300">{selectedOrder.farmerLocation}</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-800 pt-2">
                        <span className="text-zinc-400">Buyer:</span>
                        <span className="text-white font-bold">{selectedOrder.buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Location:</span>
                        <span className="text-zinc-300">{selectedOrder.buyerLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality & Logistics */}
                  <div className="space-y-3 border-b border-zinc-800 pb-4">
                    <h4 className="text-xs font-mono uppercase text-zinc-400">Quality & Logistics Protocol</h4>
                    <div className="bg-zinc-950 border border-zinc-800 p-3 text-xs space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Quality Grade:</span>
                        <span className="text-emerald-400 font-bold">{selectedOrder.qualityGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Logistics Carrier:</span>
                        <span className="text-white">{selectedOrder.logisticsPartner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Tracking Code:</span>
                        <span className="text-white">{selectedOrder.logisticsTrackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Delivery Est:</span>
                        <span className="text-orange-400">{selectedOrder.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakup */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase text-zinc-400">Financial Ledger</h4>
                    <div className="bg-zinc-950 border border-zinc-800 p-3 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Base Goods Value:</span>
                        <span className="text-white">₹{(selectedOrder.totalPrice * 0.95).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">MandiKart Admin Fee (2%):</span>
                        <span className="text-emerald-400">₹{(selectedOrder.totalPrice * 0.02).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Logistics Escrow (3%):</span>
                        <span className="text-white">₹{(selectedOrder.totalPrice * 0.03).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-zinc-800 pt-2 text-sm">
                        <span className="text-zinc-300">Total Escrow Value:</span>
                        <span className="text-white">₹{selectedOrder.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Override Action Buttons */}
                <div className="pt-4 border-t border-white space-y-2">
                  <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">Escrow Admin Controls</span>
                  
                  {selectedOrder.escrowStatus === 'HELD_IN_ESCROW' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleReleaseEscrow(selectedOrder.id)}
                        className="w-full py-2 bg-emerald-950 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black font-mono text-xs font-bold uppercase transition-colors"
                      >
                        Release to Farmer
                      </button>
                      <button 
                        onClick={() => handleRefundBuyer(selectedOrder.id)}
                        className="w-full py-2 bg-rose-950 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black font-mono text-xs font-bold uppercase transition-colors"
                      >
                        Refund to Buyer
                      </button>
                    </div>
                  )}

                  {(selectedOrder.escrowStatus === 'RELEASED_TO_FARMER' || selectedOrder.escrowStatus === 'REFUNDED_TO_BUYER') && (
                    <div className="bg-zinc-900 border border-zinc-700 p-3 text-center text-xs font-mono text-zinc-400">
                      Settlement Finalized — Escrow immutable ledger sealed.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
