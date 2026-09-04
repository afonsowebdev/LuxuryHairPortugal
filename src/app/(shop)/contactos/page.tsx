import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contactos",
  description: "Entre em contacto com a Luxury Hair Portugal.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Estamos Aqui"
        title="Contactos"
        description="Tem alguma questão sobre os nossos produtos, encomendas ou envios? Fale connosco."
      />
      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-2xl font-semibold text-plum-dark">Fale Connosco</h2>
          <ContactInfo />
        </div>
        <div>
          <h2 className="mb-6 font-serif text-2xl font-semibold text-plum-dark">
            Envie-nos uma Mensagem
          </h2>
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
