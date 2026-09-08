"use client";

import { useState, type FormEvent } from "react";
import type { Product, ProductBadge, CategorySlug } from "@/types";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const badgeOptions: { value: ProductBadge; label: string }[] = [
  { value: null, label: "Sem etiqueta" },
  { value: "Novo", label: "Novo" },
  { value: "Mais Vendido", label: "Mais Vendido" },
  { value: "Esgotado", label: "Esgotado" },
];

function toList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

interface ProductFormValues {
  name: string;
  category: CategorySlug;
  price: string;
  compareAtPrice: string;
  stock: string;
  badge: ProductBadge;
  shortDescription: string;
  description: string;
  care: string;
  shipping: string;
  comprimentos: string;
  cores: string;
  densidades: string;
  texturas: string;
  photos: string;
  featured: boolean;
  bestseller: boolean;
}

function productToValues(p?: Product): ProductFormValues {
  return {
    name: p?.name ?? "",
    category: p?.category ?? "perucas-lisas",
    price: p ? String(p.price) : "",
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : "",
    stock: p ? String(p.stock) : "0",
    badge: p?.badge ?? null,
    shortDescription: p?.shortDescription ?? "",
    description: p?.description ?? "",
    care: p?.care ?? "",
    shipping: p?.shipping ?? "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    comprimentos: p?.variants.comprimentos?.join(", ") ?? "",
    cores: p?.variants.cores?.join(", ") ?? "",
    densidades: p?.variants.densidades?.join(", ") ?? "",
    texturas: p?.variants.texturas?.join(", ") ?? "",
    photos: p?.photos?.join("\n") ?? "",
    featured: p?.featured ?? false,
    bestseller: p?.bestseller ?? false,
  };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  initial,
  onSubmit,
}: {
  initial?: Product;
  onSubmit: (product: Product) => void;
}) {
  const { categories } = useAdminData();
  const [values, setValues] = useState<ProductFormValues>(productToValues(initial));

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const price = Number(values.price) || 0;
    const product: Product = {
      id: initial?.id ?? `p-${Date.now()}`,
      slug: initial?.slug ?? slugify(values.name),
      name: values.name,
      category: values.category,
      price,
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
      images: initial?.images ?? [values.name],
      photos: toLines(values.photos).length ? toLines(values.photos) : undefined,
      badge: values.badge,
      shortDescription: values.shortDescription,
      description: values.description,
      care: values.care,
      shipping: values.shipping,
      variants: {
        comprimentos: toList(values.comprimentos),
        cores: toList(values.cores),
        densidades: toList(values.densidades),
        texturas: toList(values.texturas),
      },
      rating: initial?.rating ?? 5,
      reviewsCount: initial?.reviewsCount ?? 0,
      reviews: initial?.reviews ?? [],
      stock: Number(values.stock) || 0,
      featured: values.featured,
      bestseller: values.bestseller,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    onSubmit(product);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10 sm:grid-cols-2">
        <FormField label="Nome do Produto" required className="sm:col-span-2">
          <input required value={values.name} onChange={(e) => update("name", e.target.value)} className="input" />
        </FormField>
        <FormField label="Categoria" required>
          <Select
            value={values.category}
            onChange={(e) => update("category", e.target.value as CategorySlug)}
            className="input"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Etiqueta">
          <Select
            value={values.badge ?? ""}
            onChange={(e) => update("badge", (e.target.value || null) as ProductBadge)}
            className="input"
          >
            {badgeOptions.map((b) => (
              <option key={b.label} value={b.value ?? ""}>
                {b.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Preço (€)" required>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="input"
          />
        </FormField>
        <FormField label="Preço Antigo (€, opcional)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.compareAtPrice}
            onChange={(e) => update("compareAtPrice", e.target.value)}
            className="input"
          />
        </FormField>
        <FormField label="Stock" required>
          <input
            required
            type="number"
            min={0}
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="input"
          />
          <span className="text-[11px] text-plum-dark/40">
            Com stock 0, o produto aparece automaticamente como &quot;Esgotado&quot; na loja,
            independentemente da etiqueta escolhida.
          </span>
        </FormField>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 text-sm text-plum-dark/80">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm text-plum-dark/80">
            <input
              type="checkbox"
              checked={values.bestseller}
              onChange={(e) => update("bestseller", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Mais Vendido
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h3 className="font-serif text-lg font-semibold text-plum-dark">Variantes</h3>
        <p className="text-xs text-plum-dark/50">Separe as opções por vírgula.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Comprimentos">
            <input
              value={values.comprimentos}
              onChange={(e) => update("comprimentos", e.target.value)}
              placeholder="18”, 20”, 24”"
              className="input"
            />
          </FormField>
          <FormField label="Cores">
            <input
              value={values.cores}
              onChange={(e) => update("cores", e.target.value)}
              placeholder="Preto Natural, Honey Blonde"
              className="input"
            />
          </FormField>
          <FormField label="Densidades">
            <input
              value={values.densidades}
              onChange={(e) => update("densidades", e.target.value)}
              placeholder="150%, 180%"
              className="input"
            />
          </FormField>
          <FormField label="Texturas">
            <input
              value={values.texturas}
              onChange={(e) => update("texturas", e.target.value)}
              placeholder="Clássica, Knotless"
              className="input"
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h3 className="font-serif text-lg font-semibold text-plum-dark">Imagens</h3>
        <p className="text-xs text-plum-dark/50">
          Uma URL por linha (ex.: <code>/assets/produtos/perucas/nome-da-foto.jpg</code>). Sem
          imagens, o produto usa um placeholder gerado automaticamente na paleta da marca.
        </p>
        <FormField label="URLs das imagens">
          <textarea
            rows={3}
            value={values.photos}
            onChange={(e) => update("photos", e.target.value)}
            placeholder="/assets/produtos/perucas/peruca-loira-ondulada-frontal.jpg"
            className="input resize-none font-mono text-xs"
          />
        </FormField>
        {toLines(values.photos).length > 0 && (
          <div className="flex flex-wrap gap-3">
            {toLines(values.photos).map((url) => (
              <div
                key={url}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-plum-dark/5 ring-1 ring-plum/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h3 className="font-serif text-lg font-semibold text-plum-dark">Descrições</h3>
        <FormField label="Descrição Curta">
          <input
            value={values.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className="input"
          />
        </FormField>
        <FormField label="Descrição Completa">
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="input resize-none"
          />
        </FormField>
        <FormField label="Cuidados">
          <textarea
            rows={2}
            value={values.care}
            onChange={(e) => update("care", e.target.value)}
            className="input resize-none"
          />
        </FormField>
        <FormField label="Envio & Devoluções">
          <textarea
            rows={2}
            value={values.shipping}
            onChange={(e) => update("shipping", e.target.value)}
            className="input resize-none"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3">
        <Button href="/admin/produtos" variant="ghost" size="md">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md">
          {initial ? "Guardar Alterações" : "Criar Produto"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="text-xs font-medium text-plum-dark/70">
        {label}
        {required && <span className="text-bordeaux"> *</span>}
      </span>
      {children}
    </label>
  );
}
