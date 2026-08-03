"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types";

const STORAGE_KEY = "lhp_cart_v1";

interface CartContextValue {
  lines: CartLine[];
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function lineKey(productId: string, variant: string) {
  return `${productId}__${variant}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount; localStorage is
    // unavailable during SSR, so this must run client-side after mount.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const key = lineKey(line.productId, line.variant);
      const existing = prev.find((l) => lineKey(l.productId, l.variant) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.variant) === key
            ? { ...l, quantity: Math.min(l.quantity + quantity, l.stock) }
            : l
        );
      }
      return [...prev, { ...line, quantity: Math.min(quantity, line.stock) }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variant: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.variant) !== lineKey(productId, variant)));
  }, []);

  const updateQuantity = useCallback((productId: string, variant: string, quantity: number) => {
    setLines((prev) =>
      prev.map((l) =>
        lineKey(l.productId, l.variant) === lineKey(productId, variant)
          ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
          : l
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value: CartContextValue = {
    lines,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
