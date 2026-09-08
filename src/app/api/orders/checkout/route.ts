import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { resolveCartOwner, applyCartSessionCookie } from "@/backend/lib/cartSession";
import { validateCheckout, sanitizeString } from "@/backend/lib/validators";
import { createOrderFromCart } from "@/backend/models/order.model";
import { generatePaymentForOrder } from "@/backend/models/payment.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const error = validateCheckout(body);
    if (error) return fail(error);

    const owner = resolveCartOwner(req);

    const order = await createOrderFromCart({
      userId: owner.userId,
      nomeCliente: sanitizeString(String(body.nomeCliente)),
      email: String(body.email).trim(),
      telefone: sanitizeString(String(body.telefone)),
      morada: sanitizeString(String(body.morada)),
      cidade: sanitizeString(String(body.cidade)),
      codigoPostal: sanitizeString(String(body.codigoPostal)),
      pais: sanitizeString(String(body.pais)),
      codigoCupao: body.codigoCupao ? String(body.codigoCupao) : undefined,
      envio: body.envio ? Number(body.envio) : undefined,
      cartOwner: owner,
    });

    const payment = await generatePaymentForOrder(order.id, body.metodo === "mbway" ? "mbway" : "multibanco");

    return applyCartSessionCookie(
      ok(
        {
          order,
          payment: {
            entidade: payment.entidade,
            referencia: payment.referencia,
            valor: payment.valor,
            expiraEm: payment.expiraEm,
          },
        },
        "Encomenda criada.",
        201
      ),
      owner
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar a encomenda.";
    console.error("POST /api/orders/checkout", error);
    return fail(message, 400);
  }
}
