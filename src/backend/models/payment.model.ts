import { prisma } from "@/backend/lib/db";
import { generateReference } from "@/backend/lib/multibanco";
import {
  isMultibancoConfigured,
  isMbwayConfigured,
  generateMultibancoOfflineReference,
  requestMbwayPayment,
} from "@/backend/lib/ifthenpay";

function expiryDate(hours: number): Date {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d;
}

/**
 * Gera (ou regenera) a referência Multibanco de uma encomenda — usa a
 * ifthenpay real se `IFTHENPAY_MB_ENTITY`/`IFTHENPAY_MB_SUBENTITY` estiverem
 * configurados, caso contrário o gerador simulado em `multibanco.ts`.
 * `simulado` diz ao frontend se a referência é real ou só para demonstração.
 */
export async function generatePaymentForOrder(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Encomenda não encontrada.");

  const simulado = !isMultibancoConfigured();
  let entidade: string;
  let referencia: string;
  let expiraEm: Date;
  if (simulado) {
    const mb = generateReference(order.total, orderId);
    entidade = mb.entidade;
    referencia = mb.referencia;
    expiraEm = mb.expiraEm;
  } else {
    const mb = generateMultibancoOfflineReference(orderId, order.total);
    entidade = mb.entidade;
    referencia = mb.referencia;
    expiraEm = expiryDate(48);
  }

  const payment = await prisma.payment.upsert({
    where: { orderId },
    update: { metodo: "multibanco", entidade, referencia, valor: order.total, expiraEm, estado: "PENDENTE" },
    create: { orderId, metodo: "multibanco", entidade, referencia, valor: order.total, expiraEm },
  });

  return { payment, simulado };
}

/**
 * Pede um pagamento MB WAY. Com `IFTHENPAY_MBWAY_KEY` configurado, envia um
 * pedido real à ifthenpay — a app MB WAY do número indicado recebe uma
 * notificação push para aprovar, e a confirmação chega pelo callback
 * (ver /api/payment/webhook). Sem chave configurada, cria um registo
 * simulado para o checkout confirmar sozinho, como até aqui.
 */
export async function requestMbwayPaymentForOrder(orderId: string, mobileNumber: string, email?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Encomenda não encontrada.");

  if (!isMbwayConfigured()) {
    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        metodo: "mbway",
        entidade: "MBWAY",
        referencia: `SIM-${orderId.slice(-8)}`,
        valor: order.total,
        expiraEm: expiryDate(0.1),
        estado: "PENDENTE",
      },
      create: {
        orderId,
        metodo: "mbway",
        entidade: "MBWAY",
        referencia: `SIM-${orderId.slice(-8)}`,
        valor: order.total,
        expiraEm: expiryDate(0.1),
      },
    });
    return { payment, simulado: true };
  }

  const result = await requestMbwayPayment(orderId, order.total, mobileNumber, email);
  if (!result.ok || !result.requestId) throw new Error(result.message);

  const payment = await prisma.payment.upsert({
    where: { orderId },
    update: {
      metodo: "mbway",
      entidade: "MBWAY",
      referencia: result.requestId,
      valor: order.total,
      expiraEm: expiryDate(0.1),
      estado: "PENDENTE",
    },
    create: {
      orderId,
      metodo: "mbway",
      entidade: "MBWAY",
      referencia: result.requestId,
      valor: order.total,
      expiraEm: expiryDate(0.1),
    },
  });
  return { payment, simulado: false };
}

export function getPaymentStatus(orderId: string) {
  return prisma.payment.findUnique({ where: { orderId } });
}

// Aplica a confirmação de pagamento — chamada quer pelo callback real da
// ifthenpay (depois de validado), quer pela simulação local em desenvolvimento.
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
