import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { validateCoupon } from "@/backend/models/coupon.model";

// Pública — o checkout chama isto para nunca confiar num desconto
// calculado só no cliente.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const codigo = String(body.codigo ?? "");
    const subtotal = Number(body.subtotal ?? 0);
    if (!codigo) return fail("Código é obrigatório.");

    const result = await validateCoupon(codigo, subtotal);
    if (!result.valid) return fail(result.error);

    return ok({ desconto: result.desconto, codigo: result.coupon.codigo });
  } catch (error) {
    console.error("POST /api/coupons/validate", error);
    return fail("Não foi possível validar o cupão.", 500);
  }
}
