import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { storeSettings } from "@/lib/data/settings";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-plum-dark">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#6E2A54" />
            <stop offset="55%" stopColor="#4A1E3C" />
            <stop offset="100%" stopColor="#2A0F22" />
          </radialGradient>
          <linearGradient id="hero-strand-a" x1="0" x2="1">
            <stop offset="0%" stopColor="#E8A64C" stopOpacity="0" />
            <stop offset="50%" stopColor="#E8A64C" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E8A64C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1440" height="1000" fill="url(#hero-glow)" />
        <g stroke="url(#hero-strand-a)" fill="none" strokeWidth="1.5">
          <path d="M-100 200 C 300 100, 500 380, 900 220 S 1500 120, 1600 260" />
          <path d="M-100 420 C 350 320, 550 600, 950 440 S 1500 340, 1600 480" />
          <path d="M-100 640 C 300 540, 600 820, 1000 660 S 1500 560, 1600 700" />
          <path d="M-100 820 C 320 720, 620 960, 1020 840 S 1500 760, 1600 880" />
        </g>
        <g fill="#E8A64C">
          <circle cx="220" cy="180" r="1.6" opacity="0.7" />
          <circle cx="1180" cy="260" r="2" opacity="0.6" />
          <circle cx="980" cy="620" r="1.4" opacity="0.5" />
          <circle cx="320" cy="760" r="1.8" opacity="0.6" />
          <circle cx="1300" cy="700" r="1.4" opacity="0.5" />
        </g>
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <span className="animate-fade-in text-xs font-semibold uppercase tracking-[0.4em] text-gold-light/90">
          Cabelo 100% Humano · Portugal &amp; Moçambique
        </span>
        <div className="animate-fade-in-up">
          <Logo variant="gold" className="scale-125 sm:scale-150" />
        </div>
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
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-cream/30 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </div>
    </section>
  );
}
