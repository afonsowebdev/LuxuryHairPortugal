"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Product,
  Order,
  OrderStatus,
  Customer,
  Category,
  CategorySlug,
  Coupon,
  ContactMessage,
  NewsletterSubscriber,
} from "@/types";
import { categories as seedCategories } from "@/lib/data/categories";
import { coupons as seedCoupons } from "@/lib/data/coupons";
import { contactMessages as seedMessages, newsletterSubscribers as seedSubscribers } from "@/lib/data/messages";
import { defaultStoreSettings, type StoreSettings } from "@/lib/data/settings";
import { mapApiProduct, buildProductPayload, type ApiProduct } from "@/lib/mappers/product";
import { mapApiOrder, type ApiOrder } from "@/lib/mappers/order";
import { mapApiCustomer, type ApiCustomer } from "@/lib/mappers/customer";
import { getAdminToken, useAdminAuth } from "@/context/AdminAuthContext";

/**
 * Produtos, encomendas e clientes já vivem na base de dados real e chegam
 * via /api/products + /api/admin/*. Categorias, cupões, mensagens,
 * newsletter e definições ainda vivem em localStorage — ver "Loja primeiro"
 * no README para o que falta migrar.
 */
const KEYS = {
  categories: "lhp_admin_categories_v1",
  coupons: "lhp_admin_coupons_v1",
  messages: "lhp_admin_messages_v1",
  subscribers: "lhp_admin_subscribers_v1",
  settings: "lhp_admin_settings_v2",
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

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

async function fetchStoreProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products?limit=50");
    const json = (await res.json()) as ApiEnvelope<{ items: ApiProduct[] }>;
    if (!json.success || !json.data) return [];
    return json.data.items.map(mapApiProduct);
  } catch {
    return [];
  }
}

async function fetchCategoryIdBySlug(): Promise<Record<string, string>> {
  try {
    const res = await fetch("/api/categories");
    const json = (await res.json()) as ApiEnvelope<{ id: string; slug: string }[]>;
    if (!json.success || !json.data) return {};
    return Object.fromEntries(json.data.map((c) => [c.slug, c.id]));
  } catch {
    return {};
  }
}

const ORDER_STATUS_TO_ESTADO: Record<OrderStatus, string> = {
  "A aguardar pagamento": "PENDENTE",
  Pago: "PAGO",
  Enviado: "ENVIADO",
  Concluído: "ENTREGUE",
  Cancelado: "CANCELADO",
};

async function fetchAdminOrders(): Promise<Order[]> {
  const res = await callAdminApi<ApiOrder[]>("/admin/orders", "GET");
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiOrder);
}

async function fetchAdminCustomers(): Promise<Customer[]> {
  const res = await callAdminApi<ApiCustomer[]>("/admin/users", "GET");
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiCustomer);
}

async function callAdminApi<T>(endpoint: string, method: string, body?: unknown) {
  const token = getAdminToken();
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return (await res.json()) as ApiEnvelope<T>;
}

interface AdminDataContextValue {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  categories: Category[];
  coupons: Coupon[];
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
  settings: StoreSettings;
  /** false até os dados serem lidos do localStorage no cliente. */
  hydrated: boolean;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  updateOrderStatus: (id: string, status: OrderStatus) => void;

  updateCategory: (slug: CategorySlug, patch: Partial<Category>) => void;

  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  getCouponByCode: (code: string) => Coupon | undefined;

  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  addContactMessage: (message: Omit<ContactMessage, "id" | "createdAt" | "read">) => void;
  addNewsletterSubscriber: (email: string) => boolean;

  updateSettings: (next: StoreSettings) => void;

  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  /** Recarrega o catálogo a partir da API — chamado depois do checkout para refletir o stock atualizado. */
  refreshProducts: () => void;
}

