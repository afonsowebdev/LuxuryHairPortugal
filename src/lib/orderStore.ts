import type { Order } from "@/types";

/**
 * PROTOTYPE ONLY — orders placed during checkout are kept in sessionStorage
 * so the confirmation page can render them. A real implementation should
 * persist the order server-side (database) and generate the Multibanco
 * reference through the payment provider's API before ever showing it to
 * the customer.
 */
const STORAGE_PREFIX = "lhp_order_";

export function savePendingOrder(order: Order) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(`${STORAGE_PREFIX}${order.id}`, JSON.stringify(order));
}

export function getPendingOrder(orderId: string): Order | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${orderId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}
