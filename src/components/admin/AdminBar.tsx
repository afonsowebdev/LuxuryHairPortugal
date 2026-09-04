"use client";

import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { DashboardIcon, LogoutIcon } from "@/components/ui/icons";

/**
 * Visível apenas na loja pública quando existe uma sessão de admin ativa —
 * liga o painel de gestão à navegação normal do site em vez de o deixar
 * isolado atrás de /admin.
 */
export function AdminBar() {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 bg-gold px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-plum-dark">
      <span className="flex items-center gap-1.5">
        <DashboardIcon className="h-3.5 w-3.5" />
        Sessão de administrador ativa
      </span>
      <Link href="/admin/dashboard" className="underline decoration-plum-dark/40 hover:decoration-plum-dark">
        Painel Admin
      </Link>
      <button
        onClick={logout}
        className="flex items-center gap-1 underline decoration-plum-dark/40 hover:decoration-plum-dark cursor-pointer"
      >
        <LogoutIcon className="h-3.5 w-3.5" />
        Sair
      </button>
    </div>
  );
}
