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
import { usePathname, useRouter } from "next/navigation";
import { getCustomerToken, useCustomerAuth } from "@/context/CustomerAuthContext";

interface WishlistContextValue {
  productIds: string[];
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  count: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

interface ApiWishlistItem {
  id: string;
  productId: string;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

async function callApi<T>(endpoint: string, method: string, body?: unknown) {
  const token = getCustomerToken();
  try {
    const res = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return { success: false, data: null, message: "Não foi possível ligar ao servidor." } as ApiEnvelope<T>;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<ApiWishlistItem[]>([]);

  const refresh = useCallback(() => {
    if (!getCustomerToken()) {
      setItems([]);
      return;
    }
    callApi<ApiWishlistItem[]>("/wishlist", "GET").then((res) => {
      if (res.success && res.data) setItems(res.data);
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh, isAuthenticated]);

  const toggle = useCallback(
    (productId: string) => {
      if (!isAuthenticated) {
        router.push(`/conta/entrar?redirect=${encodeURIComponent(pathname || "/")}`);
        return;
      }

      const existing = items.find((i) => i.productId === productId);
      if (existing) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
        callApi(`/wishlist/${existing.id}`, "DELETE").then((res) => {
          if (!res.success) refresh();
        });
      } else {
        setItems((prev) => [...prev, { id: `pending-${productId}`, productId }]);
        callApi<ApiWishlistItem>("/wishlist", "POST", { productId }).then(() => refresh());
      }
    },
    [isAuthenticated, items, pathname, refresh, router]
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const productIds = useMemo(() => items.map((i) => i.productId), [items]);

  const value: WishlistContextValue = {
    productIds,
    isWishlisted,
    toggle,
    count: productIds.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
