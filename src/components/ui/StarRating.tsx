export function StarRating({
  rating,
  count,
  className = "",
  light = false,
}: {
  rating: number;
  count?: number;
  className?: string;
  light?: boolean;
}) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5">
              <defs>
                <linearGradient id={`star-${i}-${rating}`}>
                  <stop offset={half ? "50%" : filled ? "100%" : "0%"} stopColor="#E8A64C" />
                  <stop
                    offset={half ? "50%" : filled ? "100%" : "0%"}
                    stopColor={light ? "#FAF6F0" : "#4A1E3C"}
                    stopOpacity={0.25}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-${i}-${rating})`}
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.8l-5.2 2.73.99-5.8-4.21-4.1 5.82-.85z"
              />
            </svg>
          );
        })}
      </div>
      <span className={`text-xs ${light ? "text-cream/70" : "text-plum/60"}`}>
        {rating.toFixed(1)}
        {typeof count === "number" && ` (${count})`}
      </span>
    </div>
  );
}
