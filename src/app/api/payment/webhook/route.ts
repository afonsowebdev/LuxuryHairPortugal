import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { confirmPayment, getPaymentStatus } from "@/backend/models/payment.model";
import { isMultibancoConfigured, isMbwayConfigured, verifyIfthenpayCallback } from "@/backend/lib/ifthenpay";

/**
 * Callback real da ifthenpay — chamado por eles (não pelo browser do
 * cliente) quando um pagamento Multibanco ou MB WAY é confirmado.
 * GET /api/payment/webhook?oid=&val=&tid=&ref=&apk=&pm=
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const oid = params.get("oid") ?? "";
  const val = params.get("val") ?? "";
  const apk = params.get("apk") ?? "";
  const ref = params.get("ref") ?? undefined;
  const tid = params.get("tid") ?? undefined;

  if (!oid) return new NextResponse("Missing oid", { status: 400 });

  const payment = await getPaymentStatus(oid);
  if (!payment) return new NextResponse("Order not found", { status: 404 });

  const valid = verifyIfthenpayCallback(
    { oid, val, apk, ref, tid },
    {
      orderId: oid,
      amount: payment.valor,
      reference: payment.metodo === "multibanco" ? payment.referencia : undefined,
      transactionId: payment.metodo === "mbway" ? payment.referencia : undefined,
    }
  );
  if (!valid) {
    console.error("Callback ifthenpay inválido", { oid, val, ref, tid });
    return new NextResponse("Invalid callback", { status: 403 });
  }

  await confirmPayment(oid);
  return new NextResponse("OK", { status: 200 });
}

/**
 * Simulação local — só funciona enquanto não houver credenciais reais da
 * ifthenpay configuradas, para nunca ficar disponível como atalho para
 * marcar encomendas reais como pagas sem pagamento de verdade.
 */
export async function POST(req: NextRequest) {
  if (isMultibancoConfigured() || isMbwayConfigured()) {
    return fail("Simulação desativada: há um fornecedor de pagamentos real configurado.", 403);
  }

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
