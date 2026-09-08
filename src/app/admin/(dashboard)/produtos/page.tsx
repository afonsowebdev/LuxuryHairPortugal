"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, DownloadIcon } from "@/components/ui/icons";
import { formatEUR } from "@/lib/format";
import { getEffectiveBadge } from "@/lib/data/products";
import { Select } from "@/components/ui/Select";
import { downloadCsv } from "@/lib/csv";

export default function AdminProductsPage() {
  const { products, categories, deleteProduct } = useAdminData();
  const { message, showToast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search, category]);

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Eliminar "${name}"? Esta ação não pode ser revertida.`)) {
      deleteProduct(id);
      showToast("Produto eliminado.");
    }
  }

  function handleExport() {
    downloadCsv(
      "produtos.csv",
      filtered.map((p) => ({
        id: p.id,
        nome: p.name,
        categoria: p.category,
        preco: p.price,
        stock: p.stock,
        etiqueta: getEffectiveBadge(p) ?? "",
      }))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">Produtos</h1>
          <p className="text-sm text-plum-dark/50">{products.length} produtos no catálogo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 rounded-xl border border-plum/15 bg-white px-4 py-2.5 text-sm text-plum-dark hover:bg-plum-dark/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <DownloadIcon className="h-4 w-4" />
            Exportar
          </button>
          <Button href="/admin/produtos/novo" variant="primary" size="md">
            <PlusIcon className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full rounded-xl border border-plum/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gold"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-plum/15 bg-white pl-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-plum/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs uppercase tracking-wide text-plum-dark/50">
              <th className="px-5 py-3">Produto</th>
              <th className="px-5 py-3">Categoria</th>
              <th className="px-5 py-3">Preço</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Etiqueta</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-plum-dark/[0.02]">
                <td className="flex items-center gap-3 px-5 py-3">
                  <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage
                      seed={p.slug}
                      category={p.category}
                      src={p.photos?.[0]}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-plum-dark">{p.name}</span>
                </td>
                <td className="px-5 py-3 capitalize text-plum-dark/70">{p.category.replace("-", " ")}</td>
                <td className="px-5 py-3 text-plum-dark/70">{formatEUR(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-bordeaux" : "text-plum-dark/70"}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge badge={getEffectiveBadge(p)} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="rounded-lg p-2 text-plum-dark/60 hover:bg-plum-dark/5 hover:text-plum-dark"
                      aria-label={`Editar ${p.name}`}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="rounded-lg p-2 text-plum-dark/60 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      aria-label={`Eliminar ${p.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-plum-dark/50">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Toast message={message} />
    </div>
  );
}
