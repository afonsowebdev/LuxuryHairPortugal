"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/components/ui/AuthField";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { authClips } from "@/lib/data/authClips";
import { CheckShieldIcon, LockIcon, MailIcon, UserIcon } from "@/components/ui/icons";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerRegisterPage() {
  const { register } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/conta";
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_PATTERN.test(values.email.trim())) {
      setError("Introduza um email válido.");
      return;
    }
    if (values.password.length < 8 || !/[a-zA-Z]/.test(values.password) || !/\d/.test(values.password)) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres, com letras e números.");
      return;
    }
    if (values.password !== values.confirm) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setSubmitting(true);
    const result = await register(values.name, values.email, values.password);
    setSubmitting(false);
    if (result.ok) {
      router.push(redirectTo);
    } else {
      setError(result.error ?? "Não foi possível criar a conta.");
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-plum-dark px-4 py-16">
      <VideoBackground clips={authClips} />
      <div className="absolute inset-0 bg-gradient-to-b from-plum-dark/80 via-plum-dark/60 to-plum-dark/85" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light/90">
            A Minha Conta
          </span>
          <h1 className="font-serif text-3xl font-semibold text-cream sm:text-4xl">Criar Conta</h1>
          <p className="max-w-sm text-sm text-cream/70">
            Registe-se para acompanhar as suas encomendas e agilizar as próximas compras.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border border-cream/15 bg-plum-dark/15 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              label="Nome"
              icon={UserIcon}
              required
              autoComplete="name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
            <AuthField
              label="Email"
              icon={MailIcon}
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <AuthField
              label="Palavra-passe"
              icon={LockIcon}
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            />
            <p className="text-[11px] text-cream/40">Mínimo 8 caracteres, com letras e números.</p>
          </div>
          <AuthField
            label="Confirmar Palavra-passe"
            icon={LockIcon}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))}
          />

          {error && (
            <p role="alert" className="border border-bordeaux/30 bg-bordeaux/20 px-3 py-2 text-xs font-medium text-cream">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={submitting}>
            <CheckShieldIcon className="h-4 w-4" />
            {submitting ? "A criar conta..." : "Criar Conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/70">
          Já tem conta?{" "}
          <Link
            href={`/conta/entrar${redirectTo !== "/conta" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-gold hover:underline"
          >
            Iniciar sessão
          </Link>
        </p>
      </div>
    </section>
  );
}
