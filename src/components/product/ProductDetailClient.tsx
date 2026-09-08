"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { PriceTag } from "@/components/ui/PriceTag";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { HeartIcon, EditIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { formatDate } from "@/lib/format";

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-plum-dark/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
              value === opt
                ? "border-gold bg-gold text-plum-dark font-semibold"
                : "border-plum/20 text-plum-dark/80 hover:border-gold"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);

  const [comprimento, setComprimento] = useState(product.variants.comprimentos?.[0] ?? "");
  const [cor, setCor] = useState(product.variants.cores?.[0] ?? "");
  const [densidade, setDensidade] = useState(
    product.variants.densidades?.[0] ?? product.variants.texturas?.[0] ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"descricao" | "cuidados" | "envio" | "avaliacoes">("descricao");
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = product.badge === "Esgotado" || product.stock === 0;

  const variantLabel = useMemo(
    () => [comprimento, cor, densidade].filter(Boolean).join(" / ") || "Padrão",
    [comprimento, cor, densidade]
  );

  function buildCartLine() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      variant: variantLabel,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    if (isSoldOut) return;
    addItem(buildCartLine(), quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    if (isSoldOut) return;
    addItem(buildCartLine(), quantity);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-6">
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-plum-dark">
          <span className="font-semibold uppercase tracking-[0.14em] text-bordeaux">
            Admin · ID {product.id} · Stock real: {product.stock}
          </span>
          <Link
            href={`/admin/produtos/${product.id}`}
            className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-plum-dark underline decoration-plum-dark/30 hover:decoration-plum-dark"
          >
            <EditIcon className="h-3.5 w-3.5" />
            Editar produto
          </Link>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bordeaux">
          {product.category.replace("-", " ")}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewsCount} />
        </div>
      </div>

      <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />

      <p className="text-sm leading-relaxed text-plum-dark/70">{product.shortDescription}</p>

      <div className="flex flex-col gap-5 border-y border-plum/10 py-6">
        {product.variants.comprimentos && (
          <OptionGroup
            label="Comprimento"
            options={product.variants.comprimentos}
            value={comprimento}
            onChange={setComprimento}
          />
        )}
        {product.variants.cores && (
          <OptionGroup label="Cor" options={product.variants.cores} value={cor} onChange={setCor} />
        )}
        {(product.variants.densidades || product.variants.texturas) && (
          <OptionGroup
            label={product.variants.texturas ? "Textura" : "Densidade"}
            options={product.variants.densidades ?? product.variants.texturas ?? []}
            value={densidade}
            onChange={setDensidade}
          />
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-plum-dark/70">
            Quantidade
          </p>
          <div className="inline-flex items-center rounded-full border border-plum/20">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-lg text-plum-dark cursor-pointer disabled:opacity-30"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-plum-dark">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-4 py-2 text-lg text-plum-dark cursor-pointer disabled:opacity-30"
              aria-label="Aumentar quantidade"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          {!isSoldOut && product.stock <= 10 && (
            <p className="mt-2 text-xs text-bordeaux">Apenas {product.stock} em stock</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isSoldOut}
        >
          {isSoldOut ? "Esgotado" : justAdded ? "Adicionado ✓" : "Adicionar ao Carrinho"}
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleBuyNow} disabled={isSoldOut}>
          Comprar Já
        </Button>
        <button
          onClick={() => toggle(product.id)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full border transition-colors cursor-pointer sm:self-auto ${
            wishlisted
              ? "border-gold bg-gold text-plum-dark"
              : "border-plum/20 text-plum-dark/70 hover:border-gold hover:text-bordeaux"
          }`}
        >
          <HeartIcon className="h-5 w-5" filled={wishlisted} />
        </button>
      </div>

      <div className="mt-4">
        <div className="flex gap-6 border-b border-plum/10 text-sm">
          {(
            [
              ["descricao", "Descrição"],
              ["cuidados", "Cuidados"],
              ["envio", "Envio & Devoluções"],
              ["avaliacoes", `Avaliações (${product.reviewsCount})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`cursor-pointer border-b-2 pb-3 font-medium transition-colors ${
                tab === key
                  ? "border-gold text-plum-dark"
                  : "border-transparent text-plum-dark/50 hover:text-plum-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm leading-relaxed text-plum-dark/75">
          {tab === "descricao" && <p>{product.description}</p>}
          {tab === "cuidados" && <p>{product.care}</p>}
          {tab === "envio" && <p>{product.shipping}</p>}
          {tab === "avaliacoes" && (
            <div className="flex flex-col gap-5">
              {product.reviews.map((r) => (
                <div key={r.id} className="border-b border-plum/10 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-plum-dark">{r.author}</span>
                    <span className="text-xs text-plum-dark/40">{formatDate(r.date)}</span>
                  </div>
                  <StarRating rating={r.rating} className="my-1.5" />
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
