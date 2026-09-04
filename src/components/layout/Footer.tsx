"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, PhoneIcon } from "@/components/ui/icons";
import { NewsletterForm } from "./NewsletterForm";
import { useAdminData } from "@/context/AdminDataContext";

export function Footer() {
  const { settings: storeSettings, categories } = useAdminData();
  return (
    <footer className="border-t border-gold/10 bg-plum-dark text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
          <Logo variant="gold" className="items-start" />
          <p className="max-w-xs text-sm text-cream/60">
            {storeSettings.brand.tagline} Perucas de cabelo 100% humano, box braids e pestanas
            premium — com envio para Portugal e Moçambique.
          </p>
          <a
            href={storeSettings.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-plum-dark"
          >
            <InstagramIcon className="h-4 w-4" />
            {storeSettings.brand.instagram}
          </a>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Categorias
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/loja/${c.slug}`} className="hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Apoio ao Cliente
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
            <li>
              <Link href="/sobre" className="hover:text-gold">Sobre Nós</Link>
            </li>
            <li>
              <Link href="/contactos" className="hover:text-gold">Contactos</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gold">Perguntas Frequentes</Link>
            </li>
            <li>
              <Link href="/termos-e-condicoes" className="hover:text-gold">Termos &amp; Condições</Link>
            </li>
            <li>
              <Link href="/politica-privacidade" className="hover:text-gold">Política de Privacidade</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Newsletter
          </h3>
          <p className="text-sm text-cream/60">
            Receba em primeira mão as novidades, promoções e inspiração de cabelo.
          </p>
          <NewsletterForm />
          <div className="mt-2 flex flex-col gap-1.5 text-sm text-cream/60">
            {storeSettings.brand.phones.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
                <PhoneIcon className="h-3.5 w-3.5" /> {phone}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-cream/40 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Luxury Hair Portugal. Todos os direitos reservados.</p>
          <p>Feito com amor para quem se permite ser incrível.</p>
          <Link href="/admin/login" className="text-cream/30 hover:text-gold">
            Acesso Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
