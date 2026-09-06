"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, PhoneIcon } from "@/components/ui/icons";
import { NewsletterForm } from "./NewsletterForm";
import { Container } from "@/components/ui/Container";
import { useAdminData } from "@/context/AdminDataContext";

export function Footer() {
  const { settings: storeSettings, categories } = useAdminData();

  return (
    <footer className="border-t border-plum/10 bg-cream text-plum-dark">
      <Container className="grid grid-cols-1 gap-x-8 gap-y-12 py-16 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap lg:justify-between lg:gap-x-8 lg:py-20">
        <div className="col-span-1 flex flex-col gap-4 sm:col-span-2 lg:w-80 lg:shrink-0">
          <Logo variant="plum" className="items-start" />
          <p className="max-w-xs text-sm leading-relaxed text-plum-dark/60">
            {storeSettings.brand.tagline} Perucas de cabelo 100% humano, box braids e pestanas
            premium, com envio para Portugal e Moçambique.
          </p>
          <div className="mt-1 flex flex-nowrap items-start gap-6 text-sm text-plum-dark/70">
            <a
              href={storeSettings.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 transition-colors hover:text-bordeaux"
            >
              <InstagramIcon className="h-4 w-4 shrink-0 text-bordeaux/60" />
              {storeSettings.brand.instagram}
            </a>
            <div className="flex shrink-0 items-start gap-2">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux/60" />
              <div className="flex flex-col">
                {storeSettings.brand.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="whitespace-nowrap transition-colors hover:text-bordeaux"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-36 lg:shrink-0">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-bordeaux">
            Categorias
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-plum-dark/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/loja/${c.slug}`} className="transition-colors hover:text-bordeaux">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-48 lg:shrink-0">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-bordeaux">
            Apoio ao Cliente
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-plum-dark/70">
            <li><Link href="/sobre" className="transition-colors hover:text-bordeaux">Sobre Nós</Link></li>
            <li><Link href="/contactos" className="transition-colors hover:text-bordeaux">Contactos</Link></li>
            <li><Link href="/faq" className="transition-colors hover:text-bordeaux">Perguntas Frequentes</Link></li>
            <li><Link href="/termos-e-condicoes" className="transition-colors hover:text-bordeaux">Termos &amp; Condições</Link></li>
            <li><Link href="/politica-privacidade" className="transition-colors hover:text-bordeaux">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 lg:w-72 lg:shrink-0">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-bordeaux">
            Newsletter
          </h4>
          <p className="text-sm text-plum-dark/60">
            Receba em primeira mão as novidades e promoções.
          </p>
          <NewsletterForm variant="light" />
        </div>
      </Container>

      <div className="border-t border-plum-dark/10 bg-plum-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-cream/40 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Luxury Hair Portugal. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="text-cream/30 transition-colors hover:text-gold">
            Acesso Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
