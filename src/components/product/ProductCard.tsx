"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { StarRating } from "@/components/ui/StarRating";
import { HeartIcon, EditIcon } from "@/components/ui/icons";
import { getSwatchStyle, isLightSwatch } from "@/lib/colorSwatches";
import { getEffectiveBadge } from "@/lib/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function ProductCard({ product, light = false }: { product: Product; light?: boolean }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { isAuthenticated: isAdmin } = useAdminAuth();
  const router = useRouter();
  const badge = getEffectiveBadge(product);
  const isSoldOut = badge === "Esgotado";
  const wishlisted = isWishlisted(product.id);
  const secondPhoto = product.photos?.[1];
  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;
  const colors = product.variants.cores ?? [];

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product.id);
  }

  function handleAdminEdit(e: React.MouseEvent) {
    e.preventDefault();
    router.push(`/admin/produtos/${product.id}`);
  }

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
      className={`group flex flex-col border transition-colors duration-300 ${
        light
          ? "border-cream/15 bg-transparent hover:border-gold/50"
          : "border-plum/10 bg-white hover:border-plum-dark/40"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          seed={product.slug}
          category={product.category}
          src={product.photos?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {secondPhoto && (
          <ProductImage
            seed={product.slug}
            category={product.category}
            index={1}
            src={secondPhoto}
            alt={product.name}
            className="h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-0 top-0 flex flex-col gap-1">
          <Badge badge={badge} />
          {discountPct !== null && (
            <span className="inline-flex w-fit items-center bg-bordeaux px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="absolute right-0 top-0 flex flex-col items-end">
          {isAdmin && (
            <button
              onClick={handleAdminEdit}
              aria-label={`Editar ${product.name} (admin)`}
              title="Editar produto (admin)"
              className="flex h-9 w-9 items-center justify-center bg-plum-dark/90 text-gold backdrop-blur-sm transition-colors hover:bg-plum-dark cursor-pointer"
            >
              <EditIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
            aria-pressed={wishlisted}
            className={`flex h-9 w-9 items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
              wishlisted ? "text-gold" : "text-cream hover:text-gold"
            }`}
          >
            <HeartIcon className="h-5 w-5" filled={wishlisted} />
          </button>
        </div>
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            className="absolute inset-x-0 bottom-0 translate-y-full border-t border-cream/20 bg-plum-dark/95 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-plum-dark cursor-pointer group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            Adicionar ao Carrinho
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
            light ? "text-gold-light/70" : "text-bordeaux/70"
          }`}
        >
          {product.category.replace("-", " ")}
        </p>
        <h3
          className={`line-clamp-2 min-h-[2.75rem] font-serif text-base font-semibold leading-snug ${
            light ? "text-cream" : "text-plum-dark"
          }`}
        >
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviewsCount} light={light} />
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {colors.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className={`h-3 w-3 shrink-0 ring-1 ${
                  isLightSwatch(c)
                    ? light
                      ? "ring-cream/40"
                      : "ring-plum-dark/30"
                    : light
                      ? "ring-cream/20"
                      : "ring-plum-dark/10"
                }`}
                style={getSwatchStyle(c)}
              />
            ))}
            {colors.length > 4 && (
              <span className={`text-[10px] ${light ? "text-cream/50" : "text-plum-dark/40"}`}>
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}
        <div className="mt-1 flex flex-1 flex-col justify-end gap-1 border-t border-plum/8 pt-3">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} light={light} />
          {!isSoldOut && product.stock > 0 && product.stock <= 10 && (
            <p className={`text-[11px] font-medium ${light ? "text-gold-light" : "text-bordeaux"}`}>
              Apenas {product.stock} em stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
