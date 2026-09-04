"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdminData } from "@/context/AdminDataContext";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { formatEUR } from "@/lib/format";
import { generateMultibancoPayment, generateOrderId } from "@/lib/multibanco";
import { savePendingOrder } from "@/lib/orderStore";
import type { Coupon, Order } from "@/types";

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
  country: "Portugal Continental",
  notes: "",
};

function validateCoupon(coupon: Coupon, subtotal: number): string | null {
  if (!coupon.active) return "Este cupão já não está ativo.";
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now())
    return "Este cupão expirou.";
  if (typeof coupon.usageLimit === "number" && coupon.usageCount >= coupon.usageLimit)
    return "Este cupão atingiu o limite de utilizações.";
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue)
    return `Válido a partir de ${formatEUR(coupon.minOrderValue)} em compras.`;
  return null;
}

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const { placeOrder, settings: storeSettings, getCouponByCode } = useAdminData();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [payment, setPayment] = useState<"Multibanco" | "MB WAY" | "Cartão">("Multibanco");
  const [submitting, setSubmitting] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const countryOptions = useMemo(
    () => [
      {
        value: "Portugal Continental",
        price: storeSettings.shipping.portugalContinental.price,
        etaDays: storeSettings.shipping.portugalContinental.etaDays,
      },
      {
        value: "Açores & Madeira",
        price: storeSettings.shipping.portugalIlhas.price,
        etaDays: storeSettings.shipping.portugalIlhas.etaDays,
      },
      {
        value: "Moçambique",
        price: storeSettings.shipping.mocambique.price,
        etaDays: storeSettings.shipping.mocambique.etaDays,
      },
    ],
    [storeSettings]
  );

  const shipping = useMemo(() => {
    if (subtotal >= storeSettings.shipping.freeShippingThreshold) return 0;
    return countryOptions.find((c) => c.value === form.country)?.price ?? 0;
  }, [form.country, subtotal, storeSettings, countryOptions]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const raw =
      appliedCoupon.type === "percentagem"
        ? (subtotal * appliedCoupon.value) / 100
        : appliedCoupon.value;
    return Math.min(raw, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal + shipping - discount;
  const shippingLabel = form.country;

  function handleApplyCoupon() {
    setCouponError(null);
    if (!couponInput.trim()) return;
    const coupon = getCouponByCode(couponInput);
    if (!coupon) {
      setCouponError("Cupão inválido.");
      setAppliedCoupon(null);
      return;
    }
    const error = validateCoupon(coupon, subtotal);
    if (error) {
      setCouponError(error);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(coupon);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

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
    const mb = generateMultibancoPayment(orderId, total, storeSettings);

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
      couponCode: appliedCoupon?.code,
      discount: discount > 0 ? discount : undefined,
      total,
      status: "A aguardar pagamento",
      paymentMethod: "Multibanco",
      createdAt: new Date().toISOString(),
    };

    savePendingOrder(order);
    placeOrder(order);
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
                  <Select
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="input"
                  >
                    {countryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.value} · {c.etaDays === "1" ? "24h" : `${c.etaDays} dias úteis`}
                      </option>
                    ))}
                  </Select>
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

              <h2 className="mt-2 font-serif text-xl font-semibold text-plum-dark">
                Código de Desconto
              </h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-plum-dark">{appliedCoupon.code}</p>
                    <p className="text-xs text-plum-dark/60">
                      {appliedCoupon.type === "percentagem"
                        ? `${appliedCoupon.value}% de desconto`
                        : `${formatEUR(appliedCoupon.value)} de desconto`}{" "}
                      aplicado
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold uppercase tracking-wide text-bordeaux hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Ex: BEMVINDA10"
                      className="input w-full uppercase"
                    />
                    {couponError && <p className="mt-1.5 text-xs text-bordeaux">{couponError}</p>}
                  </div>
                  <Button type="button" variant="secondary" size="md" onClick={handleApplyCoupon}>
                    Aplicar
                  </Button>
                </div>
              )}

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
                  {submitting ? "A processar..." : `Confirmar Encomenda · ${formatEUR(total)}`}
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
              discount={discount}
              couponCode={appliedCoupon?.code}
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
