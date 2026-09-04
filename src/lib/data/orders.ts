import type { Order } from "@/types";

/**
 * Sem encomendas de exemplo — as encomendas reais são criadas pelo checkout
 * (ver AdminDataContext.placeOrder) e vivem em localStorage.
 */
export const orders: Order[] = [];