const AdminDataContext = createContext<AdminDataContextValue | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryIdBySlug, setCategoryIdBySlug] = useState<Record<string, string>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [coupons, setCoupons] = useState<Coupon[]>(seedCoupons);
  const [messages, setMessages] = useState<ContactMessage[]>(seedMessages);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(seedSubscribers);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR, so admin data can only be
    // hydrated client-side after mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCategories(loadOrSeed(KEYS.categories, seedCategories));
    setCoupons(loadOrSeed(KEYS.coupons, seedCoupons));
    setMessages(loadOrSeed(KEYS.messages, seedMessages));
    setSubscribers(loadOrSeed(KEYS.subscribers, seedSubscribers));
    setSettings(loadOrSeed(KEYS.settings, defaultStoreSettings));
    /* eslint-enable react-hooks/set-state-in-effect */

    Promise.all([fetchStoreProducts(), fetchCategoryIdBySlug()]).then(([apiProducts, idBySlug]) => {
      setProducts(apiProducts);
      setCategoryIdBySlug(idBySlug);
      setHydrated(true);
    });
  }, []);

  // Encomendas e clientes são geridos no admin — só há um token para os
  // pedir quando a sessão de admin está autenticada.
  useEffect(() => {
    if (!isAdminAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders([]);
      setCustomers([]);
      return;
    }
    Promise.all([fetchAdminOrders(), fetchAdminCustomers()]).then(([apiOrders, apiCustomers]) => {
      setOrders(apiOrders);
      setCustomers(apiCustomers);
    });
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.categories, JSON.stringify(categories));
  }, [categories, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.coupons, JSON.stringify(coupons));
  }, [coupons, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.messages, JSON.stringify(messages));
  }, [messages, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.subscribers, JSON.stringify(subscribers));
  }, [subscribers, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  }, [settings, hydrated]);

  function addProduct(product: Product) {
    const categoriaId = categoryIdBySlug[product.category];
    if (!categoriaId) {
      console.error(`addProduct: categoria "${product.category}" desconhecida.`);
      return;
    }
    callAdminApi<ApiProduct>("/admin/products", "POST", buildProductPayload(product, categoriaId)).then(
      (res) => {
        if (res.success && res.data) {
          setProducts((prev) => [mapApiProduct(res.data as ApiProduct), ...prev]);
        } else {
          console.error("addProduct:", res.message);
        }
      }
    );
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    const current = products.find((p) => p.id === id);
    if (!current) return;
    const merged = { ...current, ...patch };
    const categoriaId = categoryIdBySlug[merged.category];
    if (!categoriaId) {
      console.error(`updateProduct: categoria "${merged.category}" desconhecida.`);
      return;
    }
    callAdminApi<ApiProduct>("/admin/products", "PUT", { id, ...buildProductPayload(merged, categoriaId) }).then(
      (res) => {
        if (res.success && res.data) {
          const updated = mapApiProduct(res.data as ApiProduct);
          setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        } else {
          console.error("updateProduct:", res.message);
        }
      }
    );
  }

  function deleteProduct(id: string) {
    callAdminApi("/admin/products", "DELETE", { id }).then((res) => {
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("deleteProduct:", res.message);
      }
    });
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    callAdminApi<ApiOrder>("/admin/orders", "PUT", { id, estado: ORDER_STATUS_TO_ESTADO[status] }).then(
      (res) => {
        if (res.success && res.data) {
          const updated = mapApiOrder(res.data);
          setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } else {
          console.error("updateOrderStatus:", res.message);
        }
      }
    );
  }

  function updateCategory(slug: CategorySlug, patch: Partial<Category>) {
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, ...patch } : c)));
  }

  function addCoupon(coupon: Coupon) {
    setCoupons((prev) => [coupon, ...prev]);
  }

  function updateCoupon(id: string, patch: Partial<Coupon>) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function deleteCoupon(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  const getCouponByCode = useCallback(
    (code: string) => coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()),
    [coupons]
  );

  function markMessageRead(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function addContactMessage(message: Omit<ContactMessage, "id" | "createdAt" | "read">) {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [newMessage, ...prev]);
  }

  function addNewsletterSubscriber(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    let added = false;
    setSubscribers((prev) => {
      if (prev.some((s) => s.email.toLowerCase() === normalized)) return prev;
      added = true;
      return [{ id: `sub-${Date.now()}`, email: email.trim(), createdAt: new Date().toISOString() }, ...prev];
    });
    return added;
  }

  function updateSettings(next: StoreSettings) {
    setSettings(next);
  }

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  function refreshProducts() {
    fetchStoreProducts().then(setProducts);
  }

  return (
    <AdminDataContext.Provider
      value={{
        products,
        orders,
        customers,
        categories,
        coupons,
        messages,
        subscribers,
        settings,
        hydrated,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        getCouponByCode,
        markMessageRead,
        deleteMessage,
        addContactMessage,
        addNewsletterSubscriber,
        updateSettings,
        getProductBySlug,
        getProductById,
        refreshProducts,
      }}
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
