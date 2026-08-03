"use client";

import { useEffect, useState } from "react";
import { storeSettings as defaultSettings } from "@/lib/data/settings";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/admin/Toast";
import { useToast } from "@/hooks/useToast";

const STORAGE_KEY = "lhp_admin_settings";

export default function AdminSettingsPage() {
  const { message, showToast } = useToast();
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    // localStorage is unavailable during SSR, so settings can only be
    // hydrated client-side after mount.
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(JSON.parse(raw));
      } catch {
        // ignore corrupted storage
      }
    }
  }, []);

  function handleSave() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    showToast("Definições guardadas com sucesso.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Definições da Loja
        </h1>
        <p className="text-sm text-plum-dark/50">
          Estas definições alimentam o front-end da loja (protótipo local).
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Marca</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome da Loja">
            <input
              value={settings.brand.name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, name: e.target.value } }))
              }
              className="input"
            />
          </Field>
          <Field label="Instagram">
            <input
              value={settings.brand.instagram}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, instagram: e.target.value } }))
              }
              className="input"
            />
          </Field>
          <Field label="Telefone Principal">
            <input
              value={settings.brand.phones[0]}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  brand: { ...s.brand, phones: [e.target.value, s.brand.phones[1]] },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Telefone Secundário">
            <input
              value={settings.brand.phones[1]}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  brand: { ...s.brand, phones: [s.brand.phones[0], e.target.value] },
                }))
              }
              className="input"
            />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <input
              value={settings.brand.tagline}
              onChange={(e) =>
                setSettings((s) => ({ ...s, brand: { ...s.brand, tagline: e.target.value } }))
              }
              className="input"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-plum/10">
        <h2 className="font-serif text-lg font-semibold text-plum-dark">Portes de Envio (€)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Portugal Continental">
            <input
              type="number"
              min={0}
              value={settings.shipping.portugalContinental.price}
              onChange={(e) =>
                setSettings((s) => ({
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
          <Field label="Açores & Madeira">
            <input
              type="number"
              min={0}
              value={settings.shipping.portugalIlhas.price}
              onChange={(e) =>
                setSettings((s) => ({
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
          <Field label="Moçambique">
            <input
              type="number"
              min={0}
              value={settings.shipping.mocambique.price}
              onChange={(e) =>
                setSettings((s) => ({
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
          <Field label="Envio Grátis a Partir de (€)" className="sm:col-span-3">
            <input
              type="number"
              min={0}
              value={settings.shipping.freeShippingThreshold}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  shipping: { ...s.shipping, freeShippingThreshold: Number(e.target.value) },
                }))
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
              value={settings.payments.multibancoEntity}
              onChange={(e) =>
                setSettings((s) => ({
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
              value={settings.payments.referenceValidityHours}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  payments: { ...s.payments, referenceValidityHours: Number(e.target.value) },
                }))
              }
              className="input"
            />
          </Field>
        </div>
        <p className="text-xs text-plum-dark/40">
          Métodos de pagamento disponíveis: {settings.payments.methods.join(", ")}.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} variant="primary" size="md">
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
