"use client";

import { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { formatDate, formatEUR } from "@/lib/format";
import { SearchIcon } from "@/components/ui/icons";

export default function AdminCustomersPage() {
  const { customers } = useAdminData();
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">Clientes</h1>
        <p className="text-sm text-plum-dark/50">{customers.length} clientes registados</p>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por nome ou email..."
          className="w-full rounded-xl border border-plum/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gold"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-plum/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs uppercase tracking-wide text-plum-dark/50">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Localização</th>
              <th className="px-5 py-3">Encomendas</th>
              <th className="px-5 py-3">Total Gasto</th>
              <th className="px-5 py-3">Cliente Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum/5">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-plum-dark/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-medium text-plum-dark">{c.name}</p>
                  <p className="text-xs text-plum-dark/50">{c.email}</p>
                </td>
                <td className="px-5 py-3 text-plum-dark/70">{c.location}</td>
                <td className="px-5 py-3 text-plum-dark/70">{c.ordersCount}</td>
                <td className="px-5 py-3 font-semibold text-plum-dark">{formatEUR(c.totalSpent)}</td>
                <td className="px-5 py-3 text-plum-dark/50">{formatDate(c.since)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-plum-dark/50">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
