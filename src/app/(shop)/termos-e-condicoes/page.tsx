import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Termos & Condições",
  description: "Termos e condições de utilização e compra na Luxury Hair Portugal.",
};

const sections = [
  {
    title: "1. Objeto",
    body: "Os presentes Termos & Condições regulam a utilização do website Luxury Hair Portugal e a compra dos produtos nele disponibilizados — perucas, box braids e pestanas. Ao efetuar uma encomenda, o cliente aceita integralmente estes termos.",
  },
  {
    title: "2. Produtos e Preços",
    body: "Todos os preços apresentados estão expressos em euros (€) e incluem os impostos aplicáveis em vigor. A Luxury Hair Portugal reserva-se o direito de alterar preços e disponibilidade de produtos sem aviso prévio.",
  },
  {
    title: "3. Encomendas e Pagamento",
    body: "As encomendas são confirmadas após receção do pagamento através dos métodos disponibilizados no checkout, nomeadamente referência Multibanco. As referências geradas têm um prazo de validade limitado, findo o qual a encomenda poderá ser cancelada.",
  },
  {
    title: "4. Envios",
    body: "Efetuamos envios para Portugal Continental, Açores, Madeira e Moçambique. Os prazos de entrega são estimados e podem variar consoante o destino e as condições da transportadora.",
  },
  {
    title: "5. Devoluções e Trocas",
    body: "Por motivos de higiene, produtos de pestanas não são elegíveis para devolução após abertura da embalagem. Perucas e box braids podem ser devolvidas no prazo de 14 dias, desde que não tenham sido usadas e se mantenham na embalagem original.",
  },
  {
    title: "6. Propriedade Intelectual",
    body: "Todo o conteúdo do website — textos, imagens, logótipo e design — é propriedade da Luxury Hair Portugal e não pode ser reproduzido sem autorização prévia.",
  },
  {
    title: "7. Contactos",
    body: "Para qualquer questão relacionada com estes termos, contacte-nos através do Instagram @luxury_hairpt ou dos números de telefone disponíveis na página de Contactos.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Informação Legal" title="Termos & Condições" />
      <Container className="max-w-3xl py-16">
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 font-serif text-xl font-semibold text-plum-dark">{s.title}</h2>
              <p className="text-sm leading-relaxed text-plum-dark/70">{s.body}</p>
            </div>
          ))}
          <p className="text-xs text-plum-dark/40">Última atualização: agosto de 2026.</p>
        </div>
      </Container>
    </>
  );
}
