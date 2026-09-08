"use client";

import { useState } from "react";
import type { Category, CategorySlug } from "@/types";
import { formatEUR } from "@/lib/format";
import { getSwatchStyle, isLightSwatch } from "@/lib/colorSwatches";
import { FilterIcon, CheckIcon, ChevronDownIcon } from "@/components/ui/icons";

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
  const [open, setOpen] = useState(true);
  return (
    <div className="py-5 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        <h3 className="font-serif text-base font-normal text-plum-dark">{title}</h3>
        <ChevronDownIcon
          className={`h-4 w-4 text-plum-dark/50 transition-transform duration-200 ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>
      <div className="mt-3 border-b border-plum/10" />
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-col gap-5 pt-5 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
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
    <label className="flex cursor-pointer items-center gap-3 text-sm text-plum-dark/80 transition-colors hover:text-plum-dark">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
          checked ? "border-plum-dark bg-plum-dark" : "border-plum/25 bg-plum-dark/[0.03]"
        }`}
      >
        {checked && <CheckIcon className="h-3.5 w-3.5 text-cream" />}
      </span>
      {swatchColor && (
        <span
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 ring-1 ${
            isLightSwatch(swatchColor) ? "ring-plum/30" : "ring-black/10"
          }`}
          style={getSwatchStyle(swatchColor)}
        />
      )}
      <span className={checked ? "font-medium text-plum-dark" : ""}>
        {label}
        {typeof count === "number" && <span className="ml-1 text-plum-dark/40">({count})</span>}
      </span>
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
      <div className="flex items-center justify-between border-b border-plum/10 pb-5">
        <h2 className="flex items-center gap-2.5 font-serif text-base font-normal uppercase tracking-[0.08em] text-plum-dark">
          <FilterIcon className="h-5 w-5 text-gold" />
          Filtros
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center bg-gold px-1.5 font-sans text-[11px] font-bold normal-case tracking-normal text-plum-dark">
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
        <div className="flex flex-col gap-3 bg-plum-dark/[0.03] p-3.5">
          <span className="self-center bg-plum-dark px-3 py-1 text-xs font-semibold text-cream">
            Até {formatEUR(state.maxPrice)}
          </span>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={5}
            value={state.maxPrice}
            onChange={(e) => onChange({ ...state, maxPrice: Number(e.target.value) })}
            className="range-slider"
            style={
              {
                "--range-progress": `${priceCeiling > 0 ? (state.maxPrice / priceCeiling) * 100 : 0}%`,
              } as React.CSSProperties
            }
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
