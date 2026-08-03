import type { ProductBadge } from "@/types";

const badgeStyles: Record<string, string> = {
  Novo: "bg-gold text-plum-dark",
  "Mais Vendido": "bg-bordeaux text-cream",
  Esgotado: "bg-plum-dark/80 text-cream/70",
};

export function Badge({ badge }: { badge: ProductBadge }) {
  if (!badge) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm ${badgeStyles[badge]}`}
    >
      {badge}
    </span>
  );
}
