import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

/**
 * Wrapper sobre <select> nativo: remove a seta do browser (appearance-none),
 * que fica desalinhada e inconsistente entre navegadores/SO, e desenha o
 * chevron da própria biblioteca de ícones do site, sempre bem centrado.
 * O padding-right é forçado por inline style (em vez de uma classe
 * Tailwind) para nunca ser acidentalmente sobreposto pela className
 * passada pelo chamador, garantindo que o texto nunca fica por baixo do ícone.
 */
export function Select({
  className = "",
  wrapperClassName = "",
  style,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        {...props}
        className={`w-full cursor-pointer appearance-none ${className}`}
        style={{ paddingRight: "2.25rem", ...style }}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/50" />
    </div>
  );
}
