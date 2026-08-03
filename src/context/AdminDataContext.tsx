"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product, Order, OrderStatus } from "@/types";
import { products as seedProducts } from "@/lib/data/products";
import { orders as seedOrders } from "@/lib/data/orders";
import { customers as seedCustomers } from "@/lib/data/customers";
import type { Customer } from "@/types";

/**
 * PROTOTYPE ONLY — admin CRUD operates on localStorage-backed copies of the
 * mock catalog/orders/customers so the dashboard feels real across reloads.
 * A production backend should replace this with real API calls (REST/GraphQL)
 * against a database, with proper authorization on every mutation.
 */
const KEYS = {
  products: "lhp_admin_products",
  orders: "lhp_admin_orders",
  customers: "lhp_admin_customers",
};

function loadOrSeed<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore corrupted storage
  }
  window.localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

interface AdminDataContextValue {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so admin data can only be
    // hydrated client-side after mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    setProducts(loadOrSeed(KEYS.products, seedProducts));
    setOrders(loadOrSeed(KEYS.orders, seedOrders));
    setCustomers(loadOrSeed(KEYS.customers, seedCustomers));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.products, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.orders, JSON.stringify(orders));
  }, [orders, hydrated]);

  function addProduct(product: Product) {
    setProducts((prev) => [product, ...prev]);
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <AdminDataContext.Provider
      value={{ products, orders, customers, addProduct, updateProduct, deleteProduct, updateOrderStatus }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
