"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * PROTOTYPE ONLY — hardcoded credentials with a sessionStorage flag.
 * A real implementation must authenticate against a backend (e.g. NextAuth,
 * a custom API with hashed passwords, or a third-party auth provider) and
 * never ship credentials in client-side code.
 */
const DEMO_EMAIL = "admin@luxuryhairportugal.pt";
const DEMO_PASSWORD = "luxury2026";
const SESSION_KEY = "lhp_admin_session";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sessionStorage is unavailable during SSR, so session state can only
    // be read client-side after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(window.sessionStorage.getItem(SESSION_KEY) === "true");
    setIsLoading(false);
  }, []);

  function login(email: string, password: string) {
    const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (ok) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
    }
    return ok;
  }

  function logout() {
    window.sessionStorage.removeItem(SESSION_KEY);
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

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
