import { testimonials } from "@/lib/data/testimonials";
import { StarRating } from "@/components/ui/StarRating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export function Testimonials() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Vozes Luxury"
          title="O que dizem sobre nós"
          description="Histórias reais de clientes que encontraram na Luxury Hair Portugal o toque final de confiança e beleza."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col gap-4 rounded-2xl bg-white/60 p-6 shadow-sm ring-1 ring-plum/5"
            >
              <StarRating rating={t.rating} />
              <blockquote className="flex-1 text-sm italic text-plum-dark/80">
                &ldquo;{t.comment}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-plum font-serif text-sm font-semibold text-gold">
                  {t.avatar}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-plum-dark">{t.author}</span>
                  <span className="text-xs text-plum-dark/50">{t.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
