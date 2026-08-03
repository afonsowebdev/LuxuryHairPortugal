import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Respostas às perguntas mais frequentes sobre encomendas, envios e pagamentos.",
};

const faqs = [
  {
    question: "As perucas são de cabelo 100% humano?",
    answer:
      "Sim. Todas as nossas perucas são confecionadas com cabelo humano Remy de alta qualidade, selecionado para garantir brilho, movimento e durabilidade naturais.",
  },
  {
    question: "Quanto tempo demora o envio?",
    answer:
      "Para Portugal Continental, o envio demora 1-2 dias úteis. Açores e Madeira demoram 3-5 dias úteis. Para Moçambique, o prazo é de 5-10 dias úteis.",
  },
  {
    question: "Como funciona o pagamento por Multibanco?",
    answer:
      "Após finalizar a sua encomenda, receberá uma Entidade e uma Referência únicas. Pode efetuar o pagamento em qualquer caixa Multibanco, homebanking ou MB WAY. A referência é válida por 48 horas.",
  },
  {
    question: "Posso trocar a cor ou o comprimento depois de encomendar?",
    answer:
      "Entre em contacto connosco através do Instagram @luxury_hairpt ou por telefone o mais rapidamente possível após a encomenda. Faremos os possíveis para ajustar antes do envio.",
  },
  {
    question: "Como devo cuidar da minha peruca ou box braids?",
    answer:
      "Cada produto inclui instruções de cuidado específicas na página do produto, no separador 'Cuidados'. Em geral, recomendamos lavagens espaçadas, produtos sem sulfatos e armazenamento em suporte próprio.",
  },
  {
    question: "Fazem envios para fora de Portugal e Moçambique?",
    answer:
      "De momento entregamos apenas em Portugal (Continente, Açores e Madeira) e Moçambique. Para outros destinos, contacte-nos para avaliarmos a possibilidade.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Apoio ao Cliente"
        title="Perguntas Frequentes"
        description="Tudo o que precisa de saber antes de fazer a sua encomenda."
      />
      <Container className="py-16">
        <FaqAccordion items={faqs} />
      </Container>
    </>
  );
}
