import React, { createContext, useContext, useState } from 'react';
import {
  PARTNER_PROFILE,
  TODAY_STATS,
  ACTIVE_DELIVERY,
  AVAILABLE_DELIVERIES,
  COMPLETED_DELIVERIES,
  WEEKLY_EARNINGS,
  PAYOUT_HISTORY,
  LEADERBOARD,
  NOTIFICATIONS,
} from '../constants/partnerMockData';

const PartnerContext = createContext(null);

export const PartnerProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState(PARTNER_PROFILE);
  const [todayStats, setTodayStats] = useState(TODAY_STATS);
  const [activeDelivery, setActiveDelivery] = useState(ACTIVE_DELIVERY);
  const [availableDeliveries, setAvailableDeliveries] = useState(AVAILABLE_DELIVERIES);
  const [completedDeliveries, setCompletedDeliveries] = useState(COMPLETED_DELIVERIES);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [weeklyEarnings, setWeeklyEarnings] = useState(WEEKLY_EARNINGS);
  const [payouts, setPayouts] = useState(PAYOUT_HISTORY);
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD);

  // Quick navigation / screen arranger selector
  const [selectedScreenModalVisible, setSelectedScreenModalVisible] = useState(false);
  const [activeScreenOverride, setActiveScreenOverride] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth methods
  const login = (mobileNumber, password) => {
    setIsAuthenticated(true);
    setIsOnline(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnline(false);
  };

  const registerPartner = (data) => {
    if (data?.fullName) {
      setPartnerProfile(prev => ({ ...prev, name: data.fullName }));
    }
    setIsAuthenticated(true);
    setIsOnline(true);
    return true;
  };

  // Toggle online status
  const toggleOnline = () => {
    setIsOnline(prev => !prev);
  };

  // Accept a new delivery
  const acceptDelivery = (orderId) => {
    const order = availableDeliveries.find(o => o.id === orderId);
    if (!order) return;

    const newActive = {
      id: order.id,
      title: order.title,
      quantity: order.quantity,
      payout: order.payout,
      status: 'PICKUP',
      currentStepIndex: 0,
      requiresColdStorage: false,
      estimatedTimeMins: 25,
      distanceKm: order.distanceKm,
      pickup: {
        name: order.pickupName,
        contactPerson: 'Farm Dispatch Coordinator',
        phone: '+91 94370 55443',
        address: `${order.pickupName}, Rural Mandi Corridor`,
        pin: '751024',
        time: 'Just now',
        isDone: false,
      },
      drop: {
        name: order.dropName,
        contactPerson: 'Receiving Officer',
        phone: '+91 94371 66778',
        address: `${order.dropName}, Produce Bay 4`,
        pin: '751019',
        time: 'In 35 mins',
        isDone: false,
      },
      manifest: [
        { item: order.title, crates: 4, weightKg: 120, grade: 'Verified Grade A' },
      ],
      otpCode: '5821',
    };

    setActiveDelivery(newActive);
    setAvailableDeliveries(prev => prev.filter(o => o.id !== orderId));
  };

  // Decline an available delivery
  const declineDelivery = (orderId) => {
    setAvailableDeliveries(prev => prev.filter(o => o.id !== orderId));
  };

  // Advance delivery lifecycle (Pickup -> In Transit -> Delivered)
  const advanceDeliveryStep = () => {
    if (!activeDelivery) return;

    if (activeDelivery.currentStepIndex === 0) {
      // Picked up from farmer, now In Transit
      setActiveDelivery(prev => ({
        ...prev,
        status: 'IN_TRANSIT',
        currentStepIndex: 1,
        pickup: { ...prev.pickup, isDone: true },
      }));
    } else if (activeDelivery.currentStepIndex === 1) {
      // Delivered to Mandi hub
      const payoutAmount = activeDelivery.payout;
      const completedOrder = {
        id: activeDelivery.id,
        title: activeDelivery.title,
        quantity: activeDelivery.quantity,
        payout: payoutAmount,
        deliveredAt: 'Just now',
        customer: activeDelivery.drop.name,
        rating: 5,
      };

      setCompletedDeliveries(prev => [completedOrder, ...prev]);
      setTodayStats(prev => ({
        ...prev,
        earnings: prev.earnings + payoutAmount,
        deliveriesCompleted: prev.deliveriesCompleted + 1,
        distanceKm: parseFloat((prev.distanceKm + activeDelivery.distanceKm).toFixed(1)),
      }));

      setActiveDelivery(null);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <PartnerContext.Provider
      value={{
        isOnline,
        toggleOnline,
        partnerProfile,
        todayStats,
        activeDelivery,
        availableDeliveries,
        completedDeliveries,
        weeklyEarnings,
        payouts,
        leaderboard,
        notifications,
        markAllNotificationsRead,
        acceptDelivery,
        declineDelivery,
        advanceDeliveryStep,
        selectedScreenModalVisible,
        setSelectedScreenModalVisible,
        activeScreenOverride,
        setActiveScreenOverride,
        isAuthenticated,
        login,
        logout,
        registerPartner,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
};
