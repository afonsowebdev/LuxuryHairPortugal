"use client";

import { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import type { Category } from "@/types";

function CategoryCard({ category }: { category: Category }) {
  const { updateCategory } = useAdminData();
  const { message, showToast } = useToast();
  const [draft, setDraft] = useState(category);
  const dirty =
    draft.name !== category.name ||
    draft.description !== category.description ||
    draft.photo !== category.photo;

  function handleSave() {
    updateCategory(category.slug, {
      name: draft.name,
      description: draft.description,
      photo: draft.photo || undefined,
    });
    showToast(`"${draft.name}" atualizada.`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10 sm:flex-row">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-40">
        <ProductImage
          seed={category.slug}
          category={category.slug}
          src={draft.photo}
          alt={draft.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-plum-dark/40">
            /loja/{category.slug}
          </p>
          {dirty && <p className="text-xs text-bordeaux">Alterações por guardar</p>}
        </div>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Nome</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Descrição</span>
          <textarea
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            className="input resize-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">URL da imagem (opcional)</span>
          <input
            value={draft.photo ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, photo: e.target.value }))}
            placeholder="/assets/produtos/..."
            className="input font-mono text-xs"
          />
        </label>
        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary" size="sm" disabled={!dirty}>
            Guardar
          </Button>
        </div>
      </div>
      <Toast message={message} />
    </div>
  );
}

export default function AdminCategoriesPage() {
  const { categories, products } = useAdminData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Categorias
        </h1>
        <p className="text-sm text-plum-dark/50">
          Edite o nome, descrição e imagem de cada coleção. As alterações aparecem de imediato na
          loja.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category.slug} className="flex flex-col gap-1">
            <CategoryCard category={category} />
            <p className="px-2 text-xs text-plum-dark/40">
              {products.filter((p) => p.category === category.slug).length} produtos nesta
              categoria
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
