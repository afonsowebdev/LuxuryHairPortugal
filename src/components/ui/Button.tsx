import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-plum-dark hover:bg-gold-light shadow-sm shadow-gold/20 disabled:bg-gold/40",
  secondary:
    "bg-transparent border border-gold text-gold hover:bg-gold hover:text-plum-dark disabled:opacity-40",
  ghost: "bg-transparent text-plum hover:bg-plum/5 disabled:opacity-40",
  "outline-light":
    "bg-transparent border border-cream/50 text-cream hover:bg-cream hover:text-plum disabled:opacity-40",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-[0.18em] transition-all duration-300 rounded-full disabled:cursor-not-allowed cursor-pointer";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
