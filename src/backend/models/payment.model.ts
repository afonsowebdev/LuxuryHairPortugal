import { prisma } from "@/backend/lib/db";
import { generateReference } from "@/backend/lib/multibanco";

export async function generatePaymentForOrder(orderId: string, metodo = "multibanco") {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Encomenda não encontrada.");

  const mb = generateReference(order.total, orderId);

  return prisma.payment.upsert({
    where: { orderId },
    update: {
      metodo,
      entidade: mb.entidade,
      referencia: mb.referencia,
      valor: mb.valor,
      expiraEm: mb.expiraEm,
      estado: "PENDENTE",
    },
    create: {
      orderId,
      metodo,
      entidade: mb.entidade,
      referencia: mb.referencia,
      valor: mb.valor,
      expiraEm: mb.expiraEm,
    },
  });
}

export function getPaymentStatus(orderId: string) {
  return prisma.payment.findUnique({ where: { orderId } });
}

// Simula a notificação de pagamento confirmado que, num cenário real,
// chegaria por webhook do banco/PSP (ex: SIBS, Ifthenpay).
export async function confirmPayment(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { orderId },
      data: { estado: "PAGO" },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        estado: "PAGO",
        tracking: {
          create: { estado: "PAGO", descricao: "Pagamento confirmado." },
        },
      },
    });

    return payment;
  });
}
