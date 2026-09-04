"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { CartIcon } from "@/components/ui/CartIcon";
import { MenuIcon, CloseIcon, PhoneIcon, InstagramIcon, HeartIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdminData } from "@/context/AdminDataContext";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/loja/perucas-lisas", label: "Perucas Lisas" },
  { href: "/loja/box-braids", label: "Box Braids" },
  { href: "/loja/pestanas", label: "Pestanas" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contactos", label: "Contactos" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { settings: storeSettings } = useAdminData();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-plum-dark text-cream/80 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] tracking-wide lg:px-8">
          <p className="italic font-serif text-gold-light/90">{storeSettings.brand.tagline}</p>
          <div className="flex items-center gap-4">
            <a href={`tel:${storeSettings.brand.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-gold">
              <PhoneIcon className="h-3 w-3" />
              {storeSettings.brand.phones[0]}
            </a>
            <a
              href={storeSettings.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gold"
            >
              <InstagramIcon className="h-3 w-3" />
              {storeSettings.brand.instagram}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-plum/95 backdrop-blur supports-[backdrop-filter]:bg-plum/90 border-b border-gold/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            className="p-2 text-cream lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Logo variant="gold" className="scale-75 sm:scale-90" />
          </div>

          <nav className="hidden flex-1 justify-center gap-7 lg:flex" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold ${
                  pathname === link.href ? "text-gold" : "text-cream/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <Link
              href="/favoritos"
              className="relative flex items-center gap-2 p-2 text-cream hover:text-gold"
              aria-label={`Favoritos, ${wishlistCount} ${wishlistCount === 1 ? "produto" : "produtos"}`}
            >
              <HeartIcon className="h-6 w-6" filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-plum-dark">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/carrinho"
              className="relative flex items-center gap-2 p-2 text-cream hover:text-gold"
              aria-label={`Carrinho de compras, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            >
              <CartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-plum-dark">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-plum-dark/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-plum px-6 py-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <Logo variant="gold" className="scale-75 origin-left" />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2 text-cream"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-6" aria-label="Navegação móvel">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-serif text-2xl transition-colors hover:text-gold ${
                    pathname === link.href ? "text-gold" : "text-cream"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-cream/10 pt-6 text-cream/70 text-sm">
              <a href={`tel:${storeSettings.brand.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
                <PhoneIcon className="h-4 w-4" /> {storeSettings.brand.phones[0]}
              </a>
              <a
                href={storeSettings.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <InstagramIcon className="h-4 w-4" /> {storeSettings.brand.instagram}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
