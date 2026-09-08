import type { Product, ProductBadge } from "@/types";

/**
 * O badge "Esgotado" é sempre derivado do stock real, independentemente da
 * etiqueta escolhida no admin — assim a loja nunca mostra um produto sem
 * stock como disponível.
 */
export function getEffectiveBadge(product: Product): ProductBadge {
  if (product.stock <= 0) return "Esgotado";
  return product.badge;
}
