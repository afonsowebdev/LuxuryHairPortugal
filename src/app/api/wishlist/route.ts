import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { withAuth } from "@/backend/middleware/withAuth";
import { listWishlist, addToWishlist } from "@/backend/models/wishlist.model";

export const GET = withAuth(async (_req, user) => {
  const items = await listWishlist(user.userId);
  return ok(items);
});

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const productId = String(body.productId ?? "");
    if (!productId) return fail("productId é obrigatório.");

    const item = await addToWishlist(user.userId, productId);
    return ok(item, "Adicionado aos favoritos.", 201);
  } catch (error) {
    console.error("POST /api/wishlist", error);
    return fail("Não foi possível adicionar aos favoritos.", 500);
  }
});
