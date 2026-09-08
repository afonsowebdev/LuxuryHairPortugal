"use client";

import { useCallback, useEffect, useState } from "react";

export const AUTH_TOKEN_KEY = "lhp_auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Cliente HTTP central: envia sempre o JWT (se existir) no header
 * Authorization, inclui cookies (para o carrinho anónimo) e normaliza a
 * resposta de todos os endpoints, que seguem { success, data, message }.
 * Em caso de 401, limpa o token e reencaminha para o login.
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<ApiResult<T>> {
  const token = getAuthToken();

  try {
    const res = await fetch(`/api${endpoint}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/conta/entrar")) {
        window.location.href = "/conta/entrar";
      }
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    return {
      data: json.success ? json.data : null,
      error: json.success ? null : json.message || "Erro ao comunicar com o servidor.",
      status: res.status,
    };
  } catch {
    return { data: null, error: "Não foi possível ligar ao servidor.", status: 0 };
  }
}

/**
 * Para leituras simples (GET) que só precisam de { data, error, loading } —
 * mutações (POST/PUT/DELETE) devem chamar `apiCall` diretamente.
 */
export function useApiQuery<T = unknown>(endpoint: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(endpoint));

  const refetch = useCallback(() => {
    if (!endpoint) return;
    setLoading(true);
    apiCall<T>(endpoint).then((result) => {
      setData(result.data);
      setError(result.error);
      setLoading(false);
    });
  }, [endpoint]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch };
}
