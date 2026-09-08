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
import { getCustomerToken, useCustomerAuth } from "@/context/CustomerAuthContext";

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

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

interface ApiCartItem {
  id: string;
  productId: string;
  variante: string;
  quantidade: number;
  product: {
    slug: string;
    nome: string;
    preco: number;
    precoPromocional: number | null;
    imagemPrincipal: string | null;
    stock: number;
  };
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function lineKey(productId: string, variant: string) {
  return `${productId}__${variant}`;
}

function mapApiCartItem(item: ApiCartItem): CartLine & { cartId: string } {
  return {
    cartId: item.id,
    productId: item.productId,
    slug: item.product.slug,
    name: item.product.nome,
    image: item.product.nome,
    price: item.product.precoPromocional ?? item.product.preco,
    variant: item.variante || "Padrão",
    quantity: item.quantidade,
    stock: item.product.stock,
  };
}

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

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useCustomerAuth();
  const [lines, setLines] = useState<(CartLine & { cartId: string })[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const refresh = useCallback(() => {
    callApi<ApiCartItem[]>("/cart", "GET").then((res) => {
      if (res.success && res.data) setLines(res.data.map(mapApiCartItem));
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Ao autenticar, junta o carrinho anónimo (por cookie de sessão) ao do
  // utilizador e recarrega para refletir o resultado.
  useEffect(() => {
    if (!isAuthenticated) return;
    callApi("/cart/merge", "POST").then((res) => {
      if (res.success) refresh();
    });
  }, [isAuthenticated, refresh]);

  const addItem = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      callApi("/cart/add", "POST", { productId: line.productId, quantidade: quantity, variante: line.variant }).then(
        (res) => {
          if (res.success) {
            refresh();
            setDrawerOpen(true);
          }
        }
      );
    },
    [refresh]
  );

  const removeItem = useCallback(
    (productId: string, variant: string) => {
      const line = lines.find((l) => lineKey(l.productId, l.variant) === lineKey(productId, variant));
      if (!line) return;
      callApi(`/cart/${line.cartId}`, "DELETE").then((res) => {
        if (res.success) refresh();
      });
    },
    [lines, refresh]
  );

  const updateQuantity = useCallback(
    (productId: string, variant: string, quantity: number) => {
      const line = lines.find((l) => lineKey(l.productId, l.variant) === lineKey(productId, variant));
      if (!line) return;
      callApi(`/cart/${line.cartId}`, "PUT", { quantidade: quantity }).then((res) => {
        if (res.success) refresh();
      });
    },
    [lines, refresh]
  );

  const clearCart = useCallback(() => {
    callApi("/cart", "DELETE").then((res) => {
      if (res.success) setLines([]);
    });
  }, []);

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
