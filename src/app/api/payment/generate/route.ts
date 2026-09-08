import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { generatePaymentForOrder } from "@/backend/models/payment.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId ?? "");
    if (!orderId) return fail("orderId é obrigatório.");

    const payment = await generatePaymentForOrder(orderId);
    return ok(payment, "Referência gerada.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível gerar a referência.";
    console.error("POST /api/payment/generate", error);
    return fail(message, 400);
  }
}
