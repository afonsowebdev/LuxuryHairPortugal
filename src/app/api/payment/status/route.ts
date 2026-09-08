import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { getPaymentStatus } from "@/backend/models/payment.model";

// GET /api/payment/status?orderId=...
export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");
    if (!orderId) return fail("orderId é obrigatório.");

    const payment = await getPaymentStatus(orderId);
    if (!payment) return fail("Pagamento não encontrado.", 404);

    return ok(payment);
  } catch (error) {
    console.error("GET /api/payment/status", error);
    return fail("Não foi possível verificar o estado do pagamento.", 500);
  }
}
