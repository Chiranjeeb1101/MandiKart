import React, { useState } from 'react';
import {
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  User,
  ShieldCheck,
  Search,
  KeyRound,
  FileCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatusTimeline } from '../components/shared/StatusTimeline';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ORDER_STATUS_LOGISTICS_LABELS, ORDER_STATUS_COLORS } from '../constants/orderStatusLabels';
import { LogisticsOrder, OrderStatus } from '../types';

export const TrackingPage: React.FC = () => {
  const { orders, vehicles, drivers, advanceOrderStatus, verifyDeliveryOtp } = useLogistics();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // PoD Verification Modal
  const [podModalOrder, setPodModalOrder] = useState<LogisticsOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [podNotes, setPodNotes] = useState('');
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const assignedVehicle = vehicles.find(v => v.id === activeOrder?.assignedVehicleId);
  const assignedDriver = drivers.find(d => d.id === activeOrder?.assignedDriverId);

  const handleOpenPodModal = (order: LogisticsOrder) => {
    setPodModalOrder(order);
    setEnteredOtp('');
    setReceiverName(order.proofOfDelivery.receiverName || '');
    setPodNotes('');
    setVerifyMessage(null);
  };

  const handleVerifyPoD = () => {
    if (!podModalOrder) return;

    if (!enteredOtp) {
      setVerifyMessage({ type: 'error', text: 'Please enter the 4-digit buyer delivery OTP.' });
      return;
    }

    const result = verifyDeliveryOtp(podModalOrder.id, enteredOtp, receiverName, podNotes);
    if (result.success) {
      setVerifyMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        setPodModalOrder(null);
      }, 1200);
    } else {
      setVerifyMessage({ type: 'error', text: result.message });
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Multi-Stop Order Tracking & PoD</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Proof of Delivery (PoD) OTP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track consignments through the canonical order state machine and capture digital handover verification.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'ALL' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('IN_TRANSIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'IN_TRANSIT' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Transit ({orders.filter(o => o.status === 'IN_TRANSIT').length})
          </button>
          <button
            onClick={() => setStatusFilter('COLLECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'COLLECTED' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Staged at Hub ({orders.filter(o => o.status === 'COLLECTED').length})
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'DELIVERED' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'DELIVERED').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Order Number or Buyer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Main Grid: Orders List & Detailed Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredOrders.map(order => {
            const isSelected = order.id === activeOrder?.id;
            const colors = ORDER_STATUS_COLORS[order.status];
            const collectedPickups = order.pickups.filter(p => p.pickupStatus === 'COLLECTED').length;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850 border-brand-500/50 shadow-lg shadow-brand-500/5 ring-1 ring-brand-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-100">{order.orderNumber}</span>
                    {order.isBulk && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        Bulk
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {ORDER_STATUS_LOGISTICS_LABELS[order.status]}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-200 truncate">{order.buyerName}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  {order.deliveryAddress}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{order.totalQuantityKg.toLocaleString()} kg Total</span>
                  {order.isBulk && (
                    <span className="text-cyan-400 font-medium">
                      {collectedPickups}/{order.pickups.length} Picked
                    </span>
                  )}
                  <span className="text-slate-300 font-semibold">{order.deliveryEta}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Order Tracking & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeOrder ? (
            <div className="space-y-4">
              {/* Canonical State Stepper Card */}
              <Card
                title={`Live State Machine · ${activeOrder.orderNumber}`}
                subtitle="Synchronized with Master Guide §3 canonical state machine"
              >
                <StatusTimeline
                  currentStatus={activeOrder.status}
                  isBulk={activeOrder.isBulk}
                  collectedCount={activeOrder.pickups.filter(p => p.pickupStatus === 'COLLECTED').length}
                  totalCount={activeOrder.pickups.length}
                />

                {/* Status Transition Fast Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">Dispatch Controls:</span>

                  <div className="flex items-center gap-2">
                    {activeOrder.status === 'COLLECTED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Truck className="w-3.5 h-3.5" />}
                        onClick={() => advanceOrderStatus(activeOrder.id, 'IN_TRANSIT')}
                      >
                        Dispatch In-Transit to Mandi
                      </Button>
                    )}

                    {activeOrder.status === 'IN_TRANSIT' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<KeyRound className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenPodModal(activeOrder)}
                      >
                        Verify Delivery OTP (PoD)
                      </Button>
                    )}

                    {activeOrder.status === 'DELIVERED' && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" /> Delivered & Handover Verified
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Consignment & Destination Details */}
              <Card title="Consignment & Delivery Specs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-300 block">Buyer Terminal</span>
                    <p className="text-sm font-semibold text-slate-100">{activeOrder.buyerName}</p>
                    <p className="text-slate-400">{activeOrder.deliveryAddress}</p>
                    <p className="text-slate-400">Contact: {activeOrder.buyerPhone}</p>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-300 block">Assigned Fleet & Driver</span>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle:</span>
                      <strong className="text-brand-400 font-mono">
                        {assignedVehicle?.regNumber || 'Not assigned'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver:</span>
                      <strong className="text-slate-200">
                        {assignedDriver?.name || 'Not assigned'} ({assignedDriver?.phone || ''})
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Delivery:</span>
                      <strong className="text-slate-200">{activeOrder.deliveryEta}</strong>
                    </div>
                  </div>
                </div>

                {/* Proof of Delivery Summary if Delivered */}
                {activeOrder.status === 'DELIVERED' && activeOrder.proofOfDelivery.verifiedAt && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <FileCheck className="w-4 h-4" /> Proof of Delivery (PoD) Certified
                      </span>
                      <span className="text-slate-400">
                        Verified at: {new Date(activeOrder.proofOfDelivery.verifiedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-200">
                      Receiver: <strong>{activeOrder.proofOfDelivery.receiverName}</strong> (Digital signature captured)
                    </p>
                    {activeOrder.proofOfDelivery.notes && (
                      <p className="text-slate-400 italic">Notes: {activeOrder.proofOfDelivery.notes}</p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Select an order to inspect tracking details</div>
          )}
        </div>
      </div>

      {/* MODAL: PROOF OF DELIVERY (PoD) OTP VERIFICATION */}
      <Modal
        isOpen={!!podModalOrder}
        onClose={() => setPodModalOrder(null)}
        title="Proof of Delivery (PoD) Verification"
        subtitle={`Order: ${podModalOrder?.orderNumber} · Buyer: ${podModalOrder?.buyerName}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPodModalOrder(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleVerifyPoD}>
              Verify & Complete Delivery
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300">
            <p className="font-semibold flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> Secure Handover Protocol:
            </p>
            <p className="mt-1 text-slate-300">
              Enter the 4-digit OTP provided by the buyer at the wholesale delivery point to confirm handover and release the vehicle payload.
              <span className="block mt-1 font-mono text-xs text-brand-400">
                (Demo Test OTP: <strong>{podModalOrder?.proofOfDelivery.otp}</strong>)
              </span>
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              4-Digit Delivery OTP
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 7482"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Receiver Full Name / Representative
            </label>
            <input
              type="text"
              placeholder="e.g. Store Manager R. K. Mehra"
              value={receiverName}
              onChange={e => setReceiverName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Inspection Notes / Crate Condition
            </label>
            <textarea
              rows={2}
              placeholder="Zero damage reported, count confirmed."
              value={podNotes}
              onChange={e => setPodNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {verifyMessage && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                verifyMessage.type === 'error'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {verifyMessage.text}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
