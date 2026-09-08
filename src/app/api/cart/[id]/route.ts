import { ok, fail } from "@/backend/lib/response";
import { updateCartItem, removeCartItem } from "@/backend/models/cart.model";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const quantidade = Number(body.quantidade);
    if (!Number.isFinite(quantidade) || quantidade < 1) return fail("Quantidade inválida.");

    const item = await updateCartItem(id, quantidade);
    return ok(item, "Quantidade atualizada.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível atualizar o item.";
    console.error("PUT /api/cart/[id]", error);
    return fail(message, 400);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await removeCartItem(id);
    return ok(null, "Item removido.");
  } catch (error) {
    console.error("DELETE /api/cart/[id]", error);
    return fail("Não foi possível remover o item.", 400);
  }
}
