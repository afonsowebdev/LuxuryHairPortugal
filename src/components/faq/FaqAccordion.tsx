"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col divide-y divide-plum/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg font-semibold text-plum-dark">
                {item.question}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-gold-dark transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-sm leading-relaxed text-plum-dark/70">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
