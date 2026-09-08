"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useAdminData } from "@/context/AdminDataContext";
import { getEffectiveBadge } from "@/lib/data/products";
import { ProductGallery } from "./ProductGallery";
import { ProductDetailClient } from "./ProductDetailClient";
import { RelatedProducts } from "./RelatedProducts";
import { Container } from "@/components/ui/Container";

export function ProductPageClient({ slug }: { slug: string }) {
  const { products, hydrated } = useAdminData();
  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Luxury Hair Portugal`;
    }
  }, [product]);

  if (!hydrated) {
    return (
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-[4/5] animate-pulse rounded-lg bg-plum-dark/5" />
          <div className="flex flex-col gap-4">
            <div className="h-3 w-28 animate-pulse rounded bg-plum-dark/5" />
            <div className="h-9 w-2/3 animate-pulse rounded bg-plum-dark/5" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-plum-dark/5" />
            <div className="h-32 animate-pulse rounded bg-plum-dark/5" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          slug={product.slug}
          category={product.category}
          images={product.images}
          photos={product.photos}
          badge={getEffectiveBadge(product)}
        />
        <ProductDetailClient product={product} />
      </div>
      <RelatedProducts products={related} />
    </Container>
  );
}
