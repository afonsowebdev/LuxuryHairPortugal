import type { Coupon } from "@/types";

export interface ApiCoupon {
  id: string;
  codigo: string;
  tipo: string;
  valor: number;
  ativo: boolean;
  valorMinimo: number | null;
  expiraEm: string | null;
  limiteUso: number | null;
  usos: number;
  createdAt: string;
}

export function mapApiCoupon(api: ApiCoupon): Coupon {
  return {
    id: api.id,
    code: api.codigo,
    type: api.tipo === "fixo" ? "fixo" : "percentagem",
    value: api.valor,
    active: api.ativo,
    minOrderValue: api.valorMinimo ?? undefined,
    expiresAt: api.expiraEm ?? undefined,
    usageLimit: api.limiteUso ?? undefined,
    usageCount: api.usos,
    createdAt: api.createdAt,
  };
}

export function buildCouponPayload(patch: {
  code?: string;
  type?: Coupon["type"];
  value?: number;
  active?: boolean;
  minOrderValue?: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount?: number;
}) {
  const payload: Record<string, unknown> = {};
  if (patch.code !== undefined) payload.codigo = patch.code;
  if (patch.type !== undefined) payload.tipo = patch.type;
  if (patch.value !== undefined) payload.valor = patch.value;
  if (patch.active !== undefined) payload.ativo = patch.active;
  if (patch.minOrderValue !== undefined) payload.valorMinimo = patch.minOrderValue;
  if (patch.expiresAt !== undefined) payload.expiraEm = patch.expiresAt;
  if (patch.usageLimit !== undefined) payload.limiteUso = patch.usageLimit;
  if (patch.usageCount !== undefined) payload.usos = patch.usageCount;
  return payload;
}
