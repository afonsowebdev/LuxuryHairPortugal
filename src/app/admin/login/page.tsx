"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Email ou palavra-passe incorretos.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-plum-dark px-4">
      <div className="w-full max-w-sm bg-plum/40 p-8 shadow-2xl ring-1 ring-gold/10">
        <div className="mb-8 flex justify-center">
          <Logo variant="gold" href="" />
        </div>
        <h1 className="mb-1 text-center font-serif text-xl font-semibold text-cream">
          Painel de Administração
        </h1>
        <p className="mb-6 text-center text-xs text-cream/50">
          Acesso restrito à equipa Luxury Hair Portugal
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-cream/70">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-cream/20 bg-transparent px-4 py-2.5 text-cream outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-xs font-medium text-cream/70">Palavra-passe</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-cream/20 bg-transparent px-4 py-2.5 text-cream outline-none focus:border-gold"
            />
          </label>
          {error && <p className="text-xs text-red-300">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
            {submitting ? "A entrar..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 bg-cream/5 p-3 text-center text-[11px] text-cream/40">
          Protótipo, credenciais de demonstração: <br />
          admin@luxuryhair.pt / Admin123!
        </p>

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-cream/40 hover:text-gold"
        >
          ← Voltar à loja
        </Link>
      </div>
    </div>
  );
}
