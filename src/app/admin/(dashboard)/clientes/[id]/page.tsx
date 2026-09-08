"use client";

import { use } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { formatDate, formatDateTime, formatEUR } from "@/lib/format";

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { customers, orders } = useAdminData();

  const customer = customers.find((c) => c.id === id);
  const customerOrders = customer
    ? orders.filter((o) => o.customer.email.toLowerCase() === customer.email.toLowerCase())
    : [];

  if (!customer) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-serif text-xl text-plum-dark">Cliente não encontrado</p>
        <Button href="/admin/clientes" variant="primary" size="md">
          Voltar aos Clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/clientes" className="text-xs font-semibold text-bordeaux hover:underline">
          ← Voltar aos Clientes
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          {customer.name}
        </h1>
        <p className="text-sm text-plum-dark/50">Cliente desde {formatDate(customer.since)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-plum/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-plum-dark/40">
            Total Gasto
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold text-bordeaux">
            {formatEUR(customer.totalSpent)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-plum/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-plum-dark/40">
            Encomendas
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold text-plum-dark">
            {customer.ordersCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-plum/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-plum-dark/40">
            Valor Médio
          </p>
          <p className="mt-1 font-serif text-2xl font-semibold text-plum-dark">
            {formatEUR(customer.ordersCount ? customer.totalSpent / customer.ordersCount : 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-plum/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-plum-dark/40">
            Localização
          </p>
          <p className="mt-1 font-serif text-lg font-semibold text-plum-dark">
            {customer.location}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10 lg:col-span-2">
          <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">
            Histórico de Encomendas
          </h2>
          {customerOrders.length === 0 ? (
            <p className="text-sm text-plum-dark/50">Sem encomendas registadas.</p>
          ) : (
            <div className="flex flex-col divide-y divide-plum/10">
              {customerOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/encomendas/${o.id}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-bordeaux"
                >
                  <div>
                    <p className="font-medium text-plum-dark">{o.id}</p>
                    <p className="text-xs text-plum-dark/40">{formatDateTime(o.createdAt)}</p>
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
          <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">Contacto</h2>
          <div className="flex flex-col gap-2 text-sm text-plum-dark/70">
            <a href={`mailto:${customer.email}`} className="hover:text-bordeaux">
              {customer.email}
            </a>
            <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="hover:text-bordeaux">
              {customer.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
