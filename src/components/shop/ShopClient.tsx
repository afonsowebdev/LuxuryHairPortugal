"use client";

import { useMemo, useState } from "react";
import type { CategorySlug, Product } from "@/types";
import { ShopFilters, type FilterState } from "./ShopFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

type SortOption = "relevancia" | "preco-asc" | "preco-desc" | "recentes" | "avaliacao";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "preco-asc", label: "Preço: menor para maior" },
  { value: "preco-desc", label: "Preço: maior para menor" },
  { value: "recentes", label: "Mais recentes" },
  { value: "avaliacao", label: "Melhor avaliados" },
];

export function ShopClient({
  products,
  lockedCategory,
  colors,
  lengths,
  textures,
  title,
  description,
}: {
  products: Product[];
  lockedCategory?: CategorySlug;
  colors: string[];
  lengths: string[];
  textures: string[];
  title: string;
  description?: string;
}) {
  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price), 100),
    [products]
  );

  const [filters, setFilters] = useState<FilterState>({
    categorySlugs: lockedCategory ? [lockedCategory] : [],
    colors: [],
    lengths: [],
    textures: [],
    maxPrice: priceCeiling,
  });
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categorySlugs.length && !filters.categorySlugs.includes(p.category))
        return false;
      if (
        filters.colors.length &&
        !p.variants.cores?.some((c) => filters.colors.includes(c))
      )
        return false;
      if (
        filters.lengths.length &&
        !p.variants.comprimentos?.some((l) => filters.lengths.includes(l))
      )
        return false;
      if (
        filters.textures.length &&
        !p.variants.texturas?.some((t) => filters.textures.includes(t))
      )
        return false;
      if (p.price > filters.maxPrice) return false;
      return true;
    });

    list = [...list];
    switch (sort) {
      case "preco-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "preco-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "recentes":
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "avaliacao":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    }
    return list;
  }, [products, filters, sort]);

  function resetFilters() {
    setFilters({
      categorySlugs: lockedCategory ? [lockedCategory] : [],
      colors: [],
      lengths: [],
      textures: [],
      maxPrice: priceCeiling,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2 text-center sm:text-left">
        <h1 className="font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-plum-dark/60 mx-auto sm:mx-0">{description}</p>}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <ShopFilters
            state={filters}
            onChange={setFilters}
            lockedCategory={lockedCategory}
            colors={colors}
            lengths={lengths}
            textures={textures}
            priceCeiling={priceCeiling}
            onReset={resetFilters}
          />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-plum/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum-dark lg:hidden cursor-pointer"
            >
              <MenuIcon className="h-4 w-4" />
              Filtros
            </button>
            <p className="text-xs text-plum-dark/50">
              {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="ml-auto rounded-full border border-plum/20 bg-cream px-4 py-2 text-xs font-medium text-plum-dark outline-none focus:border-gold"
              aria-label="Ordenar por"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-plum-dark/5 py-20 text-center">
              <p className="font-serif text-xl text-plum-dark">Sem resultados</p>
              <p className="text-sm text-plum-dark/60">
                Experimente ajustar os filtros para encontrar o produto ideal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-plum-dark/60"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-cream px-6 py-6 shadow-2xl">
            <div className="mb-2 flex items-center justify-end">
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fechar filtros" className="cursor-pointer">
                <CloseIcon className="h-5 w-5 text-plum-dark" />
              </button>
            </div>
            <ShopFilters
              state={filters}
              onChange={setFilters}
              lockedCategory={lockedCategory}
              colors={colors}
              lengths={lengths}
              textures={textures}
              priceCeiling={priceCeiling}
              onReset={resetFilters}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-[0.16em] text-plum-dark cursor-pointer"
            >
              Ver {filtered.length} produtos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
