import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { ProductImage } from "@/components/product/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export function CategoryGrid() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="As Nossas Coleções"
          title="Escolha a sua transformação"
          description="Quatro coleções pensadas para realçar a sua beleza, com a qualidade e o brilho que só o luxo verdadeiro proporciona."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/loja/${category.slug}`}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl shadow-lg shadow-plum/10 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <ProductImage
                seed={category.slug}
                category={category.slug}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/90 via-plum-dark/20 to-transparent" />
              <div className="relative flex flex-col gap-1 p-6">
                <h3 className="font-serif text-xl font-semibold text-cream">{category.name}</h3>
                <p className="text-xs text-cream/70 line-clamp-2">{category.description}</p>
                <span className="mt-2 inline-flex w-fit items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
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
