import type { OrderStatus } from "@/types";

const styles: Record<OrderStatus, string> = {
  "A aguardar pagamento": "bg-gold/15 text-gold-dark border border-gold/40",
  Pago: "bg-plum/10 text-plum border border-plum/30",
  Enviado: "bg-bordeaux/10 text-bordeaux border border-bordeaux/30",
  Concluído: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  Cancelado: "bg-red-100 text-red-700 border border-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
