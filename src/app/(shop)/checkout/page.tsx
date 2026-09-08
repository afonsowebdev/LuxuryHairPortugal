"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdminData } from "@/context/AdminDataContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { Button } from "@/components/ui/Button";
import { CheckIcon, LockIcon, PhoneIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { formatEUR } from "@/lib/format";
import { savePendingOrder, getPendingOrder } from "@/lib/orderStore";
import type { ApiOrder } from "@/lib/mappers/order";
import { getCustomerToken } from "@/context/CustomerAuthContext";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import type { Order } from "@/types";

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
}

interface CheckoutResponse {
  order: ApiOrder;
  payment: { entidade: string; referencia: string; valor: number; expiraEm: string; simulado: boolean };
}

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

interface AppliedCoupon {
  code: string;
  desconto: number;
}

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const { settings: storeSettings, refreshProducts } = useAdminData();
  const { customer, hydrated: authHydrated } = useCustomerAuth();
  const { orders, hydrated: ordersHydrated } = useCustomerOrders();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  // Once the customer's account and their order history are both hydrated,
  // pre-fill the form with their account details and their most recent
  // shipping address, so a returning customer doesn't have to retype
  // everything. Guests (no session) see the form untouched.
  useEffect(() => {
    if (!authHydrated || !ordersHydrated || !customer) return;
    const email = customer.email.toLowerCase();
    const lastOrder = orders
      .filter((o) => o.customer.email.toLowerCase() === email)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({
      ...f,
      name: f.name || customer.name,
      email: f.email || customer.email,
      phone: f.phone || lastOrder?.customer.phone || "",
      address: f.address || lastOrder?.customer.address || "",
      city: f.city || lastOrder?.customer.city || "",
      postalCode: f.postalCode || lastOrder?.customer.postalCode || "",
      country: lastOrder?.customer.country || f.country,
    }));
  }, [authHydrated, ordersHydrated, customer, orders]);
  const [payment, setPayment] = useState<"Multibanco" | "MB WAY" | "Cartão">("Multibanco");
  const [submitting, setSubmitting] = useState(false);
  const [mbwayPhone, setMbwayPhone] = useState("");
  const [mbwayError, setMbwayError] = useState<string | null>(null);
  const [mbwayPending, setMbwayPending] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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

  const discount = appliedCoupon?.desconto ?? 0;

  const total = subtotal + shipping - discount;
  const shippingLabel = form.country;

  async function handleApplyCoupon() {
    setCouponError(null);
    const code = couponInput.trim();
    if (!code) return;

    setApplyingCoupon(true);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: code, subtotal }),
    });
    const json = (await res.json()) as ApiEnvelope<{ codigo: string; desconto: number }>;
    setApplyingCoupon(false);

    if (!json.success || !json.data) {
      setCouponError(json.message || "Cupão inválido.");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code: json.data.codigo, desconto: json.data.desconto });
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

  async function submitOrder(): Promise<{ orderId: string; simulado: boolean } | { error: string }> {
    const token = getCustomerToken();
    const res = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        nomeCliente: form.name,
        email: form.email,
        telefone: form.phone,
        morada: form.address,
        cidade: form.city,
        codigoPostal: form.postalCode,
        pais: form.country,
        codigoCupao: appliedCoupon?.code,
        envio: shipping,
        metodo: payment === "MB WAY" ? "mbway" : "multibanco",
        mbwayTelemovel: payment === "MB WAY" ? mbwayPhone : undefined,
      }),
    });
    const json = (await res.json()) as ApiEnvelope<CheckoutResponse>;
    if (!json.success || !json.data) return { error: json.message || "Não foi possível criar a encomenda." };

    const { order: apiOrder, payment: apiPayment } = json.data;
    const order: Order = {
      id: apiOrder.id,
      reference: apiPayment.referencia,
      entity: apiPayment.entidade,
      customer: {
        name: apiOrder.nomeCliente,
        email: apiOrder.email,
        phone: apiOrder.telefone,
        address: apiOrder.morada,
        city: apiOrder.cidade,
        postalCode: apiOrder.codigoPostal,
        country: apiOrder.pais,
      },
      items: apiOrder.items.map((i) => ({
        productId: i.productId,
        name: i.nomeProduto,
        image: i.nomeProduto,
        variant: i.variante || "Padrão",
        quantity: i.quantidade,
        price: i.precoUnitario,
      })),
      subtotal: apiOrder.subtotal,
      shipping: apiOrder.envio,
      couponCode: appliedCoupon?.code,
      discount: apiOrder.desconto > 0 ? apiOrder.desconto : undefined,
      total: apiOrder.total,
      status: "A aguardar pagamento",
      paymentMethod: payment,
      createdAt: apiOrder.createdAt,
    };

    savePendingOrder(order);
    return { orderId: order.id, simulado: apiPayment.simulado };
  }

  async function pollMbwayPayment(orderId: string): Promise<boolean> {
    const MAX_ATTEMPTS = 90; // ~4.5 min a cada 3s — a app MB WAY expira o pedido ao fim de ~4 min
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => window.setTimeout(resolve, 3000));
      const res = await fetch(`/api/payment/status?orderId=${orderId}`);
      const json = (await res.json()) as ApiEnvelope<{ estado: string }>;
      if (json.success && json.data?.estado === "PAGO") return true;
    }
    return false;
  }

  function handlePlaceOrder() {
    if (payment === "MB WAY") {
      const digits = mbwayPhone.replace(/\s/g, "");
      if (!/^9\d{8}$/.test(digits)) {
        setMbwayError("Introduza um número de telemóvel válido (9 dígitos).");
        return;
      }
      setMbwayError(null);
      setSubmitting(true);
      setMbwayPending(true);

      submitOrder().then(async (result) => {
        if ("error" in result) {
          setMbwayPending(false);
          setSubmitting(false);
          setOrderError(result.error);
          return;
        }

        let paid: boolean;
        if (result.simulado) {
          // Sem credenciais MB WAY reais configuradas — simula a aprovação
          // na app ao fim de alguns segundos, como até aqui.
          await new Promise((resolve) => window.setTimeout(resolve, 2600));
          await fetch("/api/payment/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: result.orderId }),
          });
          paid = true;
        } else {
          // Pedido real enviado à app MB WAY — espera pela aprovação do
          // cliente (via callback da ifthenpay a confirmar o pagamento).
          paid = await pollMbwayPayment(result.orderId);
        }

        if (paid) {
          const pending = getPendingOrder(result.orderId);
          if (pending) savePendingOrder({ ...pending, status: "Pago" });
        }

        clearCart();
        refreshProducts();
        router.push(`/encomenda-recebida/${result.orderId}`);
      });
      return;
    }

    setOrderError(null);
    setSubmitting(true);
    submitOrder().then((result) => {
      if ("error" in result) {
        setSubmitting(false);
        setOrderError(result.error);
        return;
      }
      clearCart();
      refreshProducts();
      router.push(`/encomenda-recebida/${result.orderId}`);
    });
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

  if (authHydrated && !customer) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
          <LockIcon className="h-6 w-6" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark">
          Inicie sessão para continuar
        </h1>
        <p className="max-w-sm text-sm text-plum-dark/60">
          Para finalizar a compra e acompanhar a sua encomenda, é necessário ter sessão iniciada.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="/conta/entrar?redirect=/checkout" variant="primary" size="lg">
            Entrar
          </Button>
          <Button href="/conta/criar?redirect=/checkout" variant="secondary" size="lg">
            Criar Conta
          </Button>
        </div>
        <Link href="/carrinho" className="mt-2 text-xs text-plum-dark/50 underline hover:text-gold">
          ← Voltar ao carrinho
        </Link>
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
                      {formatEUR(appliedCoupon.desconto)} de desconto aplicado
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                  >
                    {applyingCoupon ? "A validar..." : "Aplicar"}
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

              <div
                className={`rounded-2xl border-2 transition-colors ${
                  payment === "MB WAY" ? "border-gold bg-gold/10" : "border-plum/15"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPayment("MB WAY");
                    setMbwayError(null);
                    if (!mbwayPhone) setMbwayPhone(form.phone.replace(/\s/g, ""));
                  }}
                  disabled={mbwayPending}
                  className="flex w-full flex-col gap-2 p-5 text-left cursor-pointer disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold text-plum-dark">MB WAY</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        payment === "MB WAY" ? "border-gold bg-gold" : "border-plum/30"
                      }`}
                    >
                      {payment === "MB WAY" && <CheckIcon className="h-3 w-3 text-plum-dark" />}
                    </span>
                  </div>
                  <p className="text-sm text-plum-dark/60">
                    Receberá um pedido de pagamento na app MB WAY para aprovar com o telemóvel.
                  </p>
                </button>

                {payment === "MB WAY" && (
                  <div className="border-t border-plum/10 px-5 pb-5 pt-4">
                    {mbwayPending ? (
                      <div className="flex items-center gap-3 text-sm text-plum-dark/70">
                        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                        A aguardar confirmação na app MB WAY (
                        {mbwayPhone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")})...
                      </div>
                    ) : (
                      <label className="flex flex-col gap-1.5 text-sm">
                        <span className="text-xs font-medium text-plum-dark/70">
                          Número de telemóvel MB WAY
                        </span>
                        <div className="relative max-w-xs">
                          <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-dark/40" />
                          <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="9XX XXX XXX"
                            maxLength={9}
                            value={mbwayPhone}
                            onChange={(e) => setMbwayPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                            className="input pl-11"
                          />
                        </div>
                        {mbwayError && <p className="text-xs text-bordeaux">{mbwayError}</p>}
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div
                className="flex cursor-not-allowed items-center justify-between rounded-2xl border-2 border-plum/10 p-5 opacity-50"
              >
                <span className="font-serif text-lg font-semibold text-plum-dark">Cartão</span>
                <span className="rounded-full bg-plum-dark/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-plum-dark/60">
                  Brevemente
                </span>
              </div>

              {orderError && (
                <p role="alert" className="rounded-lg border border-bordeaux/30 bg-bordeaux/10 px-4 py-2.5 text-sm text-bordeaux">
                  {orderError}
                </p>
              )}

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button variant="ghost" size="md" onClick={() => setStep(1)} disabled={mbwayPending}>
                  ← Voltar
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {mbwayPending
                    ? "A aguardar aprovação..."
                    : submitting
                      ? "A processar..."
                      : `Confirmar Encomenda · ${formatEUR(total)}`}
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
          <div className="sticky top-[calc(var(--header-height,6rem)+1rem)]">
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
