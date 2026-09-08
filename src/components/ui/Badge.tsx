import type { ProductBadge } from "@/types";

const badgeStyles: Record<string, string> = {
  Novo: "bg-plum-dark text-cream",
  "Mais Vendido": "bg-gold text-plum-dark",
  Esgotado: "border border-plum-dark/25 bg-cream/90 text-plum-dark/60",
};

export function Badge({ badge }: { badge: ProductBadge }) {
  if (!badge) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeStyles[badge]}`}
    >
      {badge}
    </span>
  );
}
