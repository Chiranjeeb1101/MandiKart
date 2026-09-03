import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  FileText,
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExceptionIncident } from '../types';

export const ExceptionsPage: React.FC = () => {
  const {
    exceptions,
    vehicles,
    routes,
    reportException,
    resolveException,
    reassignVehicleForRoute,
  } = useLogistics();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState<ExceptionIncident | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Report incident form state
  const [newIncident, setNewIncident] = useState({
    type: 'TRAFFIC_DELAY' as ExceptionIncident['type'],
    severity: 'MEDIUM' as ExceptionIncident['severity'],
    routeId: routes[0]?.id || '',
    description: '',
  });

  // Reassignment form state
  const [reassignData, setReassignData] = useState({
    routeId: routes[0]?.id || '',
    oldVehicleId: vehicles.find(v => v.status === 'IN_TRANSIT')?.id || vehicles[0]?.id || '',
    newVehicleId: vehicles.find(v => v.status === 'IDLE')?.id || vehicles[1]?.id || '',
    reason: 'Engine overheat and clutch failure near highway checkpost',
  });

  const [resolutionAction, setResolutionAction] = useState('');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.description) {
      alert('Please describe the exception incident.');
      return;
    }

    reportException({
      ...newIncident,
      routeId: newIncident.routeId || undefined,
    });

    setIsReportModalOpen(false);
    setNewIncident({
      type: 'TRAFFIC_DELAY',
      severity: 'MEDIUM',
      routeId: routes[0]?.id || '',
      description: '',
    });
  };

  const handleConfirmReassign = () => {
    if (!reassignData.newVehicleId || !reassignData.oldVehicleId) return;

    reassignVehicleForRoute(
      reassignData.routeId,
      reassignData.oldVehicleId,
      reassignData.newVehicleId,
      reassignData.reason
    );

    setIsReassignModalOpen(false);
  };

  const handleConfirmResolve = () => {
    if (!selectedIncidentForResolve || !resolutionAction) return;

    resolveException(selectedIncidentForResolve.id, resolutionAction);
    setSelectedIncidentForResolve(null);
    setResolutionAction('');
  };

  const filteredExceptions = exceptions.filter(exc => {
    if (statusFilter === 'OPEN' && exc.status === 'RESOLVED') return false;
    if (statusFilter === 'RESOLVED' && exc.status !== 'RESOLVED') return false;
    if (severityFilter !== 'ALL' && exc.severity !== severityFilter) return false;
    return true;
  });

  const idleVehicles = vehicles.filter(v => v.status === 'IDLE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Exception & Delay Management</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Incident Response
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Handle road breakdowns, weather delays, produce rejections, and emergency standby vehicle reassignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setIsReassignModalOpen(true)}
          >
            Emergency Vehicle Swap
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsReportModalOpen(true)}
          >
            Log Incident
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'ALL' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Incidents ({exceptions.length})
          </button>
          <button
            onClick={() => setStatusFilter('OPEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'OPEN' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active / Investigating ({exceptions.filter(e => e.status !== 'RESOLVED').length})
          </button>
          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'RESOLVED' ? 'bg-brand-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved ({exceptions.filter(e => e.status === 'RESOLVED').length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Exceptions Incident Feed */}
      <div className="space-y-4">
        {filteredExceptions.map(exc => {
          const isResolved = exc.status === 'RESOLVED';
          const severityColors = {
            CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/40',
            HIGH: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
            MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            LOW: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          }[exc.severity];

          return (
            <Card
              key={exc.id}
              className={`transition-all ${
                !isResolved ? 'border-rose-500/30 shadow-lg shadow-rose-500/5' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-100">{exc.incidentCode}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${severityColors}`}>
                      {exc.severity} SEVERITY
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {exc.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isResolved
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {exc.status}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">{exc.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>Reported: {new Date(exc.reportedAt).toLocaleString()}</span>
                    {exc.routeId && <span className="font-mono text-brand-400">Route: {exc.routeId}</span>}
                    {exc.assignedVehicleSwapId && (
                      <span className="text-cyan-400 font-semibold">
                        Standby Dispatched: {exc.assignedVehicleSwapId}
                      </span>
                    )}
                  </div>

                  {exc.actionTaken && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                      <span className="font-bold text-brand-400 block mb-0.5">Resolution Action:</span>
                      <p className="text-slate-300">{exc.actionTaken}</p>
                      {exc.resolvedAt && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          Resolved at: {new Date(exc.resolvedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!isResolved && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => {
                        setSelectedIncidentForResolve(exc);
                        setResolutionAction('');
                      }}
                    >
                      Resolve Incident
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL: LOG INCIDENT */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Log Logistics Incident / Exception"
        subtitle="Trigger notifications and operational adjustment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleCreateIncident}>
              Log Incident
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateIncident} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Incident Category</label>
              <select
                value={newIncident.type}
                onChange={e => setNewIncident({ ...newIncident, type: e.target.value as ExceptionIncident['type'] })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="TRAFFIC_DELAY">Traffic Delay / Road Congestion</option>
                <option value="VEHICLE_BREAKDOWN">Vehicle Mechanical Breakdown</option>
                <option value="FARMER_UNAVAILABLE">Farmer Unavailable at Gate</option>
                <option value="QUALITY_REJECTION">Quality / Spoilage Rejection</option>
                <option value="WEATHER_HAZARD">Weather / Road Washout Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
              <select
                value={newIncident.severity}
                onChange={e => setNewIncident({ ...newIncident, severity: e.target.value as ExceptionIncident['severity'] })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="LOW">Low (Minor Delay)</option>
                <option value="MEDIUM">Medium (Route Impact &lt; 1hr)</option>
                <option value="HIGH">High (Mechanical Issue / Reschedule)</option>
                <option value="CRITICAL">Critical (Spoilage Risk / Immediate Swap)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Impacted Route</label>
            <select
              value={newIncident.routeId}
              onChange={e => setNewIncident({ ...newIncident, routeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">General Facility / Non-Route</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.routeCode} ({r.totalDistanceKm} km)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Incident Description & Location</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Kasara Ghat road diversion caused by rain mudslide. Expecting 40 mins delay."
              value={newIncident.description}
              onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL: EMERGENCY VEHICLE SWAP */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title="Emergency Standby Vehicle Swap"
        subtitle="Transfer driver, cargo manifest, and route without data loss"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsReassignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmReassign}>
              Authorize Vehicle Reassignment
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <p className="font-semibold">Operational Emergency Protocol:</p>
            <p className="mt-0.5 text-slate-300">
              The disabled vehicle will be set to <strong className="text-rose-400">MAINTENANCE</strong>, and the standby vehicle will assume active transit status for this route.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Active Route to Reassign</label>
            <select
              value={reassignData.routeId}
              onChange={e => setReassignData({ ...reassignData, routeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.routeCode} (Assigned to {r.vehicleId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Disabled Vehicle</label>
              <select
                value={reassignData.oldVehicleId}
                onChange={e => setReassignData({ ...reassignData, oldVehicleId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.regNumber} ({v.model})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Standby Idle Vehicle</label>
              <select
                value={reassignData.newVehicleId}
                onChange={e => setReassignData({ ...reassignData, newVehicleId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {idleVehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.regNumber} ({v.capacityKg} kg cap) {v.isRefrigerated ? '❄️ Reefer' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reason for Reassignment</label>
            <input
              type="text"
              value={reassignData.reason}
              onChange={e => setReassignData({ ...reassignData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </Modal>

      {/* MODAL: RESOLVE INCIDENT */}
      <Modal
        isOpen={!!selectedIncidentForResolve}
        onClose={() => setSelectedIncidentForResolve(null)}
        title="Resolve Logistics Incident"
        subtitle={`Incident Code: ${selectedIncidentForResolve?.incidentCode}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedIncidentForResolve(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmResolve}>
              Mark as Resolved
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold">Incident Details:</span>
            <p className="text-slate-200 mt-1">{selectedIncidentForResolve?.description}</p>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Corrective Action Taken & Audit Note</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Route diverted, farmer informed of new ETA, backup vehicle arrived at farm gate."
              value={resolutionAction}
              onChange={e => setResolutionAction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
