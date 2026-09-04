import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-plum-dark px-6 text-center">
      <Logo variant="gold" className="scale-90" />
      <div className="flex flex-col gap-2">
        <p className="font-serif text-6xl font-semibold text-gold">404</p>
        <h1 className="font-serif text-2xl font-semibold text-cream">Página não encontrada</h1>
        <p className="max-w-sm text-sm text-cream/60">
          A página que procura pode ter sido movida ou já não existe. Volte à loja e continue a
          descobrir a sua transformação.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="primary" size="lg">
          Página Inicial
        </Button>
        <Button href="/loja" variant="outline-light" size="lg">
          Ir para a Loja
        </Button>
      </div>
    </div>
  );
}
