"use client";

import { useState, type ComponentType, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export function AuthField({ label, icon: Icon, type, className = "", ...props }: AuthFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/60">
        {label}
      </span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50" />
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          {...props}
          className={`w-full rounded-md border border-cream/25 bg-cream/10 py-3 pl-11 text-sm text-cream outline-none backdrop-blur-sm transition-colors placeholder:text-cream/40 focus:border-gold focus:bg-cream/20 focus:ring-2 focus:ring-gold/20 ${
            isPassword ? "pr-11" : "pr-4"
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/50 transition-colors hover:text-cream cursor-pointer"
            aria-label={show ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          >
            {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );
}
