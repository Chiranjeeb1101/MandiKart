import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  isHydrated: boolean;
  farmer: Farmer | null;
  user: UserProfile | null;
  token: string | null;
  phoneNumber: string;

  // Actions
  hydrateAuth: () => Promise<void>;
  setPhoneNumber: (phone: string) => void;
  setUser: (user: Partial<UserProfile>) => void;
  setIsAuthenticated: (value: boolean) => void;
  setAuthenticated: (token: string, farmer: Farmer) => void;
  setOnboarded: (value: boolean) => void;
  updateFarmer: (updates: Partial<Farmer>) => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  TOKEN: 'mandikart_farmer_token',
  USER: 'mandikart_farmer_user',
  FARMER: 'mandikart_farmer_data',
};

const persistAuth = async (token: string, user: UserProfile, farmer: Farmer) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
    }
  } catch {}
};

const clearPersistedAuth = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.FARMER);
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.FARMER);
    }
  } catch {}
};

const getStoredAuthSync = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      const farmer = localStorage.getItem(STORAGE_KEYS.FARMER);
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

const initialAuth = getStoredAuthSync();

const DEFAULT_FALLBACK_FARMER: any = {
  id: 'd1111111-1111-1111-1111-111111111111',
  fullName: 'Ramesh Patel',
  phone: '+919822011111',
  state: 'Maharashtra',
  district: 'Nashik',
  preferredLanguage: 'en',
  isVerified: true,
  role: 'FARMER',
};

const DEFAULT_FALLBACK_USER: UserProfile = {
  id: 'd1111111-1111-1111-1111-111111111111',
  name: 'Ramesh Patel',
  fullName: 'Ramesh Patel',
  phone: '+91 98220 11111',
  state: 'Maharashtra',
  district: 'Nashik',
  isVerified: true,
  role: 'FARMER',
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initialAuth.isAuthenticated || true,
  isOnboarded: true,
  isHydrated: false,
  farmer: initialAuth.farmer || DEFAULT_FALLBACK_FARMER,
  user: initialAuth.user || DEFAULT_FALLBACK_USER,
  token: initialAuth.token || 'mock_jwt_token_farmer_primary',
  phoneNumber: initialAuth.user?.phone || '+91 98220 11111',

  hydrateAuth: async () => {
    try {
      let token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      let userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      let farmerStr = await AsyncStorage.getItem(STORAGE_KEYS.FARMER);

      if (!token && typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        userStr = localStorage.getItem(STORAGE_KEYS.USER);
        farmerStr = localStorage.getItem(STORAGE_KEYS.FARMER);
      }

      if (token && (userStr || farmerStr)) {
        const user = userStr ? JSON.parse(userStr) : null;
        const farmer = farmerStr ? JSON.parse(farmerStr) : null;
        set({
          isAuthenticated: true,
          isOnboarded: true,
          token,
          user,
          farmer,
          isHydrated: true,
        });
        return;
      }
    } catch (e) {
      console.warn('[authStore] hydrateAuth error:', e);
    }
    set({ isHydrated: true });
  },

  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

  setUser: (updates) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : (updates as UserProfile);
      if (state.token) {
        persistAuth(state.token, updatedUser, state.farmer || ({} as any));
      }
      return { user: updatedUser };
    }),

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
    persistAuth(token, userProfile, farmer);
    set({
      isAuthenticated: true,
      isOnboarded: true,
      token,
      farmer,
      user: userProfile,
      isHydrated: true,
    });
  },

  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  updateFarmer: (updates) =>
    set((state) => {
      const updatedFarmer = state.farmer ? { ...state.farmer, ...updates } : null;
      if (updatedFarmer && state.token && state.user) {
        persistAuth(state.token, state.user, updatedFarmer);
      }
      return { farmer: updatedFarmer };
    }),

  logout: () => {
    clearPersistedAuth();
    set({
      isAuthenticated: false,
      isOnboarded: false,
      farmer: null,
      user: null,
      token: null,
      phoneNumber: '',
      isHydrated: true,
    });
  },
}));

// Auto-hydrate immediately upon module load
useAuthStore.getState().hydrateAuth();

