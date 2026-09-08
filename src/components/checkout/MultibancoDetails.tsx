"use client";

import { useState } from "react";
import { formatEUR } from "@/lib/format";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";
import { useAdminData } from "@/context/AdminDataContext";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore silently in prototype
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-cream/60 px-4 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-plum-dark/50">
          {label}
        </p>
        <p className="font-serif text-lg font-semibold text-plum-dark">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full bg-plum px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-plum-light cursor-pointer"
        aria-label={`Copiar ${label}`}
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export function MultibancoDetails({
  entity,
  reference,
  amount,
}: {
  entity: string;
  reference: string;
  amount: number;
}) {
  const { settings: storeSettings } = useAdminData();
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-gold/40 bg-gold/10 p-6">
      <h3 className="font-serif text-lg font-semibold text-plum-dark">Dados para Pagamento</h3>
      <CopyField label="Entidade" value={entity} />
      <CopyField label="Referência" value={reference} />
      <CopyField label="Valor" value={formatEUR(amount)} />
      <p className="mt-1 text-xs text-plum-dark/60">
        Esta referência é válida por {storeSettings.payments.referenceValidityHours} horas. Após
        o pagamento, a sua encomenda será processada e enviada em 24-48h.
      </p>
    </div>
  );
}
