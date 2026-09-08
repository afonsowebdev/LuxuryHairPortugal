import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { confirmPayment } from "@/backend/models/payment.model";

/**
 * PROTOTIPO — simula a notificação assíncrona que, num cenário real, viria
 * de um PSP (SIBS, Ifthenpay, etc.) a confirmar que a referência foi paga.
 * Um webhook real deve validar uma assinatura/segredo enviado pelo
 * fornecedor antes de confiar no pedido; aqui não há nenhum, propositado.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId ?? "");
    if (!orderId) return fail("orderId é obrigatório.");

    const payment = await confirmPayment(orderId);
    return ok(payment, "Pagamento confirmado.");
  } catch (error) {
    console.error("POST /api/payment/webhook", error);
    return fail("Não foi possível confirmar o pagamento.", 400);
  }
}
