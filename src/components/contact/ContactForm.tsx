"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { LockIcon, SendIcon, CheckShieldIcon } from "@/components/ui/icons";
import { useAdminData } from "@/context/AdminDataContext";

const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_KEY = "lhp_contact_last_submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = { name: 80, subject: 120, message: 2000 };

function sanitize(text: string) {
  return text.trim().replace(/[<>]/g, "");
}

function randomDigit() {
  return 1 + Math.floor(Math.random() * 8);
}

function newChallenge() {
  return { a: randomDigit(), b: randomDigit() };
}

export function ContactForm() {
  const { addContactMessage } = useAdminData();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [challenge, setChallenge] = useState(newChallenge);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Honeypot: invisible to real users, only bots fill it in. Fail silently
    // with a fake success so scrapers don't learn the field is a trap.
    if (honeypot.trim().length > 0) {
      setSent(true);
      return;
    }

    if (!EMAIL_PATTERN.test(values.email.trim())) {
      setError("Introduza um email válido.");
      return;
    }

    if (Number(answer) !== challenge.a + challenge.b) {
      setError("Resposta de verificação incorreta. Tente novamente.");
      setChallenge(newChallenge());
      setAnswer("");
      return;
    }

    const lastSubmit = Number(window.localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    const elapsed = Date.now() - lastSubmit;
    if (elapsed < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
      setError(`Aguarde ${wait}s antes de enviar outra mensagem.`);
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      addContactMessage({
        name: sanitize(values.name).slice(0, LIMITS.name),
        email: sanitize(values.email).slice(0, 200),
        subject: sanitize(values.subject).slice(0, LIMITS.subject),
        message: sanitize(values.message).slice(0, LIMITS.message),
      });
      window.localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      setSubmitting(false);
      setSent(true);
    }, 500);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 border border-gold/20 bg-gold/10 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-plum-dark">
          <CheckShieldIcon className="h-7 w-7" />
        </span>
        <p className="font-serif text-xl font-semibold text-plum-dark">Mensagem enviada!</p>
        <p className="max-w-sm text-sm text-plum-dark/70">
          Obrigada pelo seu contacto. A nossa equipa responderá o mais brevemente possível.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-4 border border-plum/10 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      {/* Honeypot: kept out of the tab order and off-screen (not display:none,
          which some bots detect and skip) so it stays invisible to real users. */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Não preencher este campo
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Nome</span>
          <input
            required
            maxLength={LIMITS.name}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-plum-dark/70">Email</span>
          <input
            required
            type="email"
            maxLength={200}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            className="input"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-xs font-medium text-plum-dark/70">Assunto</span>
        <input
          required
          maxLength={LIMITS.subject}
          value={values.subject}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
          className="input"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="flex items-baseline justify-between text-xs font-medium text-plum-dark/70">
          Mensagem
          <span className="text-[11px] text-plum-dark/35">
            {values.message.length}/{LIMITS.message}
          </span>
        </span>
        <textarea
          required
          rows={5}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="input resize-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-xs font-medium text-plum-dark/70">
          Verificação anti-spam: quanto é {challenge.a} + {challenge.b}?
        </span>
        <input
          required
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={answer}
          onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
          className="input w-24"
          aria-label="Resposta de verificação anti-spam"
        />
      </label>

      {error && (
        <p role="alert" className="bg-bordeaux/10 px-3 py-2 text-xs font-medium text-bordeaux">
          {error}
        </p>
      )}

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[11px] text-plum-dark/45">
          <LockIcon className="h-3.5 w-3.5 shrink-0 text-plum-dark/35" />
          Os seus dados são tratados com confidencialidade e nunca partilhados com terceiros.
        </p>
        <Button type="submit" variant="primary" size="lg" className="w-fit shrink-0" disabled={submitting}>
          <SendIcon className="h-4 w-4" />
          {submitting ? "A enviar..." : "Enviar Mensagem"}
        </Button>
      </div>
    </form>
  );
}
