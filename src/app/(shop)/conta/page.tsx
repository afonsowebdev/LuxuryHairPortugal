"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { ClipboardIcon, LogoutIcon, MailIcon } from "@/components/ui/icons";
import { formatDate, formatEUR } from "@/lib/format";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function CustomerAccountPage() {
  const { customer, hydrated, logout } = useCustomerAuth();
  const { orders } = useCustomerOrders();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !customer) {
      router.replace("/conta/entrar");
    }
  }, [hydrated, customer, router]);

  const myOrders = useMemo(
    () => [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [orders]
  );

  const totalSpent = useMemo(
    () => myOrders.reduce((sum, o) => sum + o.total, 0),
    [myOrders]
  );

  if (!hydrated || !customer) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-plum-dark/50">
        A verificar sessão...
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="A Minha Conta" title={`Olá, ${customer.name.split(" ")[0]}`} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-72">
            <div className="flex flex-col gap-5 border border-plum/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-plum-dark font-serif text-sm font-semibold text-gold">
                  {initials(customer.name)}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate font-serif text-base font-semibold text-plum-dark"
                    title={customer.name}
                  >
                    {customer.name}
                  </p>
                  <p
                    className="flex items-center gap-1.5 truncate text-xs text-plum-dark/50"
                    title={customer.email}
                  >
                    <MailIcon className="h-3.5 w-3.5 shrink-0" />
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-plum/10 border-y border-plum/10 py-4">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-serif text-xl font-semibold text-plum-dark">
                    {myOrders.length}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-plum-dark/40">
                    Encomendas
                  </span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-serif text-xl font-semibold text-bordeaux">
                    {formatEUR(totalSpent)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-plum-dark/40">
                    Total Gasto
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center justify-center gap-2 border border-plum/15 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-plum-dark transition-colors hover:border-bordeaux hover:text-bordeaux cursor-pointer"
              >
                <LogoutIcon className="h-4 w-4" />
                Terminar Sessão
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <h2 className="mb-5 flex items-center gap-2 font-serif text-xl font-semibold text-plum-dark">
              <ClipboardIcon className="h-5 w-5 text-gold" />
              As Minhas Encomendas
            </h2>

            {myOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border border-dashed border-plum/20 px-6 py-16 text-center">
                <ClipboardIcon className="h-6 w-6 text-plum-dark/30" />
                <div className="space-y-1.5">
                  <p className="font-serif text-lg font-semibold text-plum-dark">
                    Ainda sem encomendas
                  </p>
                  <p className="max-w-sm text-sm text-plum-dark/60">
                    Quando fizer a sua primeira compra, vai poder acompanhar aqui o estado da
                    encomenda.
                  </p>
                </div>
                <Button href="/loja" variant="primary" size="lg" className="mt-1">
                  Ir para a Loja
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/encomenda-recebida/${order.id}`}
                    className="flex flex-col gap-3 border border-plum/10 bg-white p-5 transition-colors hover:border-gold/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-serif text-base font-semibold text-plum-dark">
                        Encomenda {order.reference}
                      </p>
                      <p className="mt-1 text-xs text-plum-dark/50">
                        {formatDate(order.createdAt)} · {order.items.length}{" "}
                        {order.items.length === 1 ? "artigo" : "artigos"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-serif font-semibold text-bordeaux">
                        {formatEUR(order.total)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
