"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiCall, getAuthToken, setAuthToken, clearAuthToken } from "@/frontend/hooks/useApi";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  morada?: string | null;
  cidade?: string | null;
  pais: string;
  role: "CLIENTE" | "ADMIN";
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface RegisterInput {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
  morada?: string;
  cidade?: string;
  pais?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const existingToken = getAuthToken();
    if (!existingToken) {
      setLoading(false);
      return;
    }

    const result = await apiCall<AuthUser>("/auth/me");
    if (result.data) {
      setToken(existingToken);
      setUser(result.data);
    } else {
      clearAuthToken();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function login(email: string, password: string): Promise<AuthResult> {
    const result = await apiCall<{ token: string; user: AuthUser }>("/auth/login", "POST", {
      email,
      password,
    });
    if (!result.data) return { ok: false, error: result.error ?? "Não foi possível iniciar sessão." };

    setAuthToken(result.data.token);
    setToken(result.data.token);
    setUser(result.data.user);
    return { ok: true };
  }

  async function register(input: RegisterInput): Promise<AuthResult> {
    const result = await apiCall<{ token: string; user: AuthUser }>("/auth/register", "POST", input);
    if (!result.data) return { ok: false, error: result.error ?? "Não foi possível criar a conta." };

    setAuthToken(result.data.token);
    setToken(result.data.token);
    setUser(result.data.user);
    return { ok: true };
  }

  function logout() {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
