import React, { createContext, useContext, useState } from 'react';
import { apiClient, setApiAuthToken } from '../services/apiClient';

export interface BuyerProfile {
  id: string;
  fullName: string;
  phone: string;
  buyerType: 'RETAIL' | 'BULK';
  city: string;
  state: string;
  role: string;
}

export type BuyerMode = 'RETAIL' | 'BULK';

interface AuthContextType {
  isAuthenticated: boolean;
  user: BuyerProfile | null;
  token: string | null;
  buyerMode: BuyerMode;
  setBuyerMode: (mode: BuyerMode) => void;
  toggleBuyerMode: () => void;
  signIn: (phone?: string, otp?: string) => Promise<boolean>;
  signOut: () => void;
  logout: () => void;
}

const DEFAULT_BUYER: BuyerProfile = {
  id: 'buyer_default_01',
  fullName: 'Aarav Sharma',
  phone: '+91 9876543210',
  buyerType: 'RETAIL',
  city: 'Pune',
  state: 'Maharashtra',
  role: 'BUYER',
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  user: DEFAULT_BUYER,
  token: 'demo_token_123',
  buyerMode: 'RETAIL',
  setBuyerMode: () => {},
  toggleBuyerMode: () => {},
  signIn: async () => true,
  signOut: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<BuyerProfile | null>(DEFAULT_BUYER);
  const [token, setToken] = useState<string | null>('demo_token_123');
  const [buyerMode, setBuyerMode] = useState<BuyerMode>('RETAIL');

  const toggleBuyerMode = () => {
    setBuyerMode((prev) => (prev === 'RETAIL' ? 'BULK' : 'RETAIL'));
  };

  const signIn = async (phone?: string, _otp?: string): Promise<boolean> => {
    try {
      const res = await apiClient.auth.login(phone || '9876543210');
      setToken(res.token);
      setApiAuthToken(res.token);
      setUser(res.buyer as BuyerProfile);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(true);
      return true;
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    setApiAuthToken(null);
    setIsAuthenticated(false);
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
        signOut,
        logout: signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
