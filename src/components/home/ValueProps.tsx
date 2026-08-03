import { Container } from "@/components/ui/Container";

const props = [
  {
    title: "Cabelo 100% Humano",
    description: "Fibra Remy selecionada, com brilho e movimento naturais.",
  },
  {
    title: "Envio PT & Moçambique",
    description: "Entregas rápidas e seguras para todo o território português e Moçambique.",
  },
  {
    title: "Pagamento Multibanco",
    description: "Compre com total confiança através de referência Multibanco.",
  },
  {
    title: "Atendimento Dedicado",
    description: "Suporte próximo via Instagram e WhatsApp em cada etapa da compra.",
  },
];

export function ValueProps() {
  return (
    <section className="bg-bordeaux py-14">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {props.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 text-center">
              <span className="h-px w-10 bg-gold/60" />
              <h3 className="font-serif text-lg font-semibold text-cream">{item.title}</h3>
              <p className="text-sm text-cream/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
