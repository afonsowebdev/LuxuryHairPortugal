"use client";

import { categories } from "@/lib/data/categories";
import type { CategorySlug } from "@/types";
import { formatEUR } from "@/lib/format";

export interface FilterState {
  categorySlugs: CategorySlug[];
  colors: string[];
  lengths: string[];
  textures: string[];
  maxPrice: number;
}

interface ShopFiltersProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  lockedCategory?: CategorySlug;
  colors: string[];
  lengths: string[];
  textures: string[];
  priceCeiling: number;
  onReset: () => void;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-plum/10 py-5 first:pt-0 last:border-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-bordeaux">
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-plum-dark/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-plum/30 text-gold accent-gold focus:ring-gold"
      />
      {label}
    </label>
  );
}

export function ShopFilters({
  state,
  onChange,
  lockedCategory,
  colors,
  lengths,
  textures,
  priceCeiling,
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
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-serif text-xl font-semibold text-plum-dark">Filtros</h2>
        <button
          onClick={onReset}
          className="text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline cursor-pointer"
        >
          Limpar
        </button>
      </div>

      {!lockedCategory && (
        <FilterGroup title="Categoria">
          {categories.map((c) => (
            <CheckboxRow
              key={c.slug}
              label={c.name}
              checked={state.categorySlugs.includes(c.slug)}
              onChange={() => toggle("categorySlugs", c.slug)}
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
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Preço">
        <div className="flex flex-col gap-2">
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
          <span className="text-sm text-plum-dark/70">
            Até {formatEUR(state.maxPrice)}
          </span>
        </div>
      </FilterGroup>
    </div>
  );
}
