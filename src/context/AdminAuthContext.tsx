"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const TOKEN_KEY = "lhp_admin_token";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

interface AuthResponse {
  token: string;
  user: { nome: string; email: string; role: "CLIENTE" | "ADMIN" };
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage is unavailable during SSR, so session state can only be
    // read client-side after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(!!window.localStorage.getItem(TOKEN_KEY));
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as ApiEnvelope<AuthResponse>;
      if (!json.success || !json.data || json.data.user.role !== "ADMIN") return false;

      window.localStorage.setItem(TOKEN_KEY, json.data.token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
