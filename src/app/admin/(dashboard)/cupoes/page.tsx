"use client";

import { useState, type FormEvent } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import { TrashIcon, PlusIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { formatEUR, formatDate } from "@/lib/format";
import type { Coupon } from "@/types";

const emptyForm = {
  code: "",
  type: "percentagem" as Coupon["type"],
  value: "",
  minOrderValue: "",
  expiresAt: "",
  usageLimit: "",
};

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminData();
  const { message, showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code || !form.value) return;
    if (coupons.some((c) => c.code.toUpperCase() === code)) {
      showToast("Já existe um cupão com este código.");
      return;
    }
    const coupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code,
      type: form.type,
      value: Number(form.value),
      active: true,
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    addCoupon(coupon);
    setForm(emptyForm);
    setShowForm(false);
    showToast(`Cupão "${code}" criado.`);
  }

  function handleDelete(coupon: Coupon) {
    if (window.confirm(`Eliminar o cupão "${coupon.code}"? Esta ação não pode ser revertida.`)) {
      deleteCoupon(coupon.id);
      showToast("Cupão eliminado.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">Cupões</h1>
          <p className="text-sm text-plum-dark/50">{coupons.length} cupões criados</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm((s) => !s)}>
          <PlusIcon className="h-4 w-4" />
          {showForm ? "Cancelar" : "Novo Cupão"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">Código *</span>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="BEMVINDA10"
              className="input uppercase"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">Tipo</span>
            <Select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Coupon["type"] }))}
              className="input"
            >
              <option value="percentagem">Percentagem (%)</option>
              <option value="fixo">Valor fixo (€)</option>
            </Select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">
              Valor {form.type === "percentagem" ? "(%)" : "(€)"} *
            </span>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">Compra mínima (€, opcional)</span>
            <input
              type="number"
              min={0}
              value={form.minOrderValue}
              onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">Expira em (opcional)</span>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-plum-dark/70">
              Limite de utilizações (opcional)
            </span>
            <input
              type="number"
              min={1}
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              className="input"
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" variant="primary" size="md">
              Criar Cupão
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-plum/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs uppercase tracking-wide text-plum-dark/50">
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Desconto</th>
              <th className="px-5 py-3">Utilizações</th>
              <th className="px-5 py-3">Expira</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-plum-dark/[0.02]">
                <td className="px-5 py-3 font-mono font-semibold text-plum-dark">{c.code}</td>
                <td className="px-5 py-3 text-plum-dark/70">
                  {c.type === "percentagem" ? `${c.value}%` : formatEUR(c.value)}
                  {c.minOrderValue ? (
                    <span className="text-xs text-plum-dark/40"> · min. {formatEUR(c.minOrderValue)}</span>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-plum-dark/70">
                  {c.usageCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="px-5 py-3 text-plum-dark/50">
                  {c.expiresAt ? formatDate(c.expiresAt) : "Sem expiração"}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => updateCoupon(c.id, { active: !c.active })}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${
                      c.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-plum-dark/10 text-plum-dark/50"
                    }`}
                  >
                    {c.active ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(c)}
                    className="rounded-lg p-2 text-plum-dark/60 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    aria-label={`Eliminar ${c.code}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-plum-dark/50">
                  Ainda não há cupões. Crie o primeiro para oferecer descontos na loja.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Toast message={message} />
    </div>
  );
}
