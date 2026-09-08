"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { formatDate, formatEUR } from "@/lib/format";
import type { OrderStatus } from "@/types";
import { EyeIcon, SearchIcon, DownloadIcon } from "@/components/ui/icons";
import { downloadCsv } from "@/lib/csv";

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
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = status === "Todas" ? orders : orders.filter((o) => o.status === status);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, status, search]);

  function handleExport() {
    downloadCsv(
      "encomendas.csv",
      filtered.map((o) => ({
        id: o.id,
        cliente: o.customer.name,
        email: o.customer.email,
        data: formatDate(o.createdAt),
        subtotal: o.subtotal,
        envio: o.shipping,
        desconto: o.discount ?? 0,
        total: o.total,
        estado: o.status,
        pagamento: o.paymentMethod,
      }))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
            Encomendas
          </h1>
          <p className="text-sm text-plum-dark/50">{orders.length} encomendas registadas</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 rounded-xl border border-plum/15 bg-white px-4 py-2.5 text-sm text-plum-dark hover:bg-plum-dark/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <DownloadIcon className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="relative max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar nº, cliente ou email..."
            className="w-full rounded-xl border border-plum/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gold"
          />
        </div>
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
