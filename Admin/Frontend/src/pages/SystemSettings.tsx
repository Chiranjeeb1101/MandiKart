import React, { useState } from 'react';
import type { AdminUser } from '../types/admin';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface SystemSettingsProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
}

interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'DISPUTE_MANAGER' | 'LOGISTICS_AUDITOR';
  department: string;
  status: 'ACTIVE' | 'PENDING';
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  user,
  onLogout,
  onNavigateTab,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Settings State
  const [escrowAutoReleaseHours, setEscrowAutoReleaseHours] = useState<number>(24);
  const [aiPriceAutoSync, setAiPriceAutoSync] = useState<boolean>(true);
  const [tempAlertVariance, setTempAlertVariance] = useState<number>(2.0);
  const [mandatoryQualityAssay, setMandatoryQualityAssay] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  // Saved Alert State
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Admin Team Members State
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([
    {
      id: 'adm-001',
      name: 'Rajesh Sharma',
      email: 'admin@mandikart.gov.in',
      role: 'SUPER_ADMIN',
      department: 'Platform Ops & Oversight',
      status: 'ACTIVE',
    },
    {
      id: 'adm-002',
      name: 'Priya Nair',
      email: 'priya.nair@mandikart.gov.in',
      role: 'DISPUTE_MANAGER',
      department: 'Legal & Arbitration Tribunal',
      status: 'ACTIVE',
    },
    {
      id: 'adm-003',
      name: 'Amit Patel',
      email: 'amit.patel@mandikart.gov.in',
      role: 'LOGISTICS_AUDITOR',
      department: 'Cold-Chain Telemetry',
      status: 'ACTIVE',
    },
  ]);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminTeamMember['role']>('LOGISTICS_AUDITOR');

  const handleSaveSettings = () => {
    setSaveSuccessMsg('System configuration settings updated successfully. Applied to MandiEngine gateway.');
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    const newMember: AdminTeamMember = {
      id: `adm-00${teamMembers.length + 1}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      department: newAdminRole === 'DISPUTE_MANAGER' ? 'Legal & Arbitration' : 'Operations',
      status: 'ACTIVE',
    };

    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteModal(false);
    setNewAdminName('');
    setNewAdminEmail('');
    setSaveSuccessMsg(`New admin user ${newAdminName} onboarded with role ${newAdminRole}.`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      <Sidebar
        activeTab="settings"
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
              <h1 className="text-2xl font-black uppercase tracking-wider text-white">System Settings & Engine Gateway</h1>
              <p className="text-sm text-zinc-400 mt-1">Configure platform escrow rules, AI price auto-sync, cold-chain telemetry thresholds, and admin team RBAC.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-xs font-mono text-emerald-400 border border-emerald-400 bg-emerald-950 px-3 py-1.5 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
                SYSTEM ENGINE v2.4.1 OPERATIONAL
              </div>
            </div>
          </div>

          {/* Action Confirmation Banner */}
          {saveSuccessMsg && (
            <div className="bg-emerald-950 border border-emerald-400 text-emerald-300 p-4 font-mono text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">task_alt</span>
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-xs text-emerald-400 underline">[DISMISS]</button>
            </div>
          )}

          {/* Section 1: Escrow & Telemetry Platform Rules */}
          <div className="bg-black border border-white p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white pb-3">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">tune</span>
                  Platform Operational Parameters
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Automated compliance triggers for trade settlements and IoT sensor monitoring.</p>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-white text-black font-mono text-xs font-black uppercase border border-white hover:bg-zinc-200 transition-colors"
              >
                Save Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* Escrow Auto Release Timer */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                <label className="text-white font-bold block">1. Escrow Auto-Release SLA Timer</label>
                <p className="text-zinc-400 text-[11px]">Time window before escrow funds are automatically released to farmer post delivery confirmation.</p>
                <select 
                  value={escrowAutoReleaseHours}
                  onChange={(e) => setEscrowAutoReleaseHours(Number(e.target.value))}
                  className="w-full mt-2 bg-black text-white border border-white p-2 text-xs focus:outline-none"
                >
                  <option value={12}>12 Hours (Express Release)</option>
                  <option value={24}>24 Hours (Standard Default)</option>
                  <option value={48}>48 Hours (Extended Audit)</option>
                </select>
              </div>

              {/* Cold-Chain Temp Variance */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                <label className="text-white font-bold block">2. Cold-Chain Temp Variance Threshold</label>
                <p className="text-zinc-400 text-[11px]">Temperature sensor variance tolerance before triggering automated Reefer Alert.</p>
                <select 
                  value={tempAlertVariance}
                  onChange={(e) => setTempAlertVariance(Number(e.target.value))}
                  className="w-full mt-2 bg-black text-white border border-white p-2 text-xs focus:outline-none"
                >
                  <option value={1.5}>±1.5°C (Strict Cold-Storage SLA)</option>
                  <option value={2.0}>±2.0°C (Standard Operational SLA)</option>
                  <option value={3.0}>±3.0°C (High Tolerance Ambient SLA)</option>
                </select>
              </div>

              {/* AI Price Auto-Sync Toggle */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">3. AI Base Rate Auto-Sync</span>
                  <p className="text-zinc-400 text-[11px] mt-1">Automatically update Mandi base rates based on AI predictive market volatility models.</p>
                </div>
                <button 
                  onClick={() => setAiPriceAutoSync(!aiPriceAutoSync)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors border ${aiPriceAutoSync ? 'bg-emerald-950 border-emerald-400 justify-end' : 'bg-zinc-900 border-zinc-700 justify-start'}`}
                >
                  <span className={`w-4 h-4 rounded-full ${aiPriceAutoSync ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                </button>
              </div>

              {/* Mandatory Quality Assaying Toggle */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">4. Mandatory Quality Lab Assaying</span>
                  <p className="text-zinc-400 text-[11px] mt-1">Require verified Mandi lab assaying certificate before produce listing goes live.</p>
                </div>
                <button 
                  onClick={() => setMandatoryQualityAssay(!mandatoryQualityAssay)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors border ${mandatoryQualityAssay ? 'bg-emerald-950 border-emerald-400 justify-end' : 'bg-zinc-900 border-zinc-700 justify-start'}`}
                >
                  <span className={`w-4 h-4 rounded-full ${mandatoryQualityAssay ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Admin Access & Role Management (RBAC) */}
          <div className="bg-black border border-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white pb-3">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">admin_panel_settings</span>
                  Admin Role & Access Control (RBAC)
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Manage administrative credentials, tribunal arbitration roles, and audit privileges.</p>
              </div>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black font-mono text-xs font-bold uppercase transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">person_add</span> Onboard Admin
              </button>
            </div>

            {/* Admin Users Table */}
            <div className="border border-white overflow-hidden">
              <table className="w-full text-left text-sm border-collapse font-mono">
                <thead>
                  <tr className="bg-zinc-950 border-b border-white text-zinc-400 text-xs uppercase">
                    <th className="p-3">Admin ID & Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {teamMembers.map(member => (
                    <tr key={member.id} className="hover:bg-zinc-900/60 transition-colors text-xs">
                      <td className="p-3">
                        <div className="text-white font-bold">{member.name}</div>
                        <div className="text-[10px] text-zinc-400">{member.id}</div>
                      </td>
                      <td className="p-3 text-zinc-300">{member.email}</td>
                      <td className="p-3 text-zinc-400">{member.department}</td>
                      <td className="p-3 font-bold">
                        {member.role === 'SUPER_ADMIN' && (
                          <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-400">SUPER ADMIN</span>
                        )}
                        {member.role === 'DISPUTE_MANAGER' && (
                          <span className="px-2 py-0.5 text-[10px] bg-rose-950 text-rose-400 border border-rose-400">DISPUTE ARBITRATOR</span>
                        )}
                        {member.role === 'LOGISTICS_AUDITOR' && (
                          <span className="px-2 py-0.5 text-[10px] bg-orange-950 text-orange-400 border border-orange-400">LOGISTICS AUDITOR</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center text-emerald-400 font-bold text-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Engine Telemetry & Emergency Overrides */}
          <div className="bg-black border border-white p-6 space-y-6">
            <div className="border-b border-white pb-3">
              <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400">dns</span>
                Database Gateway & Emergency Overrides
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">High-availability gateway telemetry and platform kill-switch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1">
                <span className="text-zinc-400">AgMarknet API Webhook:</span>
                <div className="text-emerald-400 font-bold">CONNECTED (100ms latency)</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1">
                <span className="text-zinc-400">PostgreSQL Connection Pool:</span>
                <div className="text-emerald-400 font-bold">HEALTHY (18/100 active connections)</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1">
                <span className="text-zinc-400">IoT Telemetry Broker:</span>
                <div className="text-emerald-400 font-bold">MQTT ONLINE (15,200 msg/min)</div>
              </div>
            </div>

            {/* Emergency Maintenance Kill Switch */}
            <div className="bg-rose-950/40 border border-rose-400 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <span className="material-symbols-outlined">warning</span> EMERGENCY MAINTENANCE OVERRIDE
                </div>
                <p className="text-rose-200">
                  Activating Maintenance Mode will temporarily lock new trade placements while preserving active cold-chain reefer monitoring.
                </p>
              </div>
              <button 
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  setSaveSuccessMsg(maintenanceMode ? 'Maintenance Mode deactivated. Platform restored to full live state.' : 'EMERGENCY MAINTENANCE MODE ACTIVATED.');
                  setTimeout(() => setSaveSuccessMsg(null), 5000);
                }}
                className={`px-4 py-2 text-xs font-bold uppercase transition-colors shrink-0 border ${maintenanceMode ? 'bg-emerald-950 border-emerald-400 text-emerald-400' : 'bg-rose-950 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black'}`}
              >
                {maintenanceMode ? 'Deactivate Maintenance Mode' : 'Activate Maintenance Mode'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Onboard Admin User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-black border border-white p-6 max-w-md w-full space-y-5 font-mono">
            <div className="flex justify-between items-center border-b border-white pb-3">
              <h3 className="text-base font-black text-white uppercase">Onboard Admin User</h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Full Name:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Email Address:</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. ramesh@mandikart.gov.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Role Privilege:</label>
                <select 
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as AdminTeamMember['role'])}
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                >
                  <option value="LOGISTICS_AUDITOR">Logistics Telemetry Auditor</option>
                  <option value="DISPUTE_MANAGER">Dispute Tribunal Arbitrator</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200"
                >
                  Grant Credentials
                </button>
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
