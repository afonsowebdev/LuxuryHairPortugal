"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product, light = false }: { product: Product; light?: boolean }) {
  const { addItem } = useCart();
  const isSoldOut = product.badge === "Esgotado" || product.stock === 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut) return;
    const defaultVariant = [
      product.variants.comprimentos?.[0],
      product.variants.cores?.[0],
      product.variants.densidades?.[0] ?? product.variants.texturas?.[0],
    ]
      .filter(Boolean)
      .join(" / ");

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variant: defaultVariant || "Padrão",
        stock: product.stock,
      },
      1
    );
  }

  return (
    <Link
      href={`/loja/${product.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        light
          ? "bg-plum/40 ring-1 ring-gold/10 hover:shadow-black/20"
          : "bg-plum-dark/5 ring-1 ring-plum/10 hover:shadow-plum/10"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          seed={product.slug}
          category={product.category}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <Badge badge={product.badge} />
        </div>
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            className="absolute inset-x-3 bottom-3 translate-y-12 rounded-full bg-cream/95 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-plum-dark opacity-0 shadow-lg transition-all duration-300 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            Adicionar ao carrinho
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3
          className={`font-serif text-base font-semibold leading-snug ${
            light ? "text-cream" : "text-plum-dark"
          }`}
        >
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviewsCount} light={light} />
        <div className="mt-1">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} light={light} />
        </div>
      </div>
    </Link>
  );
}
