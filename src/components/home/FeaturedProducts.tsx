"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FeaturedProducts() {
  const { products } = useAdminData();
  const featured = products.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <section className="bg-plum-dark py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Seleção Exclusiva"
          title="Mais Vendidos"
          description="As peças preferidas da nossa comunidade — qualidade premium, sempre à espera de si."
          light
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} light />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/loja" variant="secondary" size="lg">
            Ver Toda a Loja
          </Button>
        </div>
      </Container>
    </section>
  );
}
