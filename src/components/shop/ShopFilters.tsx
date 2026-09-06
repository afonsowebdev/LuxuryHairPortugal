"use client";

import type { Category, CategorySlug } from "@/types";
import { formatEUR } from "@/lib/format";
import { getSwatchStyle, isLightSwatch } from "@/lib/colorSwatches";
import { FilterIcon } from "@/components/ui/icons";

export interface FilterState {
  categorySlugs: CategorySlug[];
  colors: string[];
  lengths: string[];
  textures: string[];
  maxPrice: number;
}

export interface FilterCounts {
  categories: Partial<Record<CategorySlug, number>>;
  colors: Record<string, number>;
  lengths: Record<string, number>;
  textures: Record<string, number>;
}

interface ShopFiltersProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  lockedCategory?: CategorySlug;
  categories: Category[];
  colors: string[];
  lengths: string[];
  textures: string[];
  priceCeiling: number;
  counts: FilterCounts;
  activeCount: number;
  onReset: () => void;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-plum/10 py-5 first:pt-0 last:border-0 last:pb-0">
      <h3 className="mb-3.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-bordeaux">
        <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
        {title}
      </h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  count,
  swatchColor,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  swatchColor?: string;
}) {
  return (
    <label className="-mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-plum-dark/80 transition-colors hover:bg-plum-dark/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-plum/30 text-gold accent-gold focus:ring-gold"
      />
      {swatchColor && (
        <span
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 rounded-full ${
            isLightSwatch(swatchColor) ? "ring-1 ring-plum/25" : "ring-1 ring-black/10"
          }`}
          style={getSwatchStyle(swatchColor)}
        />
      )}
      <span className={`flex-1 ${checked ? "font-medium text-plum-dark" : ""}`}>{label}</span>
      {typeof count === "number" && (
        <span className="text-xs text-plum-dark/35">{count}</span>
      )}
    </label>
  );
}

export function ShopFilters({
  state,
  onChange,
  lockedCategory,
  categories,
  colors,
  lengths,
  textures,
  priceCeiling,
  counts,
  activeCount,
  onReset,
}: ShopFiltersProps) {
  function toggle<K extends "categorySlugs" | "colors" | "lengths" | "textures">(
    key: K,
    value: string
  ) {
    const current = state[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...state, [key]: next });
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-5">
        <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-plum-dark">
          <FilterIcon className="h-5 w-5 text-gold" />
          Filtros
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-plum-dark">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline cursor-pointer"
          >
            Limpar
          </button>
        )}
      </div>

      {!lockedCategory && (
        <FilterGroup title="Categoria">
          {categories.map((c) => (
            <CheckboxRow
              key={c.slug}
              label={c.name}
              checked={state.categorySlugs.includes(c.slug)}
              onChange={() => toggle("categorySlugs", c.slug)}
              count={counts.categories[c.slug] ?? 0}
            />
          ))}
        </FilterGroup>
      )}

      {colors.length > 0 && (
        <FilterGroup title="Cor">
          {colors.map((c) => (
            <CheckboxRow
              key={c}
              label={c}
              checked={state.colors.includes(c)}
              onChange={() => toggle("colors", c)}
              count={counts.colors[c] ?? 0}
              swatchColor={c}
            />
          ))}
        </FilterGroup>
      )}

      {lengths.length > 0 && (
        <FilterGroup title="Comprimento">
          {lengths.map((l) => (
            <CheckboxRow
              key={l}
              label={l}
              checked={state.lengths.includes(l)}
              onChange={() => toggle("lengths", l)}
              count={counts.lengths[l] ?? 0}
            />
          ))}
        </FilterGroup>
      )}

      {textures.length > 0 && (
        <FilterGroup title="Textura">
          {textures.map((t) => (
            <CheckboxRow
              key={t}
              label={t}
              checked={state.textures.includes(t)}
              onChange={() => toggle("textures", t)}
              count={counts.textures[t] ?? 0}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Preço">
        <div className="flex flex-col gap-3 rounded-xl bg-plum-dark/[0.03] p-3.5">
          <span className="self-center rounded-full bg-plum-dark px-3 py-1 text-xs font-semibold text-cream">
            Até {formatEUR(state.maxPrice)}
          </span>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={5}
            value={state.maxPrice}
            onChange={(e) => onChange({ ...state, maxPrice: Number(e.target.value) })}
            className="accent-gold"
            aria-label="Preço máximo"
          />
          <div className="flex items-center justify-between text-[11px] text-plum-dark/50">
            <span>€0</span>
            <span>{formatEUR(priceCeiling)}</span>
          </div>
        </div>
      </FilterGroup>
    </div>
  );
}
