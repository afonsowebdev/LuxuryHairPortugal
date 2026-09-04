"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-plum-dark px-6 text-center">
      <Logo variant="gold" className="scale-90" />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-2xl font-semibold text-cream">Algo correu mal</h1>
        <p className="max-w-sm text-sm text-cream/60">
          Ocorreu um erro inesperado ao carregar esta página. Pode tentar novamente ou voltar à
          página inicial.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} variant="primary" size="lg">
          Tentar Novamente
        </Button>
        <Button href="/" variant="outline-light" size="lg">
          Página Inicial
        </Button>
      </div>
    </div>
  );
}
