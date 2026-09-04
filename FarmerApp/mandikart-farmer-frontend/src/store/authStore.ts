/**
 * MandiKart — Zustand Auth Store
 *
 * Global client-side auth & farmer state.
 * Only for genuine client-side state that needs global access.
 */

import { create } from 'zustand';
import type { Farmer } from '@/types';

export interface UserProfile {
  id?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  isEmailVerified?: boolean;
  avatarUri?: string;
  district?: string;
  state?: string;
  city?: string;
  village?: string;
  experience?: string;
  farmerType?: string;
  role?: string;
  farmSize?: string;
  farmSizeAcres?: string | number;
  farmSizeUnit?: string;
  crops?: string[];
  isOwner?: boolean;
  language?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  farmer: Farmer | null;
  user: UserProfile | null;
  token: string | null;
  phoneNumber: string;

  // Actions
  setPhoneNumber: (phone: string) => void;
  setUser: (user: Partial<UserProfile>) => void;
  setIsAuthenticated: (value: boolean) => void;
  setAuthenticated: (token: string, farmer: Farmer) => void;
  setOnboarded: (value: boolean) => void;
  updateFarmer: (updates: Partial<Farmer>) => void;
  logout: () => void;
}

const getStoredAuth = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('mandikart_farmer_token');
      const user = localStorage.getItem('mandikart_farmer_user');
      const farmer = localStorage.getItem('mandikart_farmer_data');
      if (token && user) {
        return {
          isAuthenticated: true,
          token,
          user: JSON.parse(user),
          farmer: farmer ? JSON.parse(farmer) : null,
        };
      }
    }
  } catch {}
  return { isAuthenticated: false, token: null, user: null, farmer: null };
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initialAuth.isAuthenticated,
  isOnboarded: initialAuth.isAuthenticated,
  farmer: initialAuth.farmer,
  user: initialAuth.user,
  token: initialAuth.token,
  phoneNumber: '',

  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

  setUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : (updates as UserProfile),
    })),

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  setAuthenticated: (token, farmer) => {
    const fAny = farmer as any;
    const userProfile: UserProfile = {
      id: farmer.id,
      name: farmer.fullName,
      phone: farmer.phone,
      state: fAny.state,
      district: fAny.district,
      isVerified: farmer.isVerified,
      role: 'FARMER',
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('mandikart_farmer_token', token);
        localStorage.setItem('mandikart_farmer_user', JSON.stringify(userProfile));
        localStorage.setItem('mandikart_farmer_data', JSON.stringify(farmer));
      }
    } catch {}
    set({
      isAuthenticated: true,
      token,
      farmer,
      user: userProfile,
    });
  },

  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  updateFarmer: (updates) =>
    set((state) => ({
      farmer: state.farmer ? { ...state.farmer, ...updates } : null,
    })),

  logout: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('mandikart_farmer_token');
        localStorage.removeItem('mandikart_farmer_user');
        localStorage.removeItem('mandikart_farmer_data');
      }
    } catch {}
    set({
      isAuthenticated: false,
      isOnboarded: false,
      farmer: null,
      user: null,
      token: null,
      phoneNumber: '',
    });
  },
}));
