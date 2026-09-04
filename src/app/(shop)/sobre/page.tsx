import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getImageFocus } from "@/lib/imageFocus";

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
        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/assets/modelos/lifestyle-sacos-luxury-hair.jpg"
              alt="Duas clientes com sacos de compras Luxury Hair Portugal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: getImageFocus("/assets/modelos/lifestyle-sacos-luxury-hair.jpg") }}
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg"
              alt="Retrato de modelo Luxury Hair Portugal"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
              style={{ objectPosition: getImageFocus("/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg") }}
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/assets/modelos/modelo-aplicacao-pestanas.jpg"
              alt="Modelo a aplicar pestanas Luxury Hair Portugal"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
              style={{ objectPosition: getImageFocus("/assets/modelos/modelo-aplicacao-pestanas.jpg") }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 text-plum-dark/80">
          <h2 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
            Saúde, amor e cabelos arrumados todos os dias.
          </h2>
          <p>
            A Luxury Hair Portugal é uma loja online especializada na venda de perucas, box
            braids e pestanas 100% naturais e certificadas. Vaidade e sensualidade são irmãs
            gémeas na vida de uma mulher — por isso trazemos uma variedade de cabelos que deixam
            qualquer mulher mais atraente, linda e poderosa.
          </p>
          <p>
            Somos uma referência para todas as mulheres que gostam e pretendem mudar de visual,
            de acordo com os seus desejos e tendências. Selecionamos cuidadosamente cada
            fornecedor e garantimos que todo o cabelo é certificado e verificado antes de ser
            enviado, para que cumpra os mais altos padrões de qualidade, conforto e durabilidade.
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
