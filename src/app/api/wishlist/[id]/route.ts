import { ok, fail } from "@/backend/lib/response";
import { withAuth } from "@/backend/middleware/withAuth";
import { removeFromWishlist } from "@/backend/models/wishlist.model";

export const DELETE = withAuth<{ params: Promise<{ id: string }> }>(async (_req, user, context) => {
  try {
    const { id } = await context.params;
    await removeFromWishlist(id, user.userId);
    return ok(null, "Removido dos favoritos.");
  } catch (error) {
    console.error("DELETE /api/wishlist/[id]", error);
    return fail("Não foi possível remover dos favoritos.", 400);
  }
});
