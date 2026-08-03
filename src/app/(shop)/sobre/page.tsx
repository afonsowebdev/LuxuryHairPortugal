import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a história e os valores da Luxury Hair Portugal.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="A Nossa História"
        title="Sobre a Luxury Hair Portugal"
        description="Nascemos da paixão por cabelo saudável, bonito e cheio de personalidade."
      />
      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <ProductImage seed="sobre-nos" category="perucas-cacheadas" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-5 text-plum-dark/80">
          <h2 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
            Saúde, amor e cabelos arrumados todos os dias.
          </h2>
          <p>
            A Luxury Hair Portugal nasceu de uma convicção simples: toda a mulher merece
            sentir-se incrível todos os dias. Começámos como uma pequena loja online dedicada a
            perucas de cabelo humano e, hoje, somos uma referência em Portugal e Moçambique para
            perucas, box braids e pestanas de qualidade premium.
          </p>
          <p>
            Selecionamos cuidadosamente cada fornecedor, testamos cada textura e garantimos que
            todas as peças que chegam até si cumprem os mais altos padrões de qualidade, conforto
            e durabilidade. Acreditamos que o verdadeiro luxo está nos detalhes — no brilho
            natural, no caimento perfeito e na confiança que sentimos quando nos olhamos ao
            espelho.
          </p>
          <p className="font-serif text-lg italic text-bordeaux">
            &ldquo;Você é tão incrível quanto se permite ser.&rdquo;
          </p>
          <Button href="/loja" variant="primary" size="lg" className="w-fit">
            Descobrir a Coleção
          </Button>
        </div>
      </Container>
    </>
  );
}
