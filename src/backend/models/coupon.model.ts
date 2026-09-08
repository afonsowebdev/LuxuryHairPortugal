import { prisma } from "@/backend/lib/db";
import type { Prisma } from "@prisma/client";

export function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export function createCoupon(data: Prisma.CouponCreateInput) {
  return prisma.coupon.create({ data });
}

export function updateCoupon(id: string, data: Prisma.CouponUpdateInput) {
  return prisma.coupon.update({ where: { id }, data });
}

export function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}

export function findCouponByCode(codigo: string) {
  return prisma.coupon.findUnique({ where: { codigo: codigo.trim().toUpperCase() } });
}

// Validação server-side de um código de cupão — usada no checkout para
// nunca confiar num desconto calculado só no cliente.
export async function validateCoupon(codigo: string, subtotal: number) {
  const coupon = await findCouponByCode(codigo);
  if (!coupon) return { valid: false as const, error: "Cupão inválido." };
  if (!coupon.ativo) return { valid: false as const, error: "Este cupão já não está ativo." };
  if (coupon.expiraEm && coupon.expiraEm.getTime() < Date.now())
    return { valid: false as const, error: "Este cupão expirou." };
  if (coupon.limiteUso !== null && coupon.usos >= coupon.limiteUso)
    return { valid: false as const, error: "Este cupão atingiu o limite de utilizações." };
  if (coupon.valorMinimo && subtotal < coupon.valorMinimo)
    return { valid: false as const, error: `Válido a partir de ${coupon.valorMinimo}€ em compras.` };

  const desconto =
    coupon.tipo === "percentagem" ? (subtotal * coupon.valor) / 100 : coupon.valor;
  return { valid: true as const, coupon, desconto: Math.min(desconto, subtotal) };
}

export function incrementCouponUsage(id: string) {
  return prisma.coupon.update({ where: { id }, data: { usos: { increment: 1 } } });
}
