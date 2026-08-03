"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-gold/10 p-8 text-center">
        <p className="font-serif text-xl font-semibold text-plum-dark">Mensagem enviada!</p>
        <p className="text-sm text-plum-dark/70">
          Obrigada pelo seu contacto. A nossa equipa responderá o mais brevemente possível.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Nome</span>
          <input required className="input" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Email</span>
          <input required type="email" className="input" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-xs font-medium text-plum-dark/70">Assunto</span>
        <input required className="input" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-xs font-medium text-plum-dark/70">Mensagem</span>
        <textarea required rows={5} className="input resize-none" />
      </label>
      <Button type="submit" variant="primary" size="lg" className="w-fit">
        Enviar Mensagem
      </Button>
    </form>
  );
}
