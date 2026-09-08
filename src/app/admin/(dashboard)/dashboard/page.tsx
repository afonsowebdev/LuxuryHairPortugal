"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { MetricCard } from "@/components/admin/MetricCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { PlusIcon, ClipboardIcon, MailIcon, SettingsIcon, TrendingUpIcon } from "@/components/ui/icons";
import { formatEUR, formatDate } from "@/lib/format";

function QuickAction({
  href,
  label,
  icon: Icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="relative flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-medium text-plum-dark ring-1 ring-plum/10 transition-colors hover:bg-plum-dark/5"
    >
      <Icon className="h-4 w-4 text-bordeaux" />
      {label}
      {!!badge && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-plum-dark">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { products, orders, customers, messages } = useAdminData();

  const revenue = useMemo(
    () => orders.filter((o) => o.status !== "Cancelado").reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const pendingCount = orders.filter((o) => o.status === "A aguardar pagamento").length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);
  const unreadMessages = messages.filter((m) => !m.read).length;

  const monthlyRevenue = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "Cancelado") continue;
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString("pt-PT", { month: "short" });
      buckets.set(key, (buckets.get(key) ?? 0) + o.total);
    }
    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  }, [orders]);

  const bestSellers = useMemo(() => {
    const sold = new Map<string, number>();
    for (const o of orders) {
      if (o.status === "Cancelado") continue;
      for (const item of o.items) {
        sold.set(item.productId, (sold.get(item.productId) ?? 0) + item.quantity);
      }
    }
    return Array.from(sold.entries())
      .map(([productId, qty]) => ({ product: products.find((p) => p.id === productId), qty }))
      .filter((e): e is { product: NonNullable<typeof e.product>; qty: number } => !!e.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders, products]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-plum-dark/50">Visão geral da loja Luxury Hair Portugal.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction href="/admin/produtos/novo" label="Novo Produto" icon={PlusIcon} />
        <QuickAction href="/admin/encomendas" label="Encomendas" icon={ClipboardIcon} badge={pendingCount} />
        <QuickAction href="/admin/mensagens" label="Mensagens" icon={MailIcon} badge={unreadMessages} />
        <QuickAction href="/admin/definicoes" label="Definições" icon={SettingsIcon} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Receita Total" value={formatEUR(revenue)} hint={`${orders.length} encomendas`} accent />
        <MetricCard label="Encomendas" value={String(orders.length)} hint={`${pendingCount} a aguardar pagamento`} />
        <MetricCard label="Clientes" value={String(customers.length)} hint="clientes registados" />
        <MetricCard
          label="Stock Baixo"
          value={String(lowStock.length)}
          hint={`${outOfStock.length} esgotados`}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="mb-6 font-serif text-lg font-semibold text-plum-dark">
          Receita por Mês
        </h2>
        {monthlyRevenue.length > 0 ? (
          <RevenueChart data={monthlyRevenue} />
        ) : (
          <p className="text-sm text-plum-dark/50">Sem dados suficientes.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-plum-dark">Últimas Encomendas</h2>
            <Link href="/admin/encomendas" className="text-xs font-semibold text-bordeaux hover:underline">
              Ver todas
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-plum-dark/50">Ainda não há encomendas.</p>
          ) : (
            <div className="flex flex-col divide-y divide-plum/10">
              {orders.slice(0, 5).map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/encomendas/${o.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-bordeaux"
                >
                  <div>
                    <p className="font-medium text-plum-dark">{o.id}</p>
                    <p className="text-xs text-plum-dark/40">
                      {o.customer.name} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-plum-dark">{formatEUR(o.total)}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4 text-bordeaux" />
            <h2 className="font-serif text-lg font-semibold text-plum-dark">Mais Vendidos</h2>
          </div>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-plum-dark/50">
              Ainda sem vendas suficientes para calcular os mais vendidos.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-plum/10">
              {bestSellers.map(({ product, qty }) => (
                <Link
                  key={product.id}
                  href={`/admin/produtos/${product.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-bordeaux"
                >
                  <span className="truncate font-medium text-plum-dark">{product.name}</span>
                  <span className="shrink-0 rounded-full bg-plum-dark/5 px-2.5 py-0.5 text-xs font-semibold text-plum-dark/70">
                    {qty} vendidos
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-plum-dark">Stock Baixo</h2>
            <Link href="/admin/produtos" className="text-xs font-semibold text-bordeaux hover:underline">
              Gerir produtos
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-plum-dark/50">
              Ainda não há produtos no catálogo.{" "}
              <Link href="/admin/produtos/novo" className="font-semibold text-bordeaux hover:underline">
                Adicionar o primeiro produto
              </Link>
              .
            </p>
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-plum-dark/50">Todos os produtos têm stock saudável.</p>
          ) : (
            <div className="flex flex-col divide-y divide-plum/10">
              {lowStock.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/produtos/${p.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-bordeaux"
                >
                  <span className="truncate font-medium text-plum-dark">{p.name}</span>
                  <span className="shrink-0 rounded-full bg-bordeaux/10 px-2.5 py-0.5 text-xs font-semibold text-bordeaux">
                    {p.stock} unid.
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
