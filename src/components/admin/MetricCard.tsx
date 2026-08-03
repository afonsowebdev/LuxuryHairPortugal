export function MetricCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-2xl p-5 ring-1 ${
        accent ? "bg-plum-dark text-cream ring-gold/20" : "bg-white ring-plum/10"
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          accent ? "text-gold-light/80" : "text-plum-dark/50"
        }`}
      >
        {label}
      </span>
      <span className={`font-serif text-3xl font-semibold ${accent ? "text-gold" : "text-plum-dark"}`}>
        {value}
      </span>
      {hint && (
        <span className={`text-xs ${accent ? "text-cream/50" : "text-plum-dark/40"}`}>{hint}</span>
      )}
    </div>
  );
}
