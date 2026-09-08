"use client";

import { useCallback, useEffect, useState } from "react";
import { getCustomerToken, useCustomerAuth } from "@/context/CustomerAuthContext";
import { mapApiOrder, type ApiOrder } from "@/lib/mappers/order";
import type { Order } from "@/types";

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

/** Histórico de encomendas da conta autenticada, via /api/orders. */
export function useCustomerOrders() {
  const { isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    const token = getCustomerToken();
    if (!token) {
      setOrders([]);
      setHydrated(true);
      return;
    }
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((json: ApiEnvelope<ApiOrder[]>) => {
        if (json.success && json.data) setOrders(json.data.map(mapApiOrder));
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh, isAuthenticated]);

  return { orders, hydrated, refresh };
}
