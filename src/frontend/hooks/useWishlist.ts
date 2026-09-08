"use client";

import { useCallback, useEffect, useState } from "react";
import { apiCall } from "@/frontend/hooks/useApi";
import { useAuthContext } from "@/frontend/context/AuthContext";

export interface WishlistProduct {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  imagemPrincipal: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

// Ao contrário do carrinho, a wishlist não tem estado partilhado entre
// componentes via Context — cada chamada a este hook busca e mantém o seu
// próprio estado local, sincronizado com a API.
export function useWishlist() {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    const result = await apiCall<WishlistItem[]>("/wishlist");
    setItems(result.data ?? []);
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function add(productId: string) {
    if (!isAuthenticated) return { ok: false, error: "É necessário iniciar sessão." };
    const result = await apiCall("/wishlist", "POST", { productId });
    if (result.error) return { ok: false, error: result.error };
    await refresh();
    return { ok: true };
  }

  async function remove(id: string) {
    await apiCall(`/wishlist/${id}`, "DELETE");
    await refresh();
  }

  function isWishlisted(productId: string) {
    return items.some((item) => item.productId === productId);
  }

  async function toggle(productId: string) {
    const existing = items.find((item) => item.productId === productId);
    if (existing) return remove(existing.id);
    return add(productId);
  }

  return { items, loading, count: items.length, add, remove, toggle, isWishlisted, refresh };
}
