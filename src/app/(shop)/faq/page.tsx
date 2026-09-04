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
      "As encomendas são enviadas em dias úteis através de CTT / CTT Expresso. Para Portugal Continental a entrega é feita em 24 horas e para Açores e Madeira em 72 horas. Para Moçambique, o prazo é de 5-10 dias úteis. Envio grátis para encomendas superiores a 250€ em Portugal; abaixo desse valor o custo de envio é de 7,99€.",
  },
  {
    question: "Como funciona o pagamento por Multibanco?",
    answer:
      "Após finalizar a sua encomenda, receberá uma Entidade e uma Referência únicas. Pode efetuar o pagamento em qualquer caixa Multibanco, homebanking, MB WAY ou por transferência bancária. A referência é válida por 48 horas.",
  },
  {
    question: "A minha encomenda foi devolvida, o que faço?",
    answer:
      "Entre em contacto com a nossa linha de apoio ao cliente (934 762 839) para verificarmos o motivo da devolução e resolvermos a situação o mais rápido possível.",
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
