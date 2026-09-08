import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { extractToken, verifyToken } from "@/backend/lib/auth";
import { findOrderById } from "@/backend/models/order.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await findOrderById(id);
    if (!order) return fail("Encomenda não encontrada.", 404);

    // Encomendas de convidado (sem userId) são acessíveis por quem tiver o
    // link; encomendas associadas a uma conta só são visíveis para o dono.
    if (order.userId) {
      const token = extractToken(req);
      const user = token ? verifyToken(token) : null;
      if (!user || user.userId !== order.userId) {
        return fail("Não tem permissão para ver esta encomenda.", 403);
      }
    }

    return ok(order);
  } catch (error) {
    console.error("GET /api/orders/[id]", error);
    return fail("Não foi possível carregar a encomenda.", 500);
  }
}
