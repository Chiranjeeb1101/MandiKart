import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setApiAuthToken } from '../services/apiClient';

export interface BuyerProfile {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  buyerType: 'RETAIL' | 'BULK';
  city: string;
  state: string;
  role: string;
  avatarUrl?: string;
}

export type BuyerMode = 'RETAIL' | 'BULK';

interface AuthContextType {
  isAuthenticated: boolean;
  user: BuyerProfile | null;
  token: string | null;
  buyerMode: BuyerMode;
  setBuyerMode: (mode: BuyerMode) => void;
  toggleBuyerMode: () => void;
  signIn: (phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    phone: string;
    fullName: string;
    email?: string;
    password?: string;
    buyerType?: 'RETAIL' | 'BULK';
    city?: string;
    state?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (idToken?: string, email?: string, fullName?: string) => Promise<boolean>;
  signInWithPhoneOtp: (phone: string, otp: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  buyerMode: 'RETAIL',
  setBuyerMode: () => {},
  toggleBuyerMode: () => {},
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signInWithGoogle: async () => false,
  signInWithPhoneOtp: async () => ({ success: false }),
  signOut: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<BuyerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [buyerMode, setBuyerMode] = useState<BuyerMode>('RETAIL');

  useEffect(() => {
    // Restore saved session only if an actual user logged in previously
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedToken = localStorage.getItem('mandikart_buyer_token');
        const savedUser = localStorage.getItem('mandikart_buyer_user');
        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setToken(savedToken);
          setApiAuthToken(savedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleBuyerMode = () => {
    setBuyerMode((prev) => (prev === 'RETAIL' ? 'BULK' : 'RETAIL'));
  };

  const signIn = async (phoneOrEmail: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!phoneOrEmail) return { success: false, error: 'Mobile number or email is required' };
    try {
      const res = await apiClient.auth.login(phoneOrEmail, password);
      if (res?.token && res?.buyer) {
        setToken(res.token);
        setApiAuthToken(res.token);
        setUser(res.buyer as BuyerProfile);
        setIsAuthenticated(true);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('mandikart_buyer_token', res.token);
            localStorage.setItem('mandikart_buyer_user', JSON.stringify(res.buyer));
          }
        } catch {}
        return { success: true };
      }
      return { success: false, error: res?.error || 'Account not found. Please register first.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed.' };
    }
  };

  const signUp = async (params: {
    phone: string;
    fullName: string;
    email?: string;
    password?: string;
    buyerType?: 'RETAIL' | 'BULK';
    city?: string;
    state?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient.auth.register(params);
      if (res?.token && res?.buyer) {
        setToken(res.token);
        setApiAuthToken(res.token);
        setUser(res.buyer as BuyerProfile);
        setIsAuthenticated(true);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('mandikart_buyer_token', res.token);
            localStorage.setItem('mandikart_buyer_user', JSON.stringify(res.buyer));
          }
        } catch {}
        return { success: true };
      }
      return { success: false, error: res?.error || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const signInWithGoogle = async (idToken?: string, email?: string, fullName?: string): Promise<boolean> => {
    try {
      const res = await apiClient.auth.loginWithGoogle(idToken, email, fullName);
      const buyerObj = res?.buyer || (res as any)?.user;
      if (res?.token && buyerObj) {
        setToken(res.token);
        setApiAuthToken(res.token);
        setUser(buyerObj as BuyerProfile);
        setIsAuthenticated(true);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('mandikart_buyer_token', res.token);
            localStorage.setItem('mandikart_buyer_user', JSON.stringify(buyerObj));
          }
        } catch {}
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signInWithPhoneOtp = async (phone: string, otp: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    if (!phone) return { success: false, error: 'Phone number is required' };
    try {
      const res = await apiClient.auth.loginWithPhoneOtp(phone, otp, fullName);
      const buyerObj = res?.buyer || (res as any)?.user;
      if (res?.token && buyerObj) {
        setToken(res.token);
        setApiAuthToken(res.token);
        setUser(buyerObj as BuyerProfile);
        setIsAuthenticated(true);
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('mandikart_buyer_token', res.token);
            localStorage.setItem('mandikart_buyer_user', JSON.stringify(buyerObj));
          }
        } catch {}
        return { success: true };
      }
      return { success: false, error: res?.error || 'Invalid OTP code' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Phone OTP verification failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    setApiAuthToken(null);
    setIsAuthenticated(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('mandikart_buyer_token');
        localStorage.removeItem('mandikart_buyer_user');
      }
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        buyerMode,
        setBuyerMode,
        toggleBuyerMode,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithPhoneOtp,
        signOut,
        logout: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
