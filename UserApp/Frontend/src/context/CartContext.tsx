import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { SAMPLE_PRODUCTS } from '../services/mockData';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQty: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  couponCode: string;
  couponApplied: boolean;
  appliedDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  couponSavings: number;
  total: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [
  { id: 'ci-1', product: SAMPLE_PRODUCTS[0], quantity: 2 }, // Fresh Tomatoes
  { id: 'ci-2', product: SAMPLE_PRODUCTS[2], quantity: 1 }, // Alphonso Mangoes
  { id: 'ci-3', product: SAMPLE_PRODUCTS[7], quantity: 1 }, // Farm Fresh Eggs
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { id: `ci-${Date.now()}`, product, quantity }];
    });
  };

  const updateQty = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'MANDI10' || formatted === 'FRESH') {
      setCouponCode(formatted);
      setAppliedDiscount(10);
      setCouponApplied(true);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setAppliedDiscount(0);
    setCouponCode('');
  };

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const couponSavings = couponApplied ? Math.round((subtotal * appliedDiscount) / 100) : 0;
  const deliveryThreshold = 500;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= deliveryThreshold ? 0 : 40;
  const handlingFee = items.length > 0 ? 5 : 0;
  const total = Math.max(0, subtotal - couponSavings + deliveryFee + handlingFee);
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        couponCode,
        couponApplied,
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        handlingFee,
        couponSavings,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
