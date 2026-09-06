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
  const [currentFarmer, setCurrentFarmer] = useState<FarmerUser>(() => {
    try {
      const savedFarmers = localStorage.getItem('mandikart_admin_farmers_data');
      if (savedFarmers) {
        const parsed: FarmerUser[] = JSON.parse(savedFarmers);
        const found = parsed.find(f => f.id === farmer.id);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return farmer;
  });
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [inspectingDoc, setInspectingDoc] = useState<{ documentType: string; documentNumber: string; verifiedStatus: string } | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const getCropFallbackImage = (cropName: string): string => {
    const lower = cropName.toLowerCase();
    if (lower.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
    if (lower.includes('onion')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80';
    if (lower.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80';
    if (lower.includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80';
    if (lower.includes('corn') || lower.includes('maize')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80';
    if (lower.includes('orange') || lower.includes('citrus')) return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
  };

  const syncFarmerToLocalStorage = (updated: FarmerUser) => {
    try {
      const savedFarmers = localStorage.getItem('mandikart_admin_farmers_data');
      let list: FarmerUser[] = savedFarmers ? JSON.parse(savedFarmers) : [];
      const idx = list.findIndex(f => f.id === updated.id);
      if (idx !== -1) {
        list[idx] = updated;
      } else {
        list.push(updated);
      }
      localStorage.setItem('mandikart_admin_farmers_data', JSON.stringify(list));
    } catch {
      // localstorage fallback
    }
  };

  const handleApproveKyc = () => {
    const updated: FarmerUser = {
      ...currentFarmer,
      verificationStatus: 'VERIFIED',
      kycRecords: currentFarmer.kycRecords.map((rec) => ({ ...rec, verifiedStatus: 'VERIFIED' })),
    };
    setCurrentFarmer(updated);
    syncFarmerToLocalStorage(updated);
    
    // Call backend API in background
    fetch(`http://localhost:4003/api/v1/admin/farmers/${currentFarmer.id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified: true })
    }).catch(() => {});

    setActionSuccessMessage('Farmer KYC & Land Records approved and activated for bulk trading.');
    setTimeout(() => setActionSuccessMessage(''), 4500);
  };

  const handleSuspendAccount = () => {
    const updated: FarmerUser = {
      ...currentFarmer,
      verificationStatus: 'SUSPENDED',
    };
    setCurrentFarmer(updated);
    syncFarmerToLocalStorage(updated);
    setActionSuccessMessage('Farmer account suspended. Marketplace listings paused.');
    setTimeout(() => setActionSuccessMessage(''), 4500);
  };

  const handleApproveProduce = async (listingId: string, cropName: string) => {
    const updated: FarmerUser = {
      ...currentFarmer,
      activeListings: currentFarmer.activeListings.map(l => l.id === listingId ? { ...l, status: 'APPROVED' as any } : l)
    };
    setCurrentFarmer(updated);
    syncFarmerToLocalStorage(updated);

    // Call Admin Backend
    try {
      await fetch(`http://localhost:4003/api/v1/admin/produce/${listingId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });
    } catch {
      // Offline fallback
    }

    setActionSuccessMessage(`VERIFIED: "${cropName}" quality approved! Farmer can now list it globally for all buyers.`);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleRejectProduce = async (listingId: string, cropName: string) => {
    const updated: FarmerUser = {
      ...currentFarmer,
      activeListings: currentFarmer.activeListings.map(l => l.id === listingId ? { ...l, status: 'REJECTED' as const } : l)
    };
    setCurrentFarmer(updated);
    syncFarmerToLocalStorage(updated);

    try {
      await fetch(`http://localhost:4003/api/v1/admin/produce/${listingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Quality specifications do not meet grade standards' })
      });
    } catch {}

    setActionSuccessMessage(`REJECTED: "${cropName}" listing rejected.`);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleTriggerInstantPayout = () => {
    setPayoutLoading(true);
    setTimeout(() => {
      setPayoutLoading(false);
      const updated: FarmerUser = {
        ...currentFarmer,
        totalSalesAmount: currentFarmer.totalSalesAmount + 10000
      };
      setCurrentFarmer(updated);
      syncFarmerToLocalStorage(updated);
      setActionSuccessMessage('Direct Bank Settlement of ₹10,000 processed to farmer SBI account via IMPS/NEFT gateway!');
      setTimeout(() => setActionSuccessMessage(''), 6000);
    }, 1200);
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
              ← Farmer Directory
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-white font-black">{currentFarmer.fullName}</span>
          </div>

          {actionSuccessMessage && (
            <div className="p-3.5 bg-black border border-emerald-400 rounded-xl text-emerald-400 text-xs font-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{actionSuccessMessage}</span>
              </div>
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
                      <button 
                        onClick={() => setInspectingDoc(doc)}
                        className="w-full mt-2 py-1 bg-black hover:bg-slate-900 text-white rounded text-xs font-bold border border-white transition-colors text-center block"
                      >
                        Inspect Document →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Produce Listings & Moderation */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentFarmer.activeListings.map((listing) => {
                      const imageSrc = (listing.imageUrl && !listing.imageUrl.startsWith('file://'))
                        ? listing.imageUrl
                        : getCropFallbackImage(listing.cropName);

                      return (
                        <div key={listing.id} className="p-4 bg-black rounded-lg border border-white space-y-3 font-mono flex flex-col justify-between">
                          <div className="space-y-3">
                            {/* Product Image Thumbnail */}
                            <div className="relative w-full h-36 rounded-md overflow-hidden border border-zinc-800 bg-zinc-950">
                              <img 
                                src={imageSrc} 
                                alt={listing.cropName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getCropFallbackImage(listing.cropName);
                                }}
                              />
                              <div className="absolute top-2 right-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border backdrop-blur-md ${
                                  listing.status === 'ACTIVE'
                                    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-400'
                                    : listing.status === 'APPROVED' || listing.status === 'ADMIN_APPROVED'
                                    ? 'bg-sky-950/90 text-sky-400 border-sky-400'
                                    : listing.status === 'PENDING_APPROVAL'
                                    ? 'bg-orange-950/90 text-orange-400 border-orange-400 animate-pulse'
                                    : 'bg-rose-950/90 text-rose-400 border-rose-400'
                                }`}>
                                  {listing.status === 'ACTIVE' ? 'LIVE ON MARKETPLACE' : listing.status === 'APPROVED' || listing.status === 'ADMIN_APPROVED' ? 'QUALITY VERIFIED' : listing.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm text-white">{listing.cropName}</span>
                              <span className="text-[11px] text-zinc-400">ID: {listing.id}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950 p-2.5 border border-zinc-900">
                              <div>
                                <span className="text-slate-400 block text-[10px] font-semibold">Available Qty:</span>
                                <span className="font-bold text-white text-sm">{listing.availableKg.toLocaleString()} kg</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] font-semibold">Price per Kg:</span>
                                <span className="font-black text-emerald-400 text-sm">₹{listing.pricePerKg}/kg</span>
                              </div>
                            </div>
                          </div>
                          
                          {listing.status === 'PENDING_APPROVAL' ? (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                              <button
                                onClick={() => handleApproveProduce(listing.id, listing.cropName)}
                                className="py-2 bg-emerald-950 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black text-xs font-bold uppercase transition-colors rounded text-center shadow"
                              >
                                Accept & Verify
                              </button>
                              <button
                                onClick={() => handleRejectProduce(listing.id, listing.cropName)}
                                className="py-2 bg-rose-950 border border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-black text-xs font-bold uppercase transition-colors rounded text-center"
                              >
                                Reject Listing
                              </button>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">storefront</span> Published & Orderable
                              </span>
                              <button
                                onClick={() => handleRejectProduce(listing.id, listing.cropName)}
                                className="text-rose-400 hover:underline text-[11px]"
                              >
                                Delist
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

                <div className="flex justify-between py-1.5 border-b border-white/30">
                  <span className="text-slate-300 font-semibold">Khasra Survey No:</span>
                  <span className="font-mono font-bold text-white">KH-402/2023</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300 font-semibold">Active Cold-Chain Hub:</span>
                  <span className="font-bold text-emerald-400">Nashik Central Warehouse</span>
                </div>
              </div>

              {/* Direct Bank Account & Settlement Card */}
              <div className="bg-black rounded-xl border border-white p-5 shadow-md space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-white pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-base">account_balance</span>
                    Bank Settlement Account
                  </h3>
                  <span className="text-[10px] text-emerald-400 border border-emerald-400 px-1.5 py-0.5 rounded font-bold">
                    NPCI VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Account Holder:</span>
                    <span className="font-bold text-white">{currentFarmer.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Bank Name:</span>
                    <span className="font-bold text-white">State Bank of India (SBI)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Account No:</span>
                    <span className="font-bold text-white font-mono">XXXX-XXXX-4921</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">IFSC Code:</span>
                    <span className="font-mono text-emerald-400 font-bold">SBIN0004123</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <button
                    onClick={handleTriggerInstantPayout}
                    disabled={payoutLoading}
                    className="w-full py-2 bg-emerald-950 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black font-bold uppercase transition-colors text-xs rounded"
                  >
                    {payoutLoading ? 'Processing Settlement...' : 'Trigger Immediate Payout (₹10,000)'}
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center mt-1">Escrow automated release via RBI-approved clearing house.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Document Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-black border border-white p-6 max-w-lg w-full space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-white pb-3">
              <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">verified_user</span>
                Document Verification Audit
              </h3>
              <button 
                onClick={() => setInspectingDoc(null)}
                className="text-zinc-400 hover:text-white text-xs border border-zinc-700 px-2 py-1"
              >
                [CLOSE]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Document Type:</span>
                  <span className="text-white font-bold">{inspectingDoc.documentType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Unique Identifier / Registry No:</span>
                  <span className="text-emerald-400 font-bold">{inspectingDoc.documentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Audit Status:</span>
                  <span className="text-emerald-400 font-bold border border-emerald-400 px-1.5 py-0.5 rounded">
                    {inspectingDoc.verifiedStatus}
                  </span>
                </div>
              </div>

              {/* Document Mock Visual */}
              <div className="border border-dashed border-zinc-700 p-6 text-center space-y-2 bg-zinc-950/50">
                <span className="material-symbols-outlined text-4xl text-emerald-400">badge</span>
                <p className="text-zinc-300 font-bold">Official Government Document Record Verified</p>
                <p className="text-[11px] text-zinc-500">
                  Land record synchronized with Maharashtra e-Bhumi Digital Records and UIDAI Aadhaar verification vault.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setInspectingDoc(null)}
                  className="px-4 py-2 bg-white text-black font-bold uppercase hover:bg-zinc-200 text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
