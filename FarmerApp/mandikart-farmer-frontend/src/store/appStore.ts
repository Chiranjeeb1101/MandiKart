/**
 * MandiKart — Zustand App Store
 *
 * Global client-side UI state (e.g. language, theme overrides).
 */

import { create } from 'zustand';

export type LanguageCode = 'en' | 'hi' | 'or' | 'mr' | 'pa' | 'ta' | 'te' | 'bn' | 'gu' | 'kn';

interface AppState {
  language: LanguageCode;
  isOffline: boolean;
  
  // Actions
  setLanguage: (lang: LanguageCode) => void;
  setOffline: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  isOffline: false,

  setLanguage: (language) => set({ language }),
  setOffline: (isOffline) => set({ isOffline }),
}));
