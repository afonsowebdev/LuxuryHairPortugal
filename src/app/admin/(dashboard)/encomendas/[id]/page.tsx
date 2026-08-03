"use client";

import { use } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { formatDateTime, formatEUR } from "@/lib/format";
import type { OrderStatus } from "@/types";

const statusOptions: OrderStatus[] = [
  "A aguardar pagamento",
  "Pago",
  "Enviado",
  "Concluído",
  "Cancelado",
];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, updateOrderStatus } = useAdminData();
  const { message, showToast } = useToast();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-serif text-xl text-plum-dark">Encomenda não encontrada</p>
        <Button href="/admin/encomendas" variant="primary" size="md">
          Voltar às Encomendas
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
            Encomenda {order.id}
          </h1>
          <p className="text-sm text-plum-dark/50">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
            <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">
              Itens da Encomenda
            </h2>
            <div className="divide-y divide-plum/10">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="flex justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-plum-dark">{item.name}</p>
                    <p className="text-xs text-plum-dark/50">
                      {item.variant} · Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-plum-dark">{formatEUR(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-1.5 border-t border-plum/10 pt-4 text-sm text-plum-dark/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatEUR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envio</span>
                <span>{order.shipping === 0 ? "Grátis" : formatEUR(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-serif text-base font-semibold text-plum-dark">
                <span>Total</span>
                <span className="text-bordeaux">{formatEUR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
            <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">
              Dados de Pagamento — Multibanco
            </h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-plum-dark/40">Entidade</p>
                <p className="font-serif text-lg font-semibold text-plum-dark">{order.entity}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-plum-dark/40">Referência</p>
                <p className="font-serif text-lg font-semibold text-plum-dark">{order.reference}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-plum-dark/40">Valor</p>
                <p className="font-serif text-lg font-semibold text-plum-dark">{formatEUR(order.total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
            <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">Cliente</h2>
            <div className="flex flex-col gap-1 text-sm text-plum-dark/70">
              <p className="font-medium text-plum-dark">{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
              <p className="mt-2">{order.customer.address}</p>
              <p>
                {order.customer.postalCode} {order.customer.city}
              </p>
              <p>{order.customer.country}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-plum/10">
            <h2 className="mb-4 font-serif text-lg font-semibold text-plum-dark">
              Atualizar Estado
            </h2>
            <select
              value={order.status}
              onChange={(e) => {
                updateOrderStatus(order.id, e.target.value as OrderStatus);
                showToast("Estado da encomenda atualizado.");
              }}
              className="input w-full"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Toast message={message} />
    </div>
  );
}
