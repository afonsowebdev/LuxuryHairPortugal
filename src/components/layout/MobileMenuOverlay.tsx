import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon, InstagramIcon } from "@/components/ui/icons";
import { MENU_TRANSITION_MS, MENU_EASING } from "@/lib/motion";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuOverlayProps {
  visible: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  pathname: string;
  phone: string;
  instagram: string;
  instagramUrl: string;
}

export function MobileMenuOverlay({
  visible,
  onClose,
  navLinks,
  pathname,
  phone,
  instagram,
  instagramUrl,
}: MobileMenuOverlayProps) {
  return (
    <div
      className={`bg-noise fixed inset-0 z-40 flex flex-col bg-plum-dark transition-[opacity,transform] lg:hidden ${
        visible ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
      }`}
      style={{ transitionDuration: `${MENU_TRANSITION_MS}ms`, transitionTimingFunction: MENU_EASING }}
      onClick={onClose}
    >
      <div className="flex justify-center pt-8">
        <Logo variant="gold" />
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-5" aria-label="Navegação móvel">
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`font-serif text-2xl font-normal transition-colors hover:text-gold sm:text-3xl ${
              visible ? "animate-fade-in-up" : "opacity-0"
            } ${pathname === link.href ? "text-gold" : "text-cream"}`}
            style={{ animationDelay: visible ? `${120 + i * 55}ms` : undefined }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div
        className={`flex flex-col items-center gap-4 border-t border-cream/10 px-6 pb-10 pt-6 text-sm text-cream/60 ${
          visible ? "animate-fade-in-up" : "opacity-0"
        }`}
        style={{ animationDelay: visible ? "420ms" : undefined }}
      >
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold">
          <PhoneIcon className="h-4 w-4" /> {phone}
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-gold"
        >
          <InstagramIcon className="h-4 w-4" /> {instagram}
        </a>
      </div>
    </div>
  );
}
