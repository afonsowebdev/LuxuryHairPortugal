import { Container } from "@/components/ui/Container";
import { CertifiedIcon, TruckIcon, CreditCardIcon, SupportIcon } from "@/components/ui/icons";
import type { ComponentType } from "react";

const props: { title: string; description: string; icon: ComponentType<{ className?: string }> }[] = [
  {
    title: "Cabelo 100% Humano",
    description: "Fibra Remy selecionada, com brilho e movimento naturais.",
    icon: CertifiedIcon,
  },
  {
    title: "Envio PT & Moçambique",
    description: "Entregas rápidas e seguras para todo o território português e Moçambique.",
    icon: TruckIcon,
  },
  {
    title: "Pagamento Multibanco",
    description: "Compre com total confiança através de referência Multibanco.",
    icon: CreditCardIcon,
  },
  {
    title: "Atendimento Dedicado",
    description: "Suporte próximo via Instagram e WhatsApp em cada etapa da compra.",
    icon: SupportIcon,
  },
];

export function ValueProps() {
  return (
    <section className="bg-bordeaux py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4 lg:gap-8">
          {props.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col items-center gap-3 px-2 text-center lg:border-cream/15 lg:px-6 ${
                i > 0 ? "lg:border-l" : ""
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-cream/5 text-gold">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-lg font-semibold text-cream">{item.title}</h3>
              <p className="max-w-[15rem] text-sm leading-relaxed text-cream/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
