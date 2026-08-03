import { seededRandom } from "@/lib/placeholder";
import type { CategorySlug } from "@/types";

interface ProductImageProps {
  seed: string;
  category?: CategorySlug;
  className?: string;
  index?: number;
}

const gradients: [string, string][] = [
  ["#4A1E3C", "#6E1B2A"],
  ["#6E2A54", "#35152B"],
  ["#35152B", "#6E1B2A"],
  ["#4A1E3C", "#2A0F22"],
];

function CategoryEmblem({ category }: { category?: CategorySlug }) {
  switch (category) {
    case "box-braids":
      return (
        <g stroke="#FAF6F0" strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.85}>
          <path d="M-14 -22 Q -6 -14 -14 -6 Q -6 2 -14 10 Q -6 18 -14 26" />
          <path d="M0 -26 Q 8 -18 0 -10 Q 8 -2 0 6 Q 8 14 0 22 Q 8 28 0 30" />
          <path d="M14 -22 Q 22 -14 14 -6 Q 22 2 14 10 Q 22 18 14 26" />
        </g>
      );
    case "pestanas":
      return (
        <g stroke="#FAF6F0" strokeWidth="2" strokeLinecap="round" opacity={0.85}>
          <path d="M-24 6 Q -20 -14 -14 4" fill="none" />
          <path d="M-12 10 Q -8 -14 -2 8" fill="none" />
          <path d="M0 11 Q 2 -16 8 10" fill="none" />
          <path d="M10 10 Q 14 -14 20 6" fill="none" />
          <path d="M20 6 Q 24 -10 28 2" fill="none" />
          <path d="M-26 10 Q 0 22 28 8" fill="none" strokeWidth="2.4" />
        </g>
      );
    default:
      return (
        <g stroke="#FAF6F0" strokeWidth="2" fill="none" opacity={0.85}>
          <path d="M-22 14 Q -26 -18 0 -24 Q 26 -18 22 14" />
          <path d="M-22 14 Q -14 26 0 28 Q 14 26 22 14" />
          <path d="M-10 -18 Q -14 6 -10 22" strokeWidth="1.4" opacity={0.6} />
          <path d="M10 -18 Q 14 6 10 22" strokeWidth="1.4" opacity={0.6} />
        </g>
      );
  }
}

export function ProductImage({ seed, category, className = "", index = 0 }: ProductImageProps) {
  const rand = seededRandom(`${seed}-${index}`);
  const [from, to] = gradients[Math.floor(rand() * gradients.length)];
  const angle = Math.floor(rand() * 360);

  const strands = Array.from({ length: 4 }).map((_, i) => {
    const y0 = 40 + rand() * 420;
    const c1x = 80 + rand() * 240;
    const c1y = y0 - 60 + rand() * 120;
    const c2x = 160 + rand() * 240;
    const c2y = y0 - 60 + rand() * 120;
    const x1 = 400 + 40;
    const width = 1 + rand() * 2.2;
    const opacity = 0.12 + rand() * 0.22;
    return { key: i, d: `M -20 ${y0} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y0 - 30 + rand() * 60}`, width, opacity };
  });

  const gradId = `grad-${seed}-${index}`;

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={seed}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${gradId})`} />
      {strands.map((s) => (
        <path key={s.key} d={s.d} stroke="#E8A64C" strokeWidth={s.width} fill="none" opacity={s.opacity} />
      ))}
      <circle cx="200" cy="230" r="72" fill="none" stroke="#E8A64C" strokeWidth="1.2" opacity={0.55} />
      <circle cx="200" cy="230" r="58" fill="none" stroke="#E8A64C" strokeWidth="0.6" opacity={0.35} />
      <g transform="translate(200 230)">
        <CategoryEmblem category={category} />
      </g>
    </svg>
  );
}
