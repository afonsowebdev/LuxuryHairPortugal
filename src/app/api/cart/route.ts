import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { resolveCartOwner, applyCartSessionCookie } from "@/backend/lib/cartSession";
import { getCart, clearCart } from "@/backend/models/cart.model";

export async function GET(req: NextRequest) {
  try {
    const owner = resolveCartOwner(req);
    const items = await getCart(owner);
    return applyCartSessionCookie(ok(items), owner);
  } catch (error) {
    console.error("GET /api/cart", error);
    return fail("Não foi possível carregar o carrinho.", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const owner = resolveCartOwner(req);
    await clearCart(owner);
    return applyCartSessionCookie(ok(null, "Carrinho esvaziado."), owner);
  } catch (error) {
    console.error("DELETE /api/cart", error);
    return fail("Não foi possível esvaziar o carrinho.", 500);
  }
}
