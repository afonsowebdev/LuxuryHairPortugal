import { formatEUR } from "@/lib/format";

export function PriceTag({
  price,
  compareAtPrice,
  size = "md",
  light = false,
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <span className="inline-flex items-baseline gap-2">
      <span
        className={`font-serif font-semibold ${sizeClasses[size]} ${
          light ? "text-gold" : "text-bordeaux"
        }`}
      >
        {formatEUR(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className={`text-xs line-through ${light ? "text-cream/50" : "text-plum/40"}`}>
          {formatEUR(compareAtPrice)}
        </span>
      )}
    </span>
  );
}
