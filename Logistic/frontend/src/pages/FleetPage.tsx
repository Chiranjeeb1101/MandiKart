import React, { useState } from 'react';
import {
  Truck,
  User,
  Plus,
  Phone,
  Award,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Filter,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CapacityBar } from '../components/ui/CapacityBar';
import { VEHICLE_STATUS_CONFIG, DRIVER_STATUS_CONFIG } from '../constants/orderStatusLabels';
import { Vehicle, Driver, VehicleStatus, DriverStatus } from '../types';

export const FleetPage: React.FC = () => {
  const {
    vehicles,
    drivers,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    toggleDriverStatus,
  } = useLogistics();

  const [activeSubTab, setActiveSubTab] = useState<'VEHICLES' | 'DRIVERS'>('VEHICLES');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  // New Vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    regNumber: '',
    model: '',
    type: 'Maxi Truck (2.5T)' as Vehicle['type'],
    capacityKg: 2500,
    fuelPercentage: 100,
    status: 'IDLE' as VehicleStatus,
    isRefrigerated: false,
    currentLat: 19.9975,
    currentLng: 73.7898,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
  });

  // New Driver form state
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    rating: 4.8,
    status: 'AVAILABLE' as DriverStatus,
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.regNumber || !newVehicle.model) {
      alert('Please fill in Registration Number and Model.');
      return;
    }

    addVehicle({
      ...newVehicle,
      currentLoadKg: 0,
    });

    setIsAddVehicleOpen(false);
    setNewVehicle({
      regNumber: '',
      model: '',
      type: 'Maxi Truck (2.5T)',
      capacityKg: 2500,
      fuelPercentage: 100,
      status: 'IDLE',
      isRefrigerated: false,
      currentLat: 19.9975,
      currentLng: 73.7898,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) {
      alert('Please fill in Driver Name and Phone number.');
      return;
    }

    addDriver(newDriver);
    setIsAddDriverOpen(false);
    setNewDriver({
      name: '',
      phone: '',
      licenseNumber: '',
      rating: 4.8,
      status: 'AVAILABLE',
    });
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = vehicleFilter === 'ALL' || v.status === vehicleFilter;
    const matchesSearch =
      v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredDrivers = drivers.filter(d => {
    return (
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Fleet & Driver Management</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Logistics Role Authorized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Maintain vehicle fleet records, payload capacities, cold-chain refrigeration, and on-duty drivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'VEHICLES' ? (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddVehicleOpen(true)}
            >
              Add Vehicle
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddDriverOpen(true)}
            >
              Add Driver
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('VEHICLES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'VEHICLES'
                ? 'bg-brand-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveSubTab('DRIVERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'DRIVERS'
                ? 'bg-brand-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Drivers ({drivers.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'VEHICLES' && (
            <select
              value={vehicleFilter}
              onChange={e => setVehicleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="IDLE">Idle / Available</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* VEHICLES TAB */}
      {activeSubTab === 'VEHICLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map(vehicle => {
            const statusConf = VEHICLE_STATUS_CONFIG[vehicle.status];
            const assignedDriver = drivers.find(d => d.id === vehicle.assignedDriverId);

            return (
              <Card key={vehicle.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-100">
                        {vehicle.regNumber}
                      </span>
                      {vehicle.isRefrigerated && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          ❄️ Cold Chain
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{vehicle.model}</p>
                    <p className="text-[11px] text-slate-500">{vehicle.type}</p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusConf.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                    {statusConf.label}
                  </span>
                </div>

                <CapacityBar
                  currentKg={vehicle.currentLoadKg}
                  maxKg={vehicle.capacityKg}
                  className="my-2"
                />

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Battery / Fuel:</span>
                    <strong className="text-slate-200">{vehicle.fuelPercentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Driver:</span>
                    <strong className="text-brand-400">
                      {assignedDriver ? assignedDriver.name : 'None (Available)'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Last Inspection:</span>
                    <span className="text-slate-400">{vehicle.lastMaintenanceDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <select
                    value={vehicle.status}
                    onChange={e => updateVehicle(vehicle.id, { status: e.target.value as VehicleStatus })}
                    className="text-xs bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-brand-500"
                  >
                    <option value="IDLE">Set Idle</option>
                    <option value="ASSIGNED">Set Assigned</option>
                    <option value="IN_TRANSIT">Set In-Transit</option>
                    <option value="MAINTENANCE">Set Maintenance</option>
                  </select>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      if (confirm(`Delete vehicle ${vehicle.regNumber}?`)) {
                        deleteVehicle(vehicle.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* DRIVERS TAB */}
      {activeSubTab === 'DRIVERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map(driver => {
            const statusConf = DRIVER_STATUS_CONFIG[driver.status];
            const assignedVehicle = vehicles.find(v => v.id === driver.assignedVehicleId);

            return (
              <Card key={driver.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={driver.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                    alt={driver.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100 truncate">{driver.name}</h4>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        ★ {driver.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {driver.phone}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                      {driver.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Duty Status:</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${statusConf.badge}`}>
                      {statusConf.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Assignment:</span>
                    <strong className="text-brand-400">
                      {assignedVehicle ? assignedVehicle.regNumber : 'Standby / Unassigned'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Farm Trips:</span>
                    <strong className="text-slate-200">{driver.totalTrips} Completed</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDriverStatus(driver.id)}
                  >
                    Toggle Duty Status
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD VEHICLE */}
      <Modal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        title="Register New Fleet Vehicle"
        subtitle="Logistics role: Add new vehicle to the MandiKart dispatch registry"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddVehicleOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateVehicle}>
              Save Vehicle
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Registration Number (e.g. MH 15 AB 1234)</label>
            <input
              type="text"
              required
              placeholder="MH 15 XX 0000"
              value={newVehicle.regNumber}
              onChange={e => setNewVehicle({ ...newVehicle, regNumber: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Make & Model</label>
              <input
                type="text"
                required
                placeholder="Tata Ace Gold / Bolero Maxi"
                value={newVehicle.model}
                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle Classification</label>
              <select
                value={newVehicle.type}
                onChange={e => {
                  const type = e.target.value as Vehicle['type'];
                  let capacity = 2500;
                  if (type === 'Mini Truck (1.5T)') capacity = 1500;
                  if (type === 'Heavy Hauler (4.0T)') capacity = 4000;
                  if (type === 'Refrigerated Reefer (3.0T)') capacity = 3000;
                  setNewVehicle({ ...newVehicle, type, capacityKg: capacity });
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Mini Truck (1.5T)">Mini Truck (1.5T)</option>
                <option value="Maxi Truck (2.5T)">Maxi Truck (2.5T)</option>
                <option value="Heavy Hauler (4.0T)">Heavy Hauler (4.0T)</option>
                <option value="Refrigerated Reefer (3.0T)">Refrigerated Reefer (3.0T)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payload Capacity (kg)</label>
              <input
                type="number"
                value={newVehicle.capacityKg}
                onChange={e => setNewVehicle({ ...newVehicle, capacityKg: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fuel / Battery Level (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={newVehicle.fuelPercentage}
                onChange={e => setNewVehicle({ ...newVehicle, fuelPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="reeferCheck"
              checked={newVehicle.isRefrigerated}
              onChange={e => setNewVehicle({ ...newVehicle, isRefrigerated: e.target.checked })}
              className="rounded border-slate-800 text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="reeferCheck" className="text-slate-300 text-xs font-semibold cursor-pointer">
              Equipped with Active Cold-Chain Refrigeration (4°C – 8°C for perishables)
            </label>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD DRIVER */}
      <Modal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        title="Enroll Qualified Logistics Driver"
        subtitle="Logistics role: Add driver with commercial license credentials"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddDriverOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateDriver}>
              Enroll Driver
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDriver} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patil"
              value={newDriver.name}
              onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 98XXX XXXXX"
                value={newDriver.phone}
                onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Commercial Driver License</label>
              <input
                type="text"
                required
                placeholder="MH-15-202X-00XXXXX"
                value={newDriver.licenseNumber}
                onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 uppercase font-mono"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
