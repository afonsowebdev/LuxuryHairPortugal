"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { formatEUR } from "@/lib/format";
import { storeSettings } from "@/lib/data/settings";
import { generateMultibancoPayment, generateOrderId } from "@/lib/multibanco";
import { savePendingOrder } from "@/lib/orderStore";
import type { Order } from "@/types";

const countryOptions = [
  { value: "Portugal Continental", price: storeSettings.shipping.portugalContinental.price },
  { value: "Açores & Madeira", price: storeSettings.shipping.portugalIlhas.price },
  { value: "Moçambique", price: storeSettings.shipping.mocambique.price },
];

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: countryOptions[0].value,
  notes: "",
};

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [payment, setPayment] = useState<"Multibanco" | "MB WAY" | "Cartão">("Multibanco");
  const [submitting, setSubmitting] = useState(false);

  const shipping = useMemo(() => {
    if (subtotal >= storeSettings.shipping.freeShippingThreshold) return 0;
    return countryOptions.find((c) => c.value === form.country)?.price ?? 0;
  }, [form.country, subtotal]);

  const shippingLabel = form.country;

  function updateField<K extends keyof CustomerForm>(key: K, value: CustomerForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePlaceOrder() {
    setSubmitting(true);
    const orderId = generateOrderId();
    const total = subtotal + shipping;
    const mb = generateMultibancoPayment(orderId, total);

    const order: Order = {
      id: orderId,
      reference: mb.reference,
      entity: mb.entity,
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        image: l.slug,
        variant: l.variant,
        quantity: l.quantity,
        price: l.price,
      })),
      subtotal,
      shipping,
      total,
      status: "A aguardar pagamento",
      paymentMethod: "Multibanco",
      createdAt: new Date().toISOString(),
    };

    savePendingOrder(order);
    clearCart();
    router.push(`/encomenda-recebida/${orderId}`);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold text-plum-dark">
          O seu carrinho está vazio
        </h1>
        <p className="text-sm text-plum-dark/60">
          Adicione produtos ao carrinho antes de finalizar a compra.
        </p>
        <Button href="/loja" variant="primary" size="lg">
          Ir para a Loja
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">
        Finalizar Compra
      </h1>

      <ol className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-plum-dark/50">
        <li className={`flex items-center gap-2 ${step === 1 ? "text-plum-dark" : ""}`}>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              step > 1 ? "bg-gold text-plum-dark" : "bg-plum-dark/10"
            }`}
          >
            {step > 1 ? <CheckIcon className="h-3.5 w-3.5" /> : "1"}
          </span>
          Dados &amp; Envio
        </li>
        <li className="h-px w-8 bg-plum/20" />
        <li className={`flex items-center gap-2 ${step === 2 ? "text-plum-dark" : ""}`}>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              step === 2 ? "bg-gold text-plum-dark" : "bg-plum-dark/10"
            }`}
          >
            2
          </span>
          Pagamento
        </li>
      </ol>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex-1">
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="flex flex-col gap-5">
              <h2 className="font-serif text-xl font-semibold text-plum-dark">
                Dados do Cliente
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nome completo" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Telefone" required>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="País / Destino" required>
                  <select
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="input"
                  >
                    {countryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.value}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <h2 className="mt-2 font-serif text-xl font-semibold text-plum-dark">
                Morada de Envio
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Morada" required className="sm:col-span-2">
                  <input
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Cidade" required>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Código Postal" required>
                  <input
                    required
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Notas de encomenda (opcional)" className="sm:col-span-2">
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={3}
                    className="input resize-none"
                  />
                </Field>
              </div>

              <Button type="submit" variant="primary" size="lg" className="mt-2 sm:w-fit sm:self-end">
                Continuar para Pagamento
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-serif text-xl font-semibold text-plum-dark">
                Método de Pagamento
              </h2>

              <button
                type="button"
                onClick={() => setPayment("Multibanco")}
                className={`flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-colors cursor-pointer ${
                  payment === "Multibanco" ? "border-gold bg-gold/10" : "border-plum/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-serif text-lg font-semibold text-plum-dark">
                    Multibanco
                    <span className="rounded-full bg-bordeaux px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream">
                      Recomendado
                    </span>
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      payment === "Multibanco" ? "border-gold bg-gold" : "border-plum/30"
                    }`}
                  >
                    {payment === "Multibanco" && <CheckIcon className="h-3 w-3 text-plum-dark" />}
                  </span>
                </div>
                <p className="text-sm text-plum-dark/60">
                  Após confirmar, receberá uma Entidade e Referência para pagar em qualquer
                  caixa Multibanco, homebanking ou MB WAY, com{" "}
                  {storeSettings.payments.referenceValidityHours}h de validade.
                </p>
              </button>

              {(["MB WAY", "Cartão"] as const).map((method) => (
                <div
                  key={method}
                  className="flex cursor-not-allowed items-center justify-between rounded-2xl border-2 border-plum/10 p-5 opacity-50"
                >
                  <span className="font-serif text-lg font-semibold text-plum-dark">{method}</span>
                  <span className="rounded-full bg-plum-dark/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-plum-dark/60">
                    Brevemente
                  </span>
                </div>
              ))}

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  ← Voltar
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? "A processar..." : `Confirmar Encomenda · ${formatEUR(subtotal + shipping)}`}
                </Button>
              </div>
              <p className="text-center text-xs text-plum-dark/40">
                Ao confirmar, aceita os nossos{" "}
                <Link href="/termos-e-condicoes" className="underline hover:text-gold">
                  Termos &amp; Condições
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-96">
          <div className="sticky top-24">
            <CheckoutSummary
              lines={lines}
              subtotal={subtotal}
              shipping={shipping}
              shippingLabel={shippingLabel}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="text-xs font-medium text-plum-dark/70">
        {label}
        {required && <span className="text-bordeaux"> *</span>}
      </span>
      {children}
    </label>
  );
}
