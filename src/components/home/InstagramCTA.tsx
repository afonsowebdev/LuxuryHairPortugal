"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";

export function InstagramCTA() {
  const { products, settings: storeSettings } = useAdminData();
  const shots = products.slice(0, 4);

  return (
    <section className="overflow-hidden bg-plum py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-4 text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold">
            <InstagramIcon className="h-5 w-5" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-cream sm:text-4xl">
            Siga-nos {storeSettings.brand.instagram}
          </h2>
          <p className="max-w-md text-sm text-cream/60">
            A nossa loja vive no Instagram: inspiração diária, transformações reais e as últimas
            novidades em primeira mão.
          </p>
          <a
            href={storeSettings.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-plum-dark"
          >
            Ver perfil completo →
          </a>
        </div>

        {shots.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {shots.map((p, i) => (
              <a
                key={p.id}
                href={storeSettings.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square overflow-hidden rounded shadow-lg shadow-black/20 ${
                  i % 2 === 1 ? "sm:translate-y-6" : ""
                }`}
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
        )}
      </Container>
    </section>
  );
}
