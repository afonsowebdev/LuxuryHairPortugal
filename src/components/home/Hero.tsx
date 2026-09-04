"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useAdminData } from "@/context/AdminDataContext";

const clips = [
  { src: "/assets/videos/closeup-sorriso.mp4", poster: "/assets/videos/closeup-sorriso-poster.png" },
  { src: "/assets/videos/closeup-frontal.mp4", poster: "/assets/videos/closeup-frontal-poster.png" },
  { src: "/assets/videos/closeup-perfil.mp4", poster: "/assets/videos/closeup-perfil-poster.png" },
];

export function Hero() {
  const { settings: storeSettings } = useAdminData();

  // Two permanently-mounted <video> layers crossfade into each other instead
  // of hard-cutting: the hidden layer's src is swapped and started a beat
  // before it fades in, so the switch reads as one continuous dissolve.
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1];
  const [front, setFront] = useState<0 | 1>(0);
  const nextClip = useRef(1);

  useEffect(() => {
    const v = videoRef0.current;
    if (!v) return;
    v.src = clips[0].src;
    v.play().catch(() => {});
  }, []);

  function handleEnded(layer: 0 | 1) {
    if (layer !== front) return; // the hidden layer finishing doesn't drive anything
    const back = layer === 0 ? 1 : 0;
    const backVideo = videoRefs[back].current;
    if (backVideo) {
      backVideo.src = clips[nextClip.current].src;
      backVideo.currentTime = 0;
      backVideo.play().catch(() => {});
    }
    nextClip.current = (nextClip.current + 1) % clips.length;
    setFront(back);
  }

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-plum-dark">
      {([0, 1] as const).map((layer) => (
        <video
          key={layer}
          ref={videoRefs[layer]}
          muted
          playsInline
          poster={clips[layer].poster}
          onEnded={() => handleEnded(layer)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            front === layer ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-plum-dark/60 via-plum-dark/35 to-plum-dark/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(74,30,60,0.12) 0%, rgba(42,15,34,0.45) 70%, rgba(42,15,34,0.65) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <span className="animate-fade-in text-xs font-semibold uppercase tracking-[0.4em] text-gold-light/90">
          Cabelo 100% Humano · Portugal &amp; Moçambique
        </span>

        <h1 className="animate-fade-in-up max-w-2xl text-balance font-serif text-4xl font-semibold leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
          Perucas, Box Braids &amp; Pestanas de Luxo
        </h1>

        <p className="animate-fade-in-up max-w-lg text-balance font-serif text-xl italic text-cream/90 sm:text-2xl">
          &ldquo;Você é tão incrível quanto se permite ser.&rdquo;
        </p>

        <p className="animate-fade-in-up max-w-md text-sm text-cream/60">
          {storeSettings.brand.tagline} Perucas, box braids e pestanas de luxo — feitas para
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

        <div className="animate-fade-in mt-2 opacity-80">
          <Logo variant="gold" className="scale-90" />
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
