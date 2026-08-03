import Link from "next/link";
import { ScissorsIcon } from "./ScissorsIcon";

interface LogoProps {
  variant?: "gold" | "plum";
  className?: string;
  href?: string;
}

const sizes = {
  gold: {
    script: "text-gold",
    text: "text-gold",
    sub: "text-gold-light/80",
  },
  plum: {
    script: "text-plum",
    text: "text-plum",
    sub: "text-plum-light/80",
  },
};

export function Logo({ variant = "gold", className = "", href = "/" }: LogoProps) {
  const c = sizes[variant];

  const content = (
    <span
      className={`inline-flex flex-col items-center leading-none select-none ${className}`}
    >
      <span className="flex items-center gap-2">
        <ScissorsIcon className={`h-5 w-5 shrink-0 ${c.text}`} />
        <span
          className={`font-script text-4xl sm:text-5xl ${c.script}`}
          style={{ lineHeight: 1 }}
        >
          luxury
        </span>
      </span>
      <span
        className={`font-serif font-bold text-lg sm:text-xl tracking-[0.35em] ${c.text} -mt-1`}
      >
        HAIR
      </span>
      <span
        className={`font-sans text-[10px] sm:text-xs tracking-[0.55em] ${c.sub} mt-0.5`}
      >
        PORTUGAL
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="Luxury Hair Portugal — página inicial" className="inline-block">
      {content}
    </Link>
  );
}
