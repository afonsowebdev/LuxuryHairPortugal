import type { NextRequest } from "next/server";
import type { OrderStatus } from "@prisma/client";
import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { listAllOrdersForAdmin, updateOrderStatus } from "@/backend/models/order.model";

export const GET = withAdmin(async (req: NextRequest) => {
  const estado = req.nextUrl.searchParams.get("estado") as OrderStatus | null;
  const orders = await listAllOrdersForAdmin(estado ?? undefined);
  return ok(orders);
});

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    const estado = body.estado as OrderStatus | undefined;
    if (!id || !estado) return fail("id e estado são obrigatórios.");

    const order = await updateOrderStatus(id, estado, body.descricao ? String(body.descricao) : undefined);
    return ok(order, "Estado da encomenda atualizado.");
  } catch (error) {
    console.error("PUT /api/admin/orders", error);
    return fail("Não foi possível atualizar a encomenda.", 400);
  }
});
