import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Luxury Hair Portugal recolhe, utiliza e protege os seus dados pessoais.",
};

const sections = [
  {
    title: "1. Dados Recolhidos",
    body: "Recolhemos os dados fornecidos voluntariamente pelo cliente no momento da encomenda: nome, email, telefone, morada de envio e, quando aplicável, informações de faturação.",
  },
  {
    title: "2. Finalidade do Tratamento",
    body: "Os dados recolhidos são utilizados exclusivamente para processar encomendas, gerir a relação com o cliente, cumprir obrigações legais e, mediante consentimento, enviar comunicações de marketing através da newsletter.",
  },
  {
    title: "3. Partilha de Dados",
    body: "Os dados pessoais não são vendidos a terceiros. Poderão ser partilhados com transportadoras e prestadores de serviços de pagamento estritamente necessários ao cumprimento da encomenda.",
  },
  {
    title: "4. Segurança",
    body: "Adotamos medidas técnicas e organizativas adequadas para proteger os dados pessoais contra acesso não autorizado, perda ou divulgação indevida.",
  },
  {
    title: "5. Direitos do Titular dos Dados",
    body: "Pode, a qualquer momento, solicitar o acesso, retificação ou eliminação dos seus dados pessoais, bem como retirar o consentimento para comunicações de marketing, contactando-nos diretamente.",
  },
  {
    title: "6. Cookies",
    body: "O website poderá utilizar cookies essenciais ao seu funcionamento, nomeadamente para manter os itens no carrinho de compras durante a sua visita.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Informação Legal" title="Política de Privacidade" />
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
