"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiCall } from "@/frontend/hooks/useApi";
import { useAuthContext } from "@/frontend/context/AuthContext";

export interface CartProduct {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  precoPromocional?: number | null;
  imagemPrincipal: string;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantidade: number;
  product: CartProduct;
}

interface MutationResult {
  ok: boolean;
  error?: string;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  loading: boolean;
  addItem: (productId: string, quantidade?: number) => Promise<MutationResult>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, quantidade: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Nota: tem de ser montado dentro de <AuthProvider> — usa o estado de
// autenticação para saber quando juntar o carrinho anónimo ao da conta.
export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const result = await apiCall<CartItem[]>("/cart");
    setItems(result.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  // Depois de autenticar, junta o carrinho anónimo (cookie de sessão) ao
  // carrinho da conta, uma única vez por transição de sessão.
  useEffect(() => {
    if (!isAuthenticated) return;
    apiCall("/cart/merge", "POST").then(() => refresh());
  }, [isAuthenticated]);

  async function addItem(productId: string, quantidade = 1): Promise<MutationResult> {
    const result = await apiCall<CartItem>("/cart/add", "POST", { productId, quantidade });
    if (!result.data) return { ok: false, error: result.error ?? "Não foi possível adicionar ao carrinho." };
    await refresh();
    return { ok: true };
  }

  async function removeItem(id: string) {
    await apiCall(`/cart/${id}`, "DELETE");
    await refresh();
  }

  async function updateQty(id: string, quantidade: number) {
    await apiCall(`/cart/${id}`, "PUT", { quantidade });
    await refresh();
  }

  async function clearCart() {
    await apiCall("/cart", "DELETE");
    setItems([]);
  }

  async function syncCart() {
    await apiCall("/cart/merge", "POST");
    await refresh();
  }

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.precoPromocional ?? item.product.preco) * item.quantidade,
        0
      ),
    [items]
  );
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantidade, 0), [items]);

  const value: CartContextValue = {
    items,
    total,
    count,
    loading,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
