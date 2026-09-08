"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { useAdminData } from "@/context/AdminDataContext";

export function CategoryGrid() {
  const { categories } = useAdminData();
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="As Nossas Coleções"
          title="Escolha a sua transformação"
          description="Quatro coleções pensadas para realçar a sua beleza, com a qualidade e o brilho que só o luxo verdadeiro proporciona."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/loja/${category.slug}`}
              className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden shadow-md shadow-plum/10 ring-1 ring-plum/5 animate-fade-in-up lg:aspect-auto lg:h-[440px] ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ProductImage
                seed={category.slug}
                category={category.slug}
                src={category.photo}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-dark/25 to-transparent transition-opacity duration-500 group-hover:from-plum-dark/90 group-hover:via-plum-dark/40" />

              <span className="absolute left-6 top-6 font-serif text-xs font-semibold uppercase tracking-[0.3em] text-gold-light/80">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                aria-hidden="true"
                className="absolute right-6 top-6 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-cream/40 text-cream opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:border-gold group-hover:bg-gold group-hover:text-plum-dark group-hover:opacity-100"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M5 15L15 5M15 5H7M15 5V13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <div className="relative flex flex-col gap-1.5 p-6">
                <h3 className="font-serif text-xl font-semibold text-cream sm:text-2xl">
                  {category.name}
                </h3>
                <p className="max-w-[26rem] text-xs text-cream/70 line-clamp-2 sm:text-sm">
                  {category.description}
                </p>
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 border-b border-gold/0 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold transition-colors group-hover:border-gold/60">
                  Ver coleção
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
