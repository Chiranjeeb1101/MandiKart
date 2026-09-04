import React, { useState } from 'react';
import type { FarmerUser, AdminUser, FarmerProduceListing } from '../types/admin';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { mockFarmers as initialMockFarmers } from './FarmerDirectoryMock';

interface FarmerDirectoryProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
  onSelectFarmer: (farmer: FarmerUser) => void;
}

export const FarmerDirectory: React.FC<FarmerDirectoryProps> = ({
  user,
  onLogout,
  onNavigateTab,
  onSelectFarmer,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [farmers, setFarmers] = useState<FarmerUser[]>(initialMockFarmers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING_KYC' | 'SUSPENDED'>('ALL');
  
  // Notification & Modal State
  const [approvalNotification, setApprovalNotification] = useState<string | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Farmer Produce Submission Simulation State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(initialMockFarmers[0].id);
  const [simCropName, setSimCropName] = useState('');
  const [simCategory, setSimCategory] = useState('Vegetables');
  const [simQuantityKg, setSimQuantityKg] = useState<number>(2000);
  const [simPricePerKg, setSimPricePerKg] = useState<number>(45);
  const [simGrade, setSimGrade] = useState<'GRADE_A' | 'GRADE_B' | 'PREMIUM'>('GRADE_A');

  // Extract all pending produce listings across all farmers
  const pendingProduceListings: (FarmerProduceListing & { farmerFullName: string; farmerCode: string })[] = [];
  farmers.forEach(f => {
    f.activeListings.forEach(l => {
      if (l.status === 'PENDING_APPROVAL') {
        pendingProduceListings.push({
          ...l,
          farmerFullName: f.fullName,
          farmerCode: f.farmerCode,
          farmerId: f.id,
        });
      }
    });
  });

  // Approve Produce Listing Handler (Admin accepts produce -> published live to users)
  const handleApproveProduce = (farmerId: string, listingId: string, cropName: string) => {
    setFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        return {
          ...f,
          activeListings: f.activeListings.map(l => {
            if (l.id === listingId) {
              return { ...l, status: 'ACTIVE' as const };
            }
            return l;
          })
        };
      }
      return f;
    }));

    setApprovalNotification(`PRODUCE APPROVED: "${cropName}" is now PUBLISHED live on MandiKart User App Marketplace for buyers!`);
    setTimeout(() => setApprovalNotification(null), 6000);
  };

  // Reject Produce Listing Handler
  const handleRejectProduce = (farmerId: string, listingId: string, cropName: string) => {
    setFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        return {
          ...f,
          activeListings: f.activeListings.map(l => {
            if (l.id === listingId) {
              return { ...l, status: 'REJECTED' as const };
            }
            return l;
          })
        };
      }
      return f;
    }));

    setApprovalNotification(`PRODUCE REJECTED: "${cropName}" listing rejected and notified to farmer.`);
    setTimeout(() => setApprovalNotification(null), 6000);
  };

  // Simulate Farmer Submitting Product Handler
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simCropName) return;

    const targetFarmer = farmers.find(f => f.id === selectedFarmerId);
    const newListing: FarmerProduceListing = {
      id: `lst-sim-${Date.now()}`,
      farmerId: selectedFarmerId,
      farmerName: targetFarmer?.fullName,
      farmerCode: targetFarmer?.farmerCode,
      cropName: simCropName,
      category: simCategory,
      availableKg: Number(simQuantityKg),
      pricePerKg: Number(simPricePerKg),
      qualityGrade: simGrade,
      harvestDate: 'Today',
      status: 'PENDING_APPROVAL',
      mandiName: targetFarmer?.mandiName || 'Central Mandi',
      submittedAt: 'Just Now',
      labCertificateNumber: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setFarmers(prev => prev.map(f => {
      if (f.id === selectedFarmerId) {
        return {
          ...f,
          activeListings: [newListing, ...f.activeListings]
        };
      }
      return f;
    }));

    setShowSimulateModal(false);
    setSimCropName('');
    setApprovalNotification(`FARMER SUBMISSION RECEIVED: Farmer ${targetFarmer?.fullName} submitted "${simCropName}". Added to Admin Moderation Queue for Approval!`);
    setTimeout(() => setApprovalNotification(null), 7000);
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || farmer.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = farmers.length;
  const verifiedCount = farmers.filter((f) => f.verificationStatus === 'VERIFIED').length;
  const pendingCount = farmers.filter((f) => f.verificationStatus === 'PENDING_KYC').length;
  const suspendedCount = farmers.filter((f) => f.verificationStatus === 'SUSPENDED').length;

  return (
    <div className="flex min-h-screen bg-black font-sans text-white">
      <Sidebar
        activeTab="farmers"
        onTabChange={onNavigateTab}
        onLogout={onLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1500px] w-full mx-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Farmer Directory & Produce Moderation
              </h1>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                Inspect producer profiles, verify KYC land records, and approve newly submitted produce listings before publishing to buyers.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => setShowSimulateModal(true)}
                className="px-3.5 py-1.5 bg-orange-950 text-orange-400 border border-orange-400 hover:bg-orange-400 hover:text-black rounded-lg text-xs font-black transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                <span>Simulate Farmer Adding Product</span>
              </button>
            </div>
          </div>

          {/* Action & Moderation Notification Alert */}
          {approvalNotification && (
            <div className="p-4 bg-emerald-950 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-base">task_alt</span>
                <span>{approvalNotification}</span>
              </div>
              <button onClick={() => setApprovalNotification(null)} className="text-emerald-400 hover:text-white font-bold">
                ✕
              </button>
            </div>
          )}

          {/* SECTION: PRODUCE MODERATION & APPROVAL QUEUE (Farmer -> Admin -> User) */}
          <div className="bg-black rounded-xl border border-orange-400 p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400 text-xl">fact_check</span>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    Farmer Produce Moderation Queue (Approval Required)
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    When farmers add products, admin must accept them before they become visible to buyers on the MandiKart User App.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-orange-950 text-orange-400 border border-orange-400 rounded-full self-start sm:self-auto">
                {pendingProduceListings.length} Produce Pending Admin Review
              </span>
            </div>

            {pendingProduceListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingProduceListings.map(listing => {
                  const totalLotValue = listing.availableKg * listing.pricePerKg;

                  return (
                    <div key={listing.id} className="bg-zinc-950 border border-orange-400/80 p-4 rounded-lg space-y-3 font-mono">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-emerald-400">person</span>
                            <strong className="text-white">{listing.farmerFullName}</strong> ({listing.farmerCode})
                          </div>
                          <h3 className="text-base font-black text-white mt-1">{listing.cropName}</h3>
                          <div className="text-[11px] text-zinc-400 mt-0.5">Category: {listing.category} | Mandi: {listing.mandiName}</div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-400 animate-pulse">
                          PENDING APPROVAL
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-black border border-zinc-800 p-2.5 rounded text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">AVAILABLE:</span>
                          <span className="text-white font-bold">{listing.availableKg.toLocaleString()} kg</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">PRICE/KG:</span>
                          <span className="text-emerald-400 font-bold">₹{listing.pricePerKg}/kg</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">LOT VALUE:</span>
                          <span className="text-white font-bold">₹{totalLotValue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 flex justify-between items-center pt-1 border-t border-zinc-800">
                        <span>Quality Grade: <strong className="text-emerald-400">{listing.qualityGrade}</strong></span>
                        <span>Lab Cert: <strong className="text-zinc-300">{listing.labCertificateNumber || 'Verified'}</strong></span>
                      </div>

                      {/* Admin Approval Control Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => handleApproveProduce(listing.farmerId!, listing.id, listing.cropName)}
                          className="py-2 bg-emerald-950 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black text-xs font-bold uppercase transition-colors rounded flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Accept & Publish to Users</span>
                        </button>
                        <button
                          onClick={() => handleRejectProduce(listing.farmerId!, listing.id, listing.cropName)}
                          className="py-2 bg-rose-950 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black text-xs font-bold uppercase transition-colors rounded flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          <span>Reject Listing</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-xs font-mono text-zinc-400 space-y-2">
                <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
                <div>All submitted farmer produce listings have been moderated and published to the marketplace!</div>
                <button 
                  onClick={() => setShowSimulateModal(true)}
                  className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-white text-xs font-bold hover:bg-white hover:text-black transition-colors"
                >
                  + Simulate Farmer Submitting Product
                </button>
              </div>
            )}
          </div>

          {/* Directory Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black p-4 rounded-xl border border-white shadow-md">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Total Onboarded</div>
              <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
            </div>

            <div className="bg-black p-4 rounded-xl border border-emerald-400 shadow-md">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">KYC Verified (Green)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</div>
            </div>

            <div className="bg-black p-4 rounded-xl border border-orange-400 shadow-md">
              <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Pending KYC Review</div>
              <div className="text-2xl font-black text-orange-400 mt-1">{pendingCount}</div>
            </div>

            <div className="bg-black p-4 rounded-xl border border-rose-400 shadow-md">
              <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Suspended (Red)</div>
              <div className="text-2xl font-black text-rose-400 mt-1">{suspendedCount}</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-black p-3.5 rounded-xl border border-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Filter by farmer name, ID (#FMR-8921), phone, or Mandi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-black border border-white rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white font-mono"
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-slate-900'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setStatusFilter('VERIFIED')}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                  statusFilter === 'VERIFIED'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-400'
                    : 'bg-black text-slate-300 border-zinc-800 hover:border-white'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setStatusFilter('PENDING_KYC')}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                  statusFilter === 'PENDING_KYC'
                    ? 'bg-orange-950 text-orange-400 border-orange-400'
                    : 'bg-black text-slate-300 border-zinc-800 hover:border-white'
                }`}
              >
                Pending KYC
              </button>
            </div>
          </div>

          {/* Farmer Roster Table */}
          <div className="bg-black rounded-xl border border-white shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white bg-zinc-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Farmer & Code</th>
                    <th className="p-3.5">Mandi Region</th>
                    <th className="p-3.5">Land Holding</th>
                    <th className="p-3.5">KYC Status</th>
                    <th className="p-3.5">Active Crops</th>
                    <th className="p-3.5 text-right">Lifetime Sales</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-xs">
                  {filteredFarmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-black text-white text-sm">{farmer.fullName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{farmer.farmerCode}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{farmer.mandiName}</div>
                        <div className="text-slate-400 text-[11px]">{farmer.district}, {farmer.state}</div>
                      </td>
                      <td className="p-3.5 font-mono text-white font-bold">{farmer.landAreaAcres} Acres</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            farmer.verificationStatus === 'VERIFIED'
                              ? 'bg-black text-emerald-400 border-emerald-400'
                              : farmer.verificationStatus === 'PENDING_KYC'
                              ? 'bg-black text-orange-400 border-orange-400'
                              : 'bg-black text-rose-400 border-rose-400'
                          }`}
                        >
                          {farmer.verificationStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {farmer.activeListings.map((l) => (
                            <span
                              key={l.id}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                                l.status === 'ACTIVE'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-400'
                                  : l.status === 'PENDING_APPROVAL'
                                  ? 'bg-orange-950 text-orange-400 border-orange-400'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {l.cropName} {l.status === 'PENDING_APPROVAL' ? '(Pending)' : ''}
                            </span>
                          ))}
                          {farmer.activeListings.length === 0 && <span className="text-slate-500 font-mono">No listings</span>}
                        </div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-white">
                        ₹{farmer.totalSalesAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onSelectFarmer(farmer)}
                          className="px-3 py-1 bg-black hover:bg-white hover:text-black text-white text-xs font-mono font-bold rounded border border-white transition-colors"
                        >
                          Manage Profile →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Simulate Farmer Adding Product */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-black border border-white p-6 max-w-md w-full space-y-5 font-mono">
            <div className="flex justify-between items-center border-b border-white pb-3">
              <div>
                <span className="text-xs text-orange-400 uppercase font-bold">FARMER MARKETPLACE SIMULATOR</span>
                <h3 className="text-base font-black text-white">Farmer Add Product</h3>
              </div>
              <button 
                onClick={() => setShowSimulateModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Select Farmer:</label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                >
                  {farmers.map(f => (
                    <option key={f.id} value={f.id}>{f.fullName} ({f.farmerCode} - {f.mandiName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Produce / Crop Name:</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sweet Corn (Sugar75) or Fresh Carrots"
                  value={simCropName}
                  onChange={(e) => setSimCropName(e.target.value)}
                  className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">Available Qty (kg):</label>
                  <input 
                    type="number" 
                    required
                    value={simQuantityKg}
                    onChange={(e) => setSimQuantityKg(Number(e.target.value))}
                    className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Price per Kg (₹):</label>
                  <input 
                    type="number" 
                    required
                    value={simPricePerKg}
                    onChange={(e) => setSimPricePerKg(Number(e.target.value))}
                    className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">Category:</label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Quality Grade:</label>
                  <select
                    value={simGrade}
                    onChange={(e) => setSimGrade(e.target.value as any)}
                    className="w-full bg-black text-white border border-white p-2 focus:outline-none"
                  >
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="GRADE_A">GRADE_A</option>
                    <option value="GRADE_B">GRADE_B</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 text-[11px] text-orange-300">
                ⚠️ Submission Rule: When submitted, product status will be set to <strong>PENDING_APPROVAL</strong>. It will be sent to Admin Moderation Queue and will NOT be visible to users until Admin accepts it.
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 text-black font-black uppercase hover:bg-orange-400 transition-colors"
                >
                  Submit Product (As Farmer)
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
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
