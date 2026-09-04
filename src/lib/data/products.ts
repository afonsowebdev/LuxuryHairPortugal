import type { Product, ProductBadge } from "@/types";

/**
 * Catálogo vazio por definição — não há produtos de exemplo. O catálogo real
 * é gerido inteiramente pelo administrador em /admin/produtos (criar, editar,
 * apagar, stock, imagens) e vive em localStorage via AdminDataContext. Este
 * array serve apenas de estado inicial antes da primeira gestão de produtos.
 */
export const products: Product[] = [];

/**
 * O badge "Esgotado" é sempre derivado do stock real, independentemente da
 * etiqueta escolhida no admin — assim a loja nunca mostra um produto sem
 * stock como disponível.
 */
export function getEffectiveBadge(product: Product): ProductBadge {
  if (product.stock <= 0) return "Esgotado";
  return product.badge;
}
