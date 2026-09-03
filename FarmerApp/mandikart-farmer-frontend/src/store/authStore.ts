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

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isOnboarded: false,
  farmer: null,
  user: {
    name: 'Ramesh Patel',
    district: 'Nashik',
    state: 'Maharashtra',
    farmerType: 'Individual Farmer',
    experience: '12 years',
    crops: ['Onion', 'Tomato', 'Wheat'],
  },
  token: null,
  phoneNumber: '',

  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

  setUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : (updates as UserProfile),
    })),

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  setAuthenticated: (token, farmer) =>
    set({
      isAuthenticated: true,
      token,
      farmer,
      user: {
        name: farmer.fullName,
        phone: farmer.phone,
      },
    }),

  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  updateFarmer: (updates) =>
    set((state) => ({
      farmer: state.farmer ? { ...state.farmer, ...updates } : null,
    })),

  logout: () =>
    set({
      isAuthenticated: false,
      isOnboarded: false,
      farmer: null,
      user: null,
      token: null,
      phoneNumber: '',
    }),
}));
