import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  User,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { PICKUP_STATUS_LABELS, ORDER_STATUS_LOGISTICS_LABELS, ORDER_STATUS_COLORS } from '../constants/orderStatusLabels';
import { PickupStatus, LogisticsOrder } from '../types';

export const PickupsPage: React.FC = () => {
  const {
    orders,
    vehicles,
    drivers,
    assignVehicleAndDriver,
    updatePickupStatus,
  } = useLogistics();

  const [selectedOrder, setSelectedOrder] = useState<LogisticsOrder | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BULK' | 'RETAIL' | 'PENDING'>('ALL');

  // Farm collection verification modal
  const [verifyingPickup, setVerifyingPickup] = useState<{
    orderId: string;
    pickupId: string;
    farmerName: string;
    cropName: string;
    quantityKg: number;
    expectedToken: string;
  } | null>(null);
  const [enteredToken, setEnteredToken] = useState('');

  const handleOpenAssignModal = (order: LogisticsOrder) => {
    setSelectedOrder(order);
    // Suggest vehicle with sufficient capacity
    const suitableVehicle = vehicles.find(v => v.status === 'IDLE' && v.capacityKg >= order.totalQuantityKg) || vehicles[0];
    const availableDriver = drivers.find(d => d.status === 'AVAILABLE') || drivers[0];

    setSelectedVehicleId(suitableVehicle?.id || '');
    setSelectedDriverId(availableDriver?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedOrder || !selectedVehicleId || !selectedDriverId) return;

    const success = assignVehicleAndDriver(selectedOrder.id, selectedVehicleId, selectedDriverId);
    if (success) {
      setIsAssignModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleVerifyCollection = () => {
    if (!verifyingPickup) return;

    if (enteredToken.trim().toUpperCase() !== verifyingPickup.expectedToken) {
      alert(`Invalid Security Pickup Token! Expected: ${verifyingPickup.expectedToken}`);
      return;
    }

    updatePickupStatus(verifyingPickup.orderId, verifyingPickup.pickupId, 'COLLECTED');
    setVerifyingPickup(null);
    setEnteredToken('');
  };

  const filteredOrders = orders.filter(order => {
    if (filterType === 'BULK' && !order.isBulk) return false;
    if (filterType === 'RETAIL' && order.isBulk) return false;
    if (filterType === 'PENDING' && order.status !== 'CONFIRMED' && order.status !== 'PICKUP_SCHEDULED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOrder =
        order.orderNumber.toLowerCase().includes(q) ||
        order.buyerName.toLowerCase().includes(q) ||
        order.pickups.some(p => p.farmerName.toLowerCase().includes(q) || p.cropName.toLowerCase().includes(q));
      if (!matchOrder) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Pickup & Delivery Assignment</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" /> Multi-Stop Aggregation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch fleet vehicles to farm gates, track child pickup statuses, and aggregate produce before hub transit.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ALL' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('BULK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'BULK' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bulk Multi-Stop ({orders.filter(o => o.isBulk).length})
          </button>
          <button
            onClick={() => setFilterType('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'PENDING' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Assignment ({orders.filter(o => o.status === 'CONFIRMED').length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search crop, farmer, order..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Orders & Multi-Pickup Cards */}
      <div className="space-y-6">
        {filteredOrders.map(order => {
          const statusColors = ORDER_STATUS_COLORS[order.status];
          const assignedVehicle = vehicles.find(v => v.id === order.assignedVehicleId);
          const assignedDriver = drivers.find(d => d.id === order.assignedDriverId);
          const collectedCount = order.pickups.filter(p => p.pickupStatus === 'COLLECTED').length;
          const totalCount = order.pickups.length;
          const isAllCollected = collectedCount === totalCount && totalCount > 0;

          return (
            <div
              key={order.id}
              className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
            >
              {/* Order Parent Header */}
              <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-sm font-bold text-slate-100">{order.orderNumber}</span>
                    {order.isBulk ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Bulk Order Aggregation
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Direct Fulfillment
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                      {ORDER_STATUS_LOGISTICS_LABELS[order.status]}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{order.buyerName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {order.deliveryAddress}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:text-right">
                  <div>
                    <div className="text-xs text-slate-400">Total Produce Weight</div>
                    <div className="text-base font-extrabold text-brand-400">
                      {order.totalQuantityKg.toLocaleString()} kg
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Consignment Value</div>
                    <div className="text-sm font-bold text-slate-200">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    {!order.assignedVehicleId ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Truck className="w-4 h-4" />}
                        onClick={() => handleOpenAssignModal(order)}
                      >
                        Assign Vehicle & Driver
                      </Button>
                    ) : (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Truck className="w-3 h-3 text-brand-400" />
                          <span className="font-mono font-bold">{assignedVehicle?.regNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{assignedDriver?.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Collection Progress Banner */}
              {order.isBulk && (
                <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Multi-Farm Aggregation Progress:</span>
                    <strong className={isAllCollected ? 'text-brand-400' : 'text-cyan-400'}>
                      {collectedCount} of {totalCount} Pickups Collected ({Math.round((collectedCount / totalCount) * 100)}%)
                    </strong>
                  </div>

                  <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60 hidden sm:block">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAllCollected ? 'bg-brand-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${(collectedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Child Farmer Pickups List */}
              <div className="p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  Farm Gate Stops & Cargo Verification ({order.pickups.length} Pickups)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.pickups.map(pickup => {
                    const pickupConf = PICKUP_STATUS_LABELS[pickup.pickupStatus];
                    const isDone = pickup.pickupStatus === 'COLLECTED';

                    return (
                      <div
                        key={pickup.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${pickupConf.badgeClass}`}>
                            {pickupConf.label}
                          </span>
                          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            {pickup.pickupToken}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h5 className="text-sm font-bold text-slate-100">{pickup.cropName}</h5>
                          <div className="text-xs text-brand-400 font-semibold">
                            {pickup.quantityKg} kg · Grade {pickup.qualityGrade}
                          </div>
                          <p className="text-xs font-medium text-slate-300">{pickup.farmerName}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            {pickup.farmLocation}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                            {pickup.farmerPhone}
                          </p>
                        </div>

                        {pickup.notes && (
                          <div className="mt-2 text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                            ⚠️ {pickup.notes}
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {pickup.collectedTime ? `Collected ${pickup.collectedTime}` : `Sch: ${pickup.scheduledTime}`}
                          </span>

                          {!isDone && (
                            <div className="flex items-center gap-1.5">
                              {pickup.pickupStatus === 'PICKUP_SCHEDULED' && (
                                <button
                                  onClick={() => updatePickupStatus(order.id, pickup.id, 'PICKUP_IN_PROGRESS')}
                                  className="text-[11px] px-2 py-1 rounded bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 border border-sky-500/30 font-semibold"
                                >
                                  Approach
                                </button>
                              )}
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                                onClick={() =>
                                  setVerifyingPickup({
                                    orderId: order.id,
                                    pickupId: pickup.id,
                                    farmerName: pickup.farmerName,
                                    cropName: pickup.cropName,
                                    quantityKg: pickup.quantityKg,
                                    expectedToken: pickup.pickupToken,
                                  })
                                }
                              >
                                Verify & Collect
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ASSIGN VEHICLE & DRIVER */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Dispatch Vehicle & Driver to Order"
        subtitle={`Order: ${selectedOrder?.orderNumber} · Total Weight: ${selectedOrder?.totalQuantityKg.toLocaleString()} kg`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmAssignment}>
              Confirm Dispatch Assignment
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Select Fleet Vehicle (Capacity matching required)
            </label>
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.regNumber} — {v.model} ({v.capacityKg} kg cap, {v.status}) {v.isRefrigerated ? '❄️ Reefer' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Select Logistics Driver (Commercial License)
            </label>
            <select
              value={selectedDriverId}
              onChange={e => setSelectedDriverId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.phone}) — Status: {d.status} · Rating: {d.rating}★
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <p className="font-semibold text-slate-200">State Transition Notice:</p>
            <p className="text-slate-400">
              Confirming assignment will advance order status to{' '}
              <strong className="text-purple-400 font-mono">PICKUP_SCHEDULED</strong> and generate route pickup manifests for the driver.
            </p>
          </div>
        </div>
      </Modal>

      {/* MODAL: VERIFY PICKUP TOKEN AT FARM GATE */}
      <Modal
        isOpen={!!verifyingPickup}
        onClose={() => setVerifyingPickup(null)}
        title="Farm Gate Produce Verification & Collection"
        subtitle={`Farmer: ${verifyingPickup?.farmerName} · ${verifyingPickup?.cropName} (${verifyingPickup?.quantityKg} kg)`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setVerifyingPickup(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleVerifyCollection}>
              Confirm Handover & Load
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300">
            <p className="font-semibold">Verification Step:</p>
            <p className="mt-0.5 text-slate-300">
              Ask the farmer for their unique Pickup Security Token generated on their MandiKart Farmer App.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Enter Farmer Pickup Token (e.g. {verifyingPickup?.expectedToken})
            </label>
            <input
              type="text"
              placeholder={`Enter ${verifyingPickup?.expectedToken}`}
              value={enteredToken}
              onChange={e => setEnteredToken(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono uppercase text-sm tracking-wider focus:outline-none focus:border-brand-500"
            />
          </div>

          <p className="text-[11px] text-slate-500">
            * Once verified, this child pickup status will transition to <strong className="text-brand-400">COLLECTED</strong>. When all child stops are collected, the parent order will automatically advance to <strong className="text-cyan-400">COLLECTED</strong>.
          </p>
        </div>
      </Modal>
    </div>
  );
};
