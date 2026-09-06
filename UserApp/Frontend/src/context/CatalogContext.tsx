/**
 * MandiKart — CatalogContext
 * 
 * Provides a global live product catalog so any screen can look up a product
 * by its ID without relying on mock data.
 * 
 * Auto-refreshes every 4 seconds to reflect farmer listings, status changes,
 * and price updates seamlessly in real-time.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiClient';
import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../services/mockData';
import { supabase } from '../services/supabaseClient';

interface CatalogContextType {
  products: Product[];
  isLoading: boolean;
  getProductById: (id: string) => Product | undefined;
  refresh: (silent?: boolean) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType>({
  products: SAMPLE_PRODUCTS,
  isLoading: false,
  getProductById: (id) => SAMPLE_PRODUCTS.find((p) => p.id === id),
  refresh: async () => {},
});

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  const refresh = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      const live = await apiClient.catalog.search({ fresh: true });
      if (isMountedRef.current && live && live.length > 0) {
        setProducts(live);
      }
    } catch (err) {
      console.log('[CatalogContext] Refresh notice, keeping cached products:', err);
    } finally {
      if (isMountedRef.current && !silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // 1. Initial immediate fetch
    refresh(false);

    // 2. Auto-refresh every 4 seconds as requested to show newly listed products and price changes
    const interval = setInterval(() => {
      refresh(true);
    }, 4000);

    // 3. Supabase Realtime channel for sub-second push updates when farmer adds/edits a crop
    const channel = supabase
      .channel('public_products_catalog_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('[CatalogContext] Live product change event:', payload.eventType);
          refresh(true);
        }
      )
      .subscribe();

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      // First try live catalog
      const found = products.find((p) => p.id === id);
      if (found) return found;
      // Fallback to sample products
      return SAMPLE_PRODUCTS.find((p) => p.id === id);
    },
    [products]
  );

  return (
    <CatalogContext.Provider value={{ products, isLoading, getProductById, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

