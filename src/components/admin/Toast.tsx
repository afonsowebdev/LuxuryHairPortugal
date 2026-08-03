"use client";

import { CheckIcon } from "@/components/ui/icons";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-plum-dark px-5 py-3 text-sm font-medium text-cream shadow-xl animate-fade-in-up">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-plum-dark">
        <CheckIcon className="h-3 w-3" />
      </span>
      {message}
    </div>
  );
}
