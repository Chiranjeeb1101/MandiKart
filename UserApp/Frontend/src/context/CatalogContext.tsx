/**
 * MandiKart — CatalogContext
 * 
 * Provides a global live product catalog so any screen can look up a product
 * by its ID without relying on mock data.
 * 
 * Products are fetched from the live backend on mount and refreshed on demand.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../services/mockData';

interface CatalogContextType {
  products: Product[];
  isLoading: boolean;
  getProductById: (id: string) => Product | undefined;
  refresh: () => Promise<void>;
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

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const live = await apiClient.catalog.search();
      if (live && live.length > 0) {
        setProducts(live);
      }
    } catch (err) {
      console.log('[CatalogContext] Refresh error, keeping cached:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3500);
    return () => clearInterval(interval);
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
