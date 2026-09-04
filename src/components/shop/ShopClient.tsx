"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategorySlug } from "@/types";
import { ShopFilters, type FilterState, type FilterCounts } from "./ShopFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { MenuIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatEUR } from "@/lib/format";
import { useAdminData } from "@/context/AdminDataContext";

type SortOption = "relevancia" | "preco-asc" | "preco-desc" | "recentes" | "avaliacao";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "preco-asc", label: "Preço: menor para maior" },
  { value: "preco-desc", label: "Preço: maior para menor" },
  { value: "recentes", label: "Mais recentes" },
  { value: "avaliacao", label: "Melhor avaliados" },
];

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-1.5 rounded-full bg-plum-dark/8 py-1.5 pl-3 pr-2 text-xs font-medium text-plum-dark hover:bg-plum-dark/15 cursor-pointer"
    >
      {label}
      <CloseIcon className="h-3 w-3" />
    </button>
  );
}

export function ShopClient({
  lockedCategory,
  title,
  description,
}: {
  lockedCategory?: CategorySlug;
  title: string;
  description?: string;
}) {
  const { products: catalog, hydrated, categories, settings: storeSettings } = useAdminData();

  // Prefer the live (admin-editable) category name/description over the
  // server-rendered fallback, so a rename in /admin/categorias shows up
  // immediately without needing a new deploy.
  const liveCategory = lockedCategory ? categories.find((c) => c.slug === lockedCategory) : undefined;
  const displayTitle = liveCategory?.name ?? title;
  const displayDescription = liveCategory?.description ?? description;

  const products = useMemo(
    () => (lockedCategory ? catalog.filter((p) => p.category === lockedCategory) : catalog),
    [catalog, lockedCategory]
  );

  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.variants.cores ?? []))),
    [products]
  );
  const lengths = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.variants.comprimentos ?? []))),
    [products]
  );
  const textures = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.variants.texturas ?? []))),
    [products]
  );

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
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Once the real catalog loads from localStorage, the price ceiling may
    // be higher than the placeholder used before hydration — bump the
    // filter's max price once so it doesn't silently hide expensive items.
    if (hydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((f) => ({ ...f, maxPrice: priceCeiling }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const counts = useMemo<FilterCounts>(() => {
    const result: FilterCounts = { categories: {}, colors: {}, lengths: {}, textures: {} };
    for (const p of products) {
      result.categories[p.category] = (result.categories[p.category] ?? 0) + 1;
      for (const c of p.variants.cores ?? []) result.colors[c] = (result.colors[c] ?? 0) + 1;
      for (const l of p.variants.comprimentos ?? [])
        result.lengths[l] = (result.lengths[l] ?? 0) + 1;
      for (const t of p.variants.texturas ?? [])
        result.textures[t] = (result.textures[t] ?? 0) + 1;
    }
    return result;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
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
      if (q && !`${p.name} ${p.shortDescription}`.toLowerCase().includes(q)) return false;
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
  }, [products, filters, sort, query]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (!lockedCategory) {
      for (const slug of filters.categorySlugs) {
        const cat = categories.find((c) => c.slug === slug);
        if (!cat) continue;
        chips.push({
          key: `cat-${slug}`,
          label: cat.name,
          onRemove: () =>
            setFilters((f) => ({
              ...f,
              categorySlugs: f.categorySlugs.filter((s) => s !== slug),
            })),
        });
      }
    }
    for (const c of filters.colors) {
      chips.push({
        key: `color-${c}`,
        label: c,
        onRemove: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
      });
    }
    for (const l of filters.lengths) {
      chips.push({
        key: `len-${l}`,
        label: l,
        onRemove: () => setFilters((f) => ({ ...f, lengths: f.lengths.filter((x) => x !== l) })),
      });
    }
    for (const t of filters.textures) {
      chips.push({
        key: `tex-${t}`,
        label: t,
        onRemove: () =>
          setFilters((f) => ({ ...f, textures: f.textures.filter((x) => x !== t) })),
      });
    }
    if (filters.maxPrice < priceCeiling) {
      chips.push({
        key: "price",
        label: `Até ${formatEUR(filters.maxPrice)}`,
        onRemove: () => setFilters((f) => ({ ...f, maxPrice: priceCeiling })),
      });
    }
    return chips;
  }, [filters, lockedCategory, priceCeiling, categories]);

  function resetFilters() {
    setFilters({
      categorySlugs: lockedCategory ? [lockedCategory] : [],
      colors: [],
      lengths: [],
      textures: [],
      maxPrice: priceCeiling,
    });
    setQuery("");
  }

  return (
    <>
      <PageHeader eyebrow={storeSettings.brand.name} title={displayTitle} description={displayDescription} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:self-start">
            <ShopFilters
              state={filters}
              onChange={setFilters}
              lockedCategory={lockedCategory}
              categories={categories}
              colors={colors}
              lengths={lengths}
              textures={textures}
              priceCeiling={priceCeiling}
              counts={counts}
              activeCount={activeChips.length}
              onReset={resetFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar produtos..."
                  aria-label="Pesquisar produtos"
                  className="w-full rounded-full border border-plum/20 bg-white py-2.5 pl-11 pr-4 text-sm text-plum-dark outline-none focus:border-gold"
                />
              </div>

              {(activeChips.length > 0 || query) && (
                <div className="flex flex-wrap items-center gap-2">
                  {query && <FilterChip label={`"${query}"`} onRemove={() => setQuery("")} />}
                  {activeChips.map((c) => (
                    <FilterChip key={c.key} label={c.label} onRemove={c.onRemove} />
                  ))}
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline cursor-pointer"
                  >
                    Limpar tudo
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="relative flex items-center gap-2 rounded-full border border-plum/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-plum-dark lg:hidden cursor-pointer"
                >
                  <MenuIcon className="h-4 w-4" />
                  Filtros
                  {activeChips.length > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-plum-dark">
                      {activeChips.length}
                    </span>
                  )}
                </button>
                <p className="text-xs text-plum-dark/50">
                  {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
                </p>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  wrapperClassName="ml-auto"
                  className="rounded-full border border-plum/20 bg-cream pl-4 py-2 text-xs font-medium text-plum-dark outline-none focus:border-gold"
                  aria-label="Ordenar por"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {!hydrated ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-plum-dark/5" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-plum-dark/5 py-20 text-center">
                <p className="font-serif text-xl text-plum-dark">Ainda sem produtos</p>
                <p className="text-sm text-plum-dark/60">
                  {lockedCategory
                    ? "Esta coleção ainda não tem produtos disponíveis. Volte em breve."
                    : "A loja ainda não tem produtos disponíveis. Volte em breve."}
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-plum-dark/5 py-20 text-center">
                <p className="font-serif text-xl text-plum-dark">Sem resultados</p>
                <p className="text-sm text-plum-dark/60">
                  {query
                    ? `Não encontrámos produtos para "${query}".`
                    : "Experimente ajustar os filtros para encontrar o produto ideal."}
                </p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline cursor-pointer"
                >
                  Limpar filtros e pesquisa
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(i % 8) * 60}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
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
                categories={categories}
                colors={colors}
                lengths={lengths}
                textures={textures}
                priceCeiling={priceCeiling}
                counts={counts}
                activeCount={activeChips.length}
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
    </>
  );
}
