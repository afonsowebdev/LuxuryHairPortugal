"use client";

import { useState, type FormEvent } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { MailIcon } from "@/components/ui/icons";

export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { addNewsletterSubscriber } = useAdminData();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    addNewsletterSubscriber(email);
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <p className={`text-sm ${variant === "light" ? "text-bordeaux" : "text-gold"}`} role="status">
        Obrigada por subscrever! Em breve receberá as nossas novidades. ✨
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-wrap gap-2">
      <div className="relative min-w-[9rem] flex-1">
        <MailIcon
          className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
            variant === "light" ? "text-plum-dark/35" : "text-cream/40"
          }`}
        />
        <label htmlFor="newsletter-email" className="sr-only">
          O seu email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="O seu email"
          className={`w-full border py-2.5 pl-11 pr-4 text-sm outline-none focus:border-gold ${
            variant === "light"
              ? "border-plum/20 bg-white text-plum-dark placeholder:text-plum-dark/40"
              : "border-cream/20 bg-transparent text-cream placeholder:text-cream/40"
          }`}
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-plum-dark transition-colors hover:bg-gold-light cursor-pointer"
      >
        Subscrever
      </button>
    </form>
  );
}
