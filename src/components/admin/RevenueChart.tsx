"use client";

import { formatEUR } from "@/lib/format";

export function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-56 items-stretch gap-3 sm:gap-5">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-medium text-plum-dark/60">{formatEUR(d.value)}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-bordeaux to-gold transition-all"
              style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-[11px] uppercase tracking-wide text-plum-dark/40">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
