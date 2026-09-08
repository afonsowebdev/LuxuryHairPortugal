"use client";

import { useState } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";
import type { StoreSettings } from "@/lib/data/settings";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminData();
  const { message, showToast } = useToast();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [dirty, setDirty] = useState(false);

  // Re-sync the draft once the real (localStorage-hydrated) settings arrive,
  // as long as the admin hasn't started editing yet.
  if (!dirty && draft !== settings) {
    setDraft(settings);
  }

  function set(updater: (s: StoreSettings) => StoreSettings) {
    setDirty(true);
    setDraft(updater);
  }

  function handleSave() {
    updateSettings(draft);
    setDirty(false);
    showToast("Definições guardadas com sucesso.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Definições da Loja
        </h1>
        <p className="text-sm text-plum-dark/50">
          Estas definições alimentam a loja em tempo real (cabeçalho, rodapé, portes, pagamento).
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Marca</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome da Loja">
            <input
              value={draft.brand.name}
              onChange={(e) => set((s) => ({ ...s, brand: { ...s.brand, name: e.target.value } }))}
              className="input"
            />
          </Field>
          <Field label="Email">
            <input
              value={draft.brand.email}
              onChange={(e) => set((s) => ({ ...s, brand: { ...s.brand, email: e.target.value } }))}
              className="input"
            />
          </Field>
          <Field label="Instagram">
            <input
              value={draft.brand.instagram}
              onChange={(e) =>
                set((s) => ({ ...s, brand: { ...s.brand, instagram: e.target.value } }))
              }
              className="input"
            />
          </Field>
          <Field label="URL do Instagram">
            <input
              value={draft.brand.instagramUrl}
              onChange={(e) =>
                set((s) => ({ ...s, brand: { ...s.brand, instagramUrl: e.target.value } }))
              }
              className="input"
            />
          </Field>
          <Field label="Telefone Principal">
            <input
              value={draft.brand.phones[0]}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  brand: { ...s.brand, phones: [e.target.value, s.brand.phones[1]] },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Telefone Secundário">
            <input
              value={draft.brand.phones[1]}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  brand: { ...s.brand, phones: [s.brand.phones[0], e.target.value] },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <input
              value={draft.brand.tagline}
              onChange={(e) =>
                set((s) => ({ ...s, brand: { ...s.brand, tagline: e.target.value } }))
              }
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Envio</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Portugal Continental (€)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.shipping.portugalContinental.price}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  shipping: {
                    ...s.shipping,
                    portugalContinental: {
                      ...s.shipping.portugalContinental,
                      price: Number(e.target.value),
                    },
                  },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Açores & Madeira (€)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.shipping.portugalIlhas.price}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  shipping: {
                    ...s.shipping,
                    portugalIlhas: { ...s.shipping.portugalIlhas, price: Number(e.target.value) },
                  },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Moçambique (€)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.shipping.mocambique.price}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  shipping: {
                    ...s.shipping,
                    mocambique: { ...s.shipping.mocambique, price: Number(e.target.value) },
                  },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Envio Grátis a Partir de (€)">
            <input
              type="number"
              min={0}
              value={draft.shipping.freeShippingThreshold}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  shipping: { ...s.shipping, freeShippingThreshold: Number(e.target.value) },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Transportadora">
            <input
              value={draft.shipping.carrier}
              onChange={(e) =>
                set((s) => ({ ...s, shipping: { ...s.shipping, carrier: e.target.value } }))
              }
              className="input"
            />
          </Field>
          <Field label="Telefone para Devoluções">
            <input
              value={draft.shipping.returnsPhone}
              onChange={(e) =>
                set((s) => ({ ...s, shipping: { ...s.shipping, returnsPhone: e.target.value } }))
              }
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Pagamentos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Entidade Multibanco">
            <input
              value={draft.payments.multibancoEntity}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  payments: { ...s.payments, multibancoEntity: e.target.value },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Validade da Referência (horas)">
            <input
              type="number"
              min={1}
              value={draft.payments.referenceValidityHours}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  payments: { ...s.payments, referenceValidityHours: Number(e.target.value) },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Métodos de pagamento (separados por vírgula)" className="sm:col-span-2">
            <input
              value={draft.payments.methods.join(", ")}
              onChange={(e) =>
                set((s) => ({
                  ...s,
                  payments: {
                    ...s.payments,
                    methods: e.target.value
                      .split(",")
                      .map((m) => m.trim())
                      .filter(Boolean),
                  },
                }))
              }
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {dirty && <p className="self-center text-xs text-bordeaux">Alterações por guardar</p>}
        <Button onClick={handleSave} variant="primary" size="md" disabled={!dirty}>
          Guardar Definições
        </Button>
      </div>
      <Toast message={message} />
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="text-xs font-medium text-plum-dark/70">{label}</span>
      {children}
    </label>
  );
}
