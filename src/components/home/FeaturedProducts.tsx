import { getFeaturedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="bg-plum-dark py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Seleção Exclusiva"
          title="Mais Vendidos"
          description="As peças preferidas da nossa comunidade — qualidade premium, sempre à espera de si."
          light
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} light />
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <Button href="/loja" variant="secondary" size="lg">
            Ver Toda a Loja
          </Button>
        </div>
      </Container>
    </section>
  );
}
