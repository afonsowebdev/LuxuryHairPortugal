import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { resolveCartOwner, applyCartSessionCookie } from "@/backend/lib/cartSession";
import { addToCart } from "@/backend/models/cart.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = String(body.productId ?? "");
    const quantidade = Number(body.quantidade ?? 1);
    const variante = String(body.variante ?? "");

    if (!productId) return fail("productId é obrigatório.");
    if (!Number.isFinite(quantidade) || quantidade < 1) return fail("Quantidade inválida.");

    const owner = resolveCartOwner(req);
    const item = await addToCart(owner, productId, quantidade, variante);
    return applyCartSessionCookie(ok(item, "Adicionado ao carrinho."), owner);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível adicionar ao carrinho.";
    console.error("POST /api/cart/add", error);
    return fail(message, 400);
  }
}
