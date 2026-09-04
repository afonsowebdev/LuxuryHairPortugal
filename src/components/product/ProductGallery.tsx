"use client";

import { useState } from "react";
import type { CategorySlug } from "@/types";
import { ProductImage } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import type { ProductBadge } from "@/types";

export function ProductGallery({
  slug,
  category,
  images,
  photos,
  badge,
}: {
  slug: string;
  category: CategorySlug;
  images: string[];
  photos?: string[];
  badge: ProductBadge;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-plum-dark/5">
        <ProductImage
          seed={slug}
          category={category}
          index={active}
          src={photos?.[active]}
          alt={images[active]}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4">
          <Badge badge={badge} />
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((label, i) => (
            <button
              key={label}
              onClick={() => setActive(i)}
              aria-label={label}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all cursor-pointer ${
                active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                seed={slug}
                category={category}
                index={i}
                src={photos?.[i]}
                alt={label}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
