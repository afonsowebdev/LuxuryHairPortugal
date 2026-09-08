"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AuthField } from "@/components/ui/AuthField";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { authClips } from "@/lib/data/authClips";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function CustomerLoginPage() {
  const { login } = useCustomerAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/conta";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      router.push(redirectTo);
    } else {
      setError(result.error ?? "Não foi possível iniciar sessão.");
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
          <h1 className="font-serif text-3xl font-semibold text-cream sm:text-4xl">Entrar</h1>
          <p className="max-w-sm text-sm text-cream/70">
            Aceda à sua conta para consultar o histórico de encomendas e os seus dados.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-cream/15 bg-plum-dark/15 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          <AuthField
            label="Email"
            icon={MailIcon}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthField
            label="Palavra-passe"
            icon={LockIcon}
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p role="alert" className="rounded-lg border border-bordeaux/30 bg-bordeaux/20 px-3 py-2 text-xs font-medium text-cream">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={submitting}>
            <LockIcon className="h-4 w-4" />
            {submitting ? "A entrar..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cream/70">
          Ainda não tem conta?{" "}
          <Link
            href={`/conta/criar${redirectTo !== "/conta" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-gold hover:underline"
          >
            Crie uma agora
          </Link>
        </p>
      </div>
    </section>
  );
}
