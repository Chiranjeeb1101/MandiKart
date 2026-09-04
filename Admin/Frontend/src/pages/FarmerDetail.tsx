import React, { useState } from 'react';
import type { FarmerUser, AdminUser } from '../types/admin';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface FarmerDetailProps {
  user: AdminUser;
  farmer: FarmerUser;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
  onBackToDirectory: () => void;
}

export const FarmerDetail: React.FC<FarmerDetailProps> = ({
  user,
  farmer,
  onLogout,
  onNavigateTab,
  onBackToDirectory,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentFarmer, setCurrentFarmer] = useState<FarmerUser>(farmer);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const handleApproveKyc = () => {
    setCurrentFarmer((prev) => ({
      ...prev,
      verificationStatus: 'VERIFIED',
      kycRecords: prev.kycRecords.map((rec) => ({ ...rec, verifiedStatus: 'VERIFIED' })),
    }));
    setActionSuccessMessage('Farmer KYC & Land Records approved successfully.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleSuspendAccount = () => {
    setCurrentFarmer((prev) => ({
      ...prev,
      verificationStatus: 'SUSPENDED',
    }));
    setActionSuccessMessage('Farmer account suspended.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <button onClick={onBackToDirectory} className="hover:text-white transition-colors">
              Farmer Directory
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-white font-black">{currentFarmer.fullName}</span>
          </div>

          {actionSuccessMessage && (
            <div className="p-3.5 bg-black border border-emerald-400 rounded-xl text-emerald-400 text-xs font-black flex items-center justify-between">
              <span>{actionSuccessMessage}</span>
              <button onClick={() => setActionSuccessMessage('')} className="text-emerald-400 hover:text-white font-bold">
                ✕
              </button>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-black p-6 rounded-xl border border-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white text-black font-black flex items-center justify-center text-xl shrink-0 shadow-sm">
                {currentFarmer.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight">{currentFarmer.fullName}</h1>
                  <span className="text-xs font-mono font-bold text-white bg-black px-2 py-0.5 rounded border border-white">
                    {currentFarmer.farmerCode}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-extrabold border ${
                      currentFarmer.verificationStatus === 'VERIFIED'
                        ? 'bg-black text-emerald-400 border-emerald-400'
                        : currentFarmer.verificationStatus === 'PENDING_KYC'
                        ? 'bg-black text-orange-400 border-orange-400'
                        : 'bg-black text-rose-400 border-rose-400'
                    }`}
                  >
                    {currentFarmer.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>{currentFarmer.mandiName} ({currentFarmer.district}, {currentFarmer.state})</span>
                  <span>{currentFarmer.landAreaAcres} Acres</span>
                  <span>{currentFarmer.phone}</span>
                  <span>Joined {currentFarmer.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {currentFarmer.verificationStatus !== 'VERIFIED' && (
                <button
                  onClick={handleApproveKyc}
                  className="px-3.5 py-1.5 bg-white text-black hover:bg-slate-200 rounded-lg text-xs font-extrabold transition-colors shadow-sm"
                >
                  Approve KYC
                </button>
              )}

              {currentFarmer.verificationStatus !== 'SUSPENDED' ? (
                <button
                  onClick={handleSuspendAccount}
                  className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-rose-400 rounded-lg text-xs font-bold border border-rose-400 transition-colors"
                >
                  Suspend Account
                </button>
              ) : (
                <button
                  onClick={handleApproveKyc}
                  className="px-3.5 py-1.5 bg-black hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors border border-white"
                >
                  Reactivate Account
                </button>
              )}
            </div>
          </div>

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* KYC Document Inspector */}
              <div className="bg-black rounded-xl border border-white p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white">KYC & Land Record Documents</h3>
                    <p className="text-[11px] text-slate-300 font-semibold">Verified government identity & land registry</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentFarmer.kycRecords.map((doc, idx) => (
                    <div key={idx} className="p-3.5 bg-black rounded-lg border border-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-white">description</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                            doc.verifiedStatus === 'VERIFIED'
                              ? 'bg-black text-emerald-400 border-emerald-400'
                              : doc.verifiedStatus === 'PENDING'
                              ? 'bg-black text-orange-400 border-orange-400'
                              : 'bg-black text-rose-400 border-rose-400'
                          }`}
                        >
                          {doc.verifiedStatus}
                        </span>
                      </div>
                      <div className="font-black text-xs text-white uppercase">
                        {doc.documentType.replace('_', ' ')}
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-300">{doc.documentNumber}</div>
                      <button className="w-full mt-2 py-1 bg-black hover:bg-slate-900 text-white rounded text-xs font-bold border border-white transition-colors text-center block">
                        Inspect Document →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Crops */}
              <div className="bg-black rounded-xl border border-white p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white">Farmer Produce Listings & Moderation</h3>
                    <p className="text-[11px] text-slate-300 font-semibold">Crops submitted by farmer requiring Admin approval before user marketplace publishing</p>
                  </div>
                  <span className="text-xs font-bold text-white bg-black border border-white px-2.5 py-0.5 rounded">
                    {currentFarmer.activeListings.length} Listings Total
                  </span>
                </div>

                {currentFarmer.activeListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentFarmer.activeListings.map((listing) => (
                      <div key={listing.id} className="p-3.5 bg-black rounded-lg border border-white space-y-2 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-white">{listing.cropName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            listing.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-400'
                              : listing.status === 'PENDING_APPROVAL'
                              ? 'bg-orange-950 text-orange-400 border-orange-400 animate-pulse'
                              : 'bg-rose-950 text-rose-400 border-rose-400'
                          }`}>
                            {listing.status === 'ACTIVE' ? 'LIVE ON MARKETPLACE' : listing.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-300 block text-[11px] font-semibold">Available Qty:</span>
                            <span className="font-bold text-white">{listing.availableKg.toLocaleString()} kg</span>
                          </div>
                          <div>
                            <span className="text-slate-300 block text-[11px] font-semibold">Price per Kg:</span>
                            <span className="font-black text-emerald-400 text-sm">₹{listing.pricePerKg}/kg</span>
                          </div>
                        </div>
                        
                        {listing.status === 'PENDING_APPROVAL' && (
                          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-800">
                            <button
                              onClick={() => {
                                setCurrentFarmer(prev => ({
                                  ...prev,
                                  activeListings: prev.activeListings.map(l => l.id === listing.id ? { ...l, status: 'ACTIVE' as const } : l)
                                }));
                                setActionSuccessMessage(`APPROVED: "${listing.cropName}" is now published live on MandiKart User App Marketplace!`);
                                setTimeout(() => setActionSuccessMessage(''), 5000);
                              }}
                              className="py-1 bg-emerald-950 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black text-[11px] font-bold uppercase transition-colors rounded text-center"
                            >
                              Accept & Publish
                            </button>
                            <button
                              onClick={() => {
                                setCurrentFarmer(prev => ({
                                  ...prev,
                                  activeListings: prev.activeListings.map(l => l.id === listing.id ? { ...l, status: 'REJECTED' as const } : l)
                                }));
                                setActionSuccessMessage(`REJECTED: "${listing.cropName}" listing rejected.`);
                                setTimeout(() => setActionSuccessMessage(''), 5000);
                              }}
                              className="py-1 bg-rose-950 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black text-[11px] font-bold uppercase transition-colors rounded text-center"
                            >
                              Reject Listing
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium">
                    No produce listings found for this farmer.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6">
              <div className="bg-black rounded-xl border border-white p-5 shadow-md space-y-3 text-xs">
                <h3 className="text-sm font-black text-white border-b border-white pb-3">
                  Market Performance
                </h3>

                <div className="flex justify-between py-1.5 border-b border-white/30">
                  <span className="text-slate-300 font-semibold">Quality Rating:</span>
                  <span className="font-black text-white">⭐ {currentFarmer.rating} / 5.0</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-white/30">
                  <span className="text-slate-300 font-semibold">Lifetime Revenue:</span>
                  <span className="font-black text-white font-mono text-sm">
                    ₹{currentFarmer.totalSalesAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300 font-semibold">Khasra Survey No:</span>
                  <span className="font-mono font-bold text-white">KH-402/2023</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};



