"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  DashboardIcon,
  BoxIcon,
  ClipboardIcon,
  UsersIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/icons";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/produtos", label: "Produtos", icon: BoxIcon },
  { href: "/admin/encomendas", label: "Encomendas", icon: ClipboardIcon },
  { href: "/admin/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/admin/definicoes", label: "Definições", icon: SettingsIcon },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-plum-dark/50">
        A verificar sessão...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-plum/10 bg-plum-dark px-5 py-6 lg:flex">
        <Logo variant="gold" href="" className="mb-10 self-start scale-75 origin-left" />
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-gold/15 text-gold font-semibold" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            logout();
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream cursor-pointer"
        >
          <LogoutIcon className="h-4 w-4" />
          Terminar Sessão
        </button>
        <Link href="/" className="mt-4 text-center text-[11px] text-cream/30 hover:text-gold">
          ← Voltar à loja
        </Link>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-plum-dark/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-plum-dark px-5 py-6">
            <div className="mb-8 flex items-center justify-between">
              <Logo variant="gold" href="" className="scale-75 origin-left" />
              <button onClick={() => setMobileOpen(false)} className="text-cream">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                      active ? "bg-gold/15 text-gold font-semibold" : "text-cream/70"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/50 cursor-pointer"
            >
              <LogoutIcon className="h-4 w-4" />
              Terminar Sessão
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-plum/10 bg-cream px-4 py-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="text-plum-dark">
            <MenuIcon className="h-6 w-6" />
          </button>
          <Logo variant="plum" href="" className="scale-[0.6] origin-right" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
