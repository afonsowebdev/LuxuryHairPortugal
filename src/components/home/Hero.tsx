"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { heroClips } from "@/lib/data/heroClips";
import { useAdminData } from "@/context/AdminDataContext";

export function Hero() {
  const { settings: storeSettings } = useAdminData();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-plum-dark">
      <VideoBackground clips={heroClips} />
      <div className="absolute inset-0 bg-gradient-to-b from-plum-dark/60 via-plum-dark/35 to-plum-dark/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(74,30,60,0.12) 0%, rgba(42,15,34,0.45) 70%, rgba(42,15,34,0.65) 100%)",
        }}
      />

      <div className="relative z-10 mt-12 flex flex-col items-center gap-5 px-6 text-center sm:mt-20">
        <span className="animate-fade-in text-xs font-semibold uppercase tracking-[0.4em] text-gold-light/90">
          Cabelo 100% Humano · Portugal &amp; Moçambique
        </span>

        <h1 className="animate-fade-in-up max-w-2xl text-balance font-serif text-4xl font-semibold leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
          Perucas, Box Braids &amp; Pestanas de Luxo
        </h1>

        <p className="animate-fade-in-up max-w-md text-balance font-serif text-base italic text-cream/90 sm:text-lg">
          &ldquo;Você é tão incrível quanto se permite ser.&rdquo;
        </p>

        <p className="animate-fade-in-up max-w-md text-sm text-cream/60">
          {storeSettings.brand.tagline} Perucas, box braids e pestanas de luxo, feitas para
          realçar a sua beleza natural.
        </p>

        <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row">
          <Button href="/loja" variant="primary" size="lg">
            Explorar Coleção
          </Button>
          <Button href="/loja/box-braids" variant="outline-light" size="lg">
            Ver Box Braids
          </Button>
        </div>

        <div className="animate-fade-in mt-1 opacity-80">
          <Logo variant="gold" className="scale-75" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-cream/30 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </div>
    </section>
  );
}
