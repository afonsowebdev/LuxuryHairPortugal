"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getPendingOrder } from "@/lib/orderStore";
import type { Order } from "@/types";
import { MultibancoDetails } from "@/components/checkout/MultibancoDetails";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { formatEUR, formatDateTime } from "@/lib/format";

export default function OrderReceivedPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // sessionStorage is unavailable during SSR, so the order can only be
    // read client-side after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(getPendingOrder(orderId));
  }, [orderId]);

  if (order === undefined) {
    return <div className="py-24 text-center text-sm text-plum-dark/50">A carregar...</div>;
  }

  if (order === null) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold text-plum-dark">
          Encomenda não encontrada
        </h1>
        <p className="text-sm text-plum-dark/60">
          Não foi possível encontrar os detalhes desta encomenda nesta sessão.
        </p>
        <Button href="/loja" variant="primary" size="lg">
          Voltar à Loja
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
          🎀
        </span>
        <h1 className="font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">
          Obrigada pela sua encomenda!
        </h1>
        <p className="text-sm text-plum-dark/60">
          Encomenda <span className="font-semibold text-plum-dark">{order.id}</span> recebida em{" "}
          {formatDateTime(order.createdAt)}
        </p>
        <OrderStatusBadge status={order.status} />
      </div>

      <MultibancoDetails entity={order.entity} reference={order.reference} amount={order.total} />

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-plum-dark/5 p-6">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Detalhes da Encomenda</h2>
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
        <div className="flex flex-col gap-1.5 border-t border-plum/10 pt-4 text-sm text-plum-dark/70">
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

      <div className="mt-8 flex flex-col gap-1 text-sm text-plum-dark/70">
        <h2 className="mb-2 font-serif text-lg font-semibold text-plum-dark">Enviar para</h2>
        <p>{order.customer.name}</p>
        <p>{order.customer.address}</p>
        <p>
          {order.customer.postalCode} {order.customer.city}
        </p>
        <p>{order.customer.country}</p>
        <p className="mt-2">{order.customer.email} · {order.customer.phone}</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Button href="/loja" variant="secondary" size="lg">
          Continuar a Comprar
        </Button>
        <Link href="/contactos" className="text-xs text-plum-dark/50 underline hover:text-gold">
          Precisa de ajuda com o pagamento? Contacte-nos.
        </Link>
      </div>
    </div>
  );
}
