"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const TOKEN_KEY = "lhp_customer_token";

export interface CustomerSession {
  name: string;
  email: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface CustomerAuthContextValue {
  customer: CustomerSession | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

interface MeResponse {
  nome: string;
  email: string;
  role: "CLIENTE" | "ADMIN";
}

interface AuthResponse {
  token: string;
  user: { nome: string; email: string; role: "CLIENTE" | "ADMIN" };
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

async function callApi<T>(endpoint: string, method: string, body?: unknown, token?: string) {
  try {
    const res = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const json = (await res.json()) as ApiEnvelope<T>;
    return json;
  } catch {
    return { success: false, data: null, message: "Não foi possível ligar ao servidor." } as ApiEnvelope<T>;
  }
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(true);
      return;
    }

    callApi<MeResponse>("/auth/me", "GET", undefined, token).then((res) => {
      if (res.success && res.data) {
        setCustomer({ name: res.data.nome, email: res.data.email });
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
      setHydrated(true);
    });
  }, []);

  async function register(name: string, email: string, password: string): Promise<AuthResult> {
    const res = await callApi<AuthResponse>("/auth/register", "POST", { nome: name, email, password });
    if (!res.success || !res.data) return { ok: false, error: res.message || "Não foi possível criar a conta." };

    window.localStorage.setItem(TOKEN_KEY, res.data.token);
    setCustomer({ name: res.data.user.nome, email: res.data.user.email });
    return { ok: true };
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    const res = await callApi<AuthResponse>("/auth/login", "POST", { email, password });
    if (!res.success || !res.data) return { ok: false, error: res.message || "Não foi possível iniciar sessão." };

    window.localStorage.setItem(TOKEN_KEY, res.data.token);
    setCustomer({ name: res.data.user.nome, email: res.data.user.email });
    return { ok: true };
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider
      value={{ customer, isAuthenticated: !!customer, hydrated, register, login, logout }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
