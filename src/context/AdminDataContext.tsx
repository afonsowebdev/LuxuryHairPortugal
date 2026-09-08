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
import { defaultStoreSettings, type StoreSettings } from "@/lib/data/settings";
import { mapApiProduct, buildProductPayload, type ApiProduct } from "@/lib/mappers/product";
import { mapApiOrder, type ApiOrder } from "@/lib/mappers/order";
import { mapApiCustomer, type ApiCustomer } from "@/lib/mappers/customer";
import { mapApiCategory, type ApiCategory } from "@/lib/mappers/category";
import { mapApiCoupon, buildCouponPayload, type ApiCoupon } from "@/lib/mappers/coupon";
import { mapApiMessage, mapApiSubscriber, type ApiContactMessage, type ApiNewsletterSubscriber } from "@/lib/mappers/message";
import { getAdminToken, useAdminAuth } from "@/context/AdminAuthContext";

/**
 * Toda a loja (catálogo, encomendas, clientes, categorias, cupões,
 * mensagens, newsletter e definições) já vive na base de dados real, via
 * /api/* (leitura pública) e /api/admin/* (gestão, autenticada por token de
 * admin).
 */
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

async function fetchStoreCategories(): Promise<Category[]> {
  try {
    const res = await fetch("/api/categories");
    const json = (await res.json()) as ApiEnvelope<ApiCategory[]>;
    if (!json.success || !json.data) return [];
    return json.data.map(mapApiCategory);
  } catch {
    return [];
  }
}

async function fetchStoreSettings(): Promise<StoreSettings | null> {
  try {
    const res = await fetch("/api/settings");
    const json = (await res.json()) as ApiEnvelope<StoreSettings>;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
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

async function fetchAdminCoupons(): Promise<Coupon[]> {
  const res = await callAdminApi<ApiCoupon[]>("/admin/coupons", "GET");
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiCoupon);
}

async function fetchAdminMessages(): Promise<ContactMessage[]> {
  const res = await callAdminApi<ApiContactMessage[]>("/admin/messages", "GET");
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiMessage);
}

async function fetchAdminSubscribers(): Promise<NewsletterSubscriber[]> {
  const res = await callAdminApi<ApiNewsletterSubscriber[]>("/admin/newsletter", "GET");
  if (!res.success || !res.data) return [];
  return res.data.map(mapApiSubscriber);
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
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([fetchStoreProducts(), fetchCategoryIdBySlug(), fetchStoreCategories(), fetchStoreSettings()]).then(
      ([apiProducts, idBySlug, apiCategories, apiSettings]) => {
        setProducts(apiProducts);
        setCategoryIdBySlug(idBySlug);
        if (apiCategories.length) setCategories(apiCategories);
        if (apiSettings) setSettings(apiSettings);
        setHydrated(true);
      }
    );
  }, []);

  // Encomendas, clientes, cupões e mensagens são geridos no admin — só há
  // um token para os pedir quando a sessão de admin está autenticada.
  useEffect(() => {
    if (!isAdminAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders([]);
      setCustomers([]);
      setCoupons([]);
      setMessages([]);
      setSubscribers([]);
      return;
    }
    Promise.all([
      fetchAdminOrders(),
      fetchAdminCustomers(),
      fetchAdminCoupons(),
      fetchAdminMessages(),
      fetchAdminSubscribers(),
    ]).then(([apiOrders, apiCustomers, apiCoupons, apiMessages, apiSubscribers]) => {
      setOrders(apiOrders);
      setCustomers(apiCustomers);
      setCoupons(apiCoupons);
      setMessages(apiMessages);
      setSubscribers(apiSubscribers);
    });
  }, [isAdminAuthenticated]);

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
    callAdminApi<ApiCategory>("/categories", "PUT", {
      slug,
      ...(patch.name !== undefined ? { nome: patch.name } : {}),
      ...(patch.description !== undefined ? { descricao: patch.description } : {}),
      ...(patch.photo !== undefined ? { imagem: patch.photo || null } : {}),
    }).then((res) => {
      if (!res.success) console.error("updateCategory:", res.message);
    });
  }

  function addCoupon(coupon: Coupon) {
    callAdminApi<ApiCoupon>("/admin/coupons", "POST", buildCouponPayload(coupon)).then((res) => {
      if (res.success && res.data) {
        setCoupons((prev) => [mapApiCoupon(res.data as ApiCoupon), ...prev]);
      } else {
        console.error("addCoupon:", res.message);
      }
    });
  }

  function updateCoupon(id: string, patch: Partial<Coupon>) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    callAdminApi<ApiCoupon>("/admin/coupons", "PUT", { id, ...buildCouponPayload(patch) }).then((res) => {
      if (!res.success) console.error("updateCoupon:", res.message);
    });
  }

  function deleteCoupon(id: string) {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    callAdminApi("/admin/coupons", "DELETE", { id }).then((res) => {
      if (!res.success) console.error("deleteCoupon:", res.message);
    });
  }

  function markMessageRead(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    callAdminApi("/admin/messages", "PUT", { id }).then((res) => {
      if (!res.success) console.error("markMessageRead:", res.message);
    });
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    callAdminApi("/admin/messages", "DELETE", { id }).then((res) => {
      if (!res.success) console.error("deleteMessage:", res.message);
    });
  }

  function addContactMessage(message: Omit<ContactMessage, "id" | "createdAt" | "read">) {
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: message.name,
        email: message.email,
        assunto: message.subject,
        mensagem: message.message,
      }),
    }).catch((error) => console.error("addContactMessage:", error));
  }

  function addNewsletterSubscriber(email: string): boolean {
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch((error) => console.error("addNewsletterSubscriber:", error));
    // A resposta chega de forma assíncrona; o formulário assume sucesso
    // otimista e mostra sempre a mesma confirmação por questões de UX.
    return true;
  }

  function updateSettings(next: StoreSettings) {
    setSettings(next);
    callAdminApi<StoreSettings>("/admin/settings", "PUT", next).then((res) => {
      if (!res.success) console.error("updateSettings:", res.message);
    });
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
