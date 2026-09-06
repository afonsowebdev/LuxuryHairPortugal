"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { CartIcon } from "@/components/ui/CartIcon";
import { HamburgerIcon } from "@/components/ui/HamburgerIcon";
import { MobileMenuOverlay } from "@/components/layout/MobileMenuOverlay";
import { PhoneIcon, InstagramIcon, HeartIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAdminData } from "@/context/AdminDataContext";
import { MENU_TRANSITION_MS } from "@/lib/motion";

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
  const [menuVisible, setMenuVisible] = useState(false);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { settings: storeSettings } = useAdminData();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;
  const shrink = isHome && scrolled;

  // Publishes the header's real rendered height as a CSS variable so other
  // fixed/sticky elements (e.g. the cart/checkout order-summary sidebar) can
  // offset themselves below it exactly, instead of a hardcoded `top-*` guess
  // that drifts out of sync whenever the header's content or padding changes.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    function update() {
      if (el) document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome, scrolled]);

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Nudges the header's cart/wishlist icons with the same shake used on
  // hover whenever an item is added, so the feedback is visible even if the
  // user's mouse isn't anywhere near it. The key bump forces a remount so
  // rapid, back-to-back adds each replay the animation instead of being
  // swallowed.
  const [cartBumpKey, setCartBumpKey] = useState(0);
  const prevItemCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBumpKey((k) => k + 1);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  const [wishlistBumpKey, setWishlistBumpKey] = useState(0);
  const prevWishlistCount = useRef(wishlistCount);
  useEffect(() => {
    if (wishlistCount > prevWishlistCount.current) {
      setWishlistBumpKey((k) => k + 1);
    }
    prevWishlistCount.current = wishlistCount;
  }, [wishlistCount]);

  function openMenu() {
    setMenuOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
  }

  function closeMenu() {
    setMenuVisible(false);
    window.setTimeout(() => setMenuOpen(false), MENU_TRANSITION_MS);
  }

  return (
    <header ref={headerRef} className={`z-50 ${isHome ? "fixed inset-x-0 top-0" : "sticky top-0"}`}>
      <div
        className={`hidden text-cream/80 sm:block transition-colors duration-300 ${
          transparent ? "bg-transparent" : "bg-plum-dark"
        }`}
      >
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

      <div
        className={`border-b transition-colors duration-300 ${
          transparent
            ? "border-transparent bg-transparent"
            : isHome
              ? "border-gold/10 bg-plum/70 backdrop-blur-lg supports-[backdrop-filter]:bg-plum/55"
              : "border-gold/10 bg-plum/95 backdrop-blur-sm supports-[backdrop-filter]:bg-plum/90"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-[padding] duration-300 sm:px-6 lg:px-8 ${
            shrink ? "py-1.5" : "py-2.5"
          }`}
        >
          <button
            className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon open={menuVisible} />
          </button>

          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Logo
              variant="gold"
              className={`origin-center scale-75 transition-transform duration-300 ${
                shrink ? "sm:scale-75" : "sm:scale-90"
              }`}
            />
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
              className="group relative flex items-center gap-2 p-2 text-cream hover:text-gold active:text-gold"
              aria-label={`Favoritos, ${wishlistCount} ${wishlistCount === 1 ? "produto" : "produtos"}`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-75 rounded-full border border-transparent bg-transparent opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:border-gold/30 group-hover:bg-gold/10 group-hover:opacity-100 group-active:scale-100 group-active:border-gold/30 group-active:bg-gold/10 group-active:opacity-100"
              />
              <HeartIcon
                key={wishlistBumpKey}
                className={`relative h-6 w-6 group-hover:animate-icon-shake group-active:animate-icon-shake ${
                  wishlistBumpKey > 0 ? "animate-icon-shake" : ""
                }`}
                filled={wishlistCount > 0}
              />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-plum-dark">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/carrinho"
              className="group relative flex items-center gap-2 p-2 text-cream hover:text-gold active:text-gold"
              aria-label={`Carrinho de compras, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-75 rounded-full border border-transparent bg-transparent opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:border-gold/30 group-hover:bg-gold/10 group-hover:opacity-100 group-active:scale-100 group-active:border-gold/30 group-active:bg-gold/10 group-active:opacity-100"
              />
              <CartIcon
                key={cartBumpKey}
                className={`relative h-6 w-6 group-hover:animate-icon-shake group-active:animate-icon-shake ${
                  cartBumpKey > 0 ? "animate-icon-shake" : ""
                }`}
              />
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
        <MobileMenuOverlay
          visible={menuVisible}
          onClose={closeMenu}
          navLinks={navLinks}
          pathname={pathname}
          phone={storeSettings.brand.phones[0]}
          instagram={storeSettings.brand.instagram}
          instagramUrl={storeSettings.brand.instagramUrl}
        />
      )}
    </header>
  );
}
