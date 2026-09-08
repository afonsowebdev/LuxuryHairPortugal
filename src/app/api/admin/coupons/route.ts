import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { listCoupons, createCoupon, updateCoupon, deleteCoupon, findCouponByCode } from "@/backend/models/coupon.model";

export const GET = withAdmin(async () => {
  const coupons = await listCoupons();
  return ok(coupons);
});

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const codigo = String(body.codigo ?? "").trim().toUpperCase();
    if (!codigo) return fail("Código é obrigatório.");
    if (!body.tipo || body.valor === undefined) return fail("Tipo e valor são obrigatórios.");
    if (await findCouponByCode(codigo)) return fail("Já existe um cupão com este código.");

    const coupon = await createCoupon({
      codigo,
      tipo: String(body.tipo),
      valor: Number(body.valor),
      valorMinimo: body.valorMinimo ? Number(body.valorMinimo) : undefined,
      expiraEm: body.expiraEm ? new Date(body.expiraEm) : undefined,
      limiteUso: body.limiteUso ? Number(body.limiteUso) : undefined,
    });
    return ok(coupon, "Cupão criado.", 201);
  } catch (error) {
    console.error("POST /api/admin/coupons", error);
    return fail("Não foi possível criar o cupão.", 400);
  }
});

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");
    const { id: _omit, ...rest } = body;
    void _omit;

    const coupon = await updateCoupon(id, {
      ...rest,
      ...(rest.expiraEm !== undefined ? { expiraEm: rest.expiraEm ? new Date(rest.expiraEm) : null } : {}),
    });
    return ok(coupon, "Cupão atualizado.");
  } catch (error) {
    console.error("PUT /api/admin/coupons", error);
    return fail("Não foi possível atualizar o cupão.", 400);
  }
});

export const DELETE = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");

    await deleteCoupon(id);
    return ok(null, "Cupão eliminado.");
  } catch (error) {
    console.error("DELETE /api/admin/coupons", error);
    return fail("Não foi possível eliminar o cupão.", 400);
  }
});
