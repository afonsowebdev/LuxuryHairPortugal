"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useAdminData } from "@/context/AdminDataContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistClient() {
  const { productIds } = useWishlist();
  const { getProductById, hydrated: catalogHydrated } = useAdminData();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  if (!hydrated || !catalogHydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-plum-dark/5" />
        ))}
      </div>
    );
  }

  const products = productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <HeartIcon className="h-14 w-14 text-plum/30" />
        <h1 className="font-serif text-2xl font-semibold text-plum-dark">
          Ainda não tem favoritos
        </h1>
        <p className="text-sm text-plum-dark/60">
          Toque no coração de um produto para o guardar aqui e comparar mais tarde.
        </p>
        <Button href="/loja" variant="primary" size="lg" className="mt-2">
          Explorar Coleção
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
