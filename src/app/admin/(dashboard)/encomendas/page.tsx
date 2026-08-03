"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { formatDate, formatEUR } from "@/lib/format";
import type { OrderStatus } from "@/types";
import { EyeIcon } from "@/components/ui/icons";

const statusTabs: (OrderStatus | "Todas")[] = [
  "Todas",
  "A aguardar pagamento",
  "Pago",
  "Enviado",
  "Concluído",
  "Cancelado",
];

export default function AdminOrdersPage() {
  const { orders } = useAdminData();
  const [status, setStatus] = useState<OrderStatus | "Todas">("Todas");

  const filtered = useMemo(
    () => (status === "Todas" ? orders : orders.filter((o) => o.status === status)),
    [orders, status]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Encomendas
        </h1>
        <p className="text-sm text-plum-dark/50">{orders.length} encomendas registadas</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              status === s
                ? "bg-plum-dark text-cream"
                : "bg-white text-plum-dark/60 ring-1 ring-plum/10 hover:bg-plum-dark/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-plum/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs uppercase tracking-wide text-plum-dark/50">
              <th className="px-5 py-3">Encomenda</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Referência MB</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum/5">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-plum-dark/[0.02]">
                <td className="px-5 py-3 font-medium text-plum-dark">{o.id}</td>
                <td className="px-5 py-3 text-plum-dark/70">{o.customer.name}</td>
                <td className="px-5 py-3 text-plum-dark/70">{formatDate(o.createdAt)}</td>
                <td className="px-5 py-3 text-plum-dark/50">{o.entity} / {o.reference}</td>
                <td className="px-5 py-3 font-semibold text-plum-dark">{formatEUR(o.total)}</td>
                <td className="px-5 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/encomendas/${o.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-plum-dark/60 hover:bg-plum-dark/5 hover:text-plum-dark"
                    aria-label={`Ver encomenda ${o.id}`}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-plum-dark/50">
                  Nenhuma encomenda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
