"use client";

import { useRef } from "react";
import { testimonials } from "@/lib/data/testimonials";
import { StarRating } from "@/components/ui/StarRating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

function QuoteMark() {
  return (
    <svg viewBox="0 0 32 24" className="h-6 w-6 text-gold/50" fill="currentColor" aria-hidden="true">
      <path d="M0 24V14.4C0 9.6 1.2 6 3.6 3.6 6 1.2 9.2 0 13.2 0v4.8c-2.4 0-4.2.6-5.4 1.8C6.6 7.8 6 9.4 6 11.4h6V24H0zm18 0V14.4c0-4.8 1.2-8.4 3.6-10.8C24 1.2 27.2 0 31.2 0v4.8c-2.4 0-4.2.6-5.4 1.8-1.2 1.2-1.8 2.8-1.8 4.8h6V24H18z" />
    </svg>
  );
}

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const amount = (card?.offsetWidth ?? 320) + 20;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-center gap-5">
          <SectionHeading
            eyebrow="Vozes Luxury"
            title="O que dizem sobre nós"
            description="Histórias reais de clientes que encontraram na Luxury Hair Portugal o toque final de confiança e beleza."
          />
          <StarRating
            rating={averageRating}
            count={testimonials.length}
            className="bg-white px-4 py-2 shadow-sm ring-1 ring-plum/10"
          />
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-cream to-transparent sm:w-16"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cream to-transparent sm:w-16"
          />

          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Ver testemunhos anteriores"
            className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-plum/15 bg-white text-plum-dark shadow-sm transition-colors hover:border-gold hover:bg-gold cursor-pointer sm:h-11 sm:w-11"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Ver mais testemunhos"
            className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-plum/15 bg-white text-plum-dark shadow-sm transition-colors hover:border-gold hover:bg-gold cursor-pointer sm:h-11 sm:w-11"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:px-2"
          >
            {testimonials.map((t) => (
              <figure
                key={t.id}
                data-testimonial-card
                className="flex w-[82%] shrink-0 snap-center flex-col gap-4 border border-plum/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:w-[320px]"
              >
                <QuoteMark />
                <StarRating rating={t.rating} />
                <blockquote className="flex-1 text-sm italic leading-relaxed text-plum-dark/80">
                  &ldquo;{t.comment}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-plum/10 pt-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-plum to-bordeaux font-serif text-sm font-semibold text-gold ring-2 ring-gold/20">
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
        </div>
      </Container>
    </section>
  );
}
