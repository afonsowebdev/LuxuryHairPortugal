"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";

export function InstagramCTA() {
  const { products, settings: storeSettings } = useAdminData();
  const shots = products.slice(0, 6);

  return (
    <section className="bg-plum py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-3 text-center">
        <InstagramIcon className="h-7 w-7 text-gold" />
        <h2 className="font-serif text-3xl font-semibold text-cream sm:text-4xl">
          Siga-nos {storeSettings.brand.instagram}
        </h2>
        <p className="max-w-xl text-sm text-cream/60">
          A nossa loja vive no Instagram — inspiração diária, transformações reais e as últimas
          novidades em primeira mão.
        </p>
        <a
          href={storeSettings.brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:underline"
        >
          Ver perfil completo →
        </a>
      </Container>
      {shots.length > 0 && (
        <Container className="mt-10">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
            {shots.map((p) => (
              <a
                key={p.id}
                href={storeSettings.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <ProductImage
                  seed={p.slug}
                  category={p.category}
                  src={p.photos?.[0]}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-plum-dark/0 transition-colors group-hover:bg-plum-dark/40">
                  <InstagramIcon className="h-6 w-6 text-cream opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}
