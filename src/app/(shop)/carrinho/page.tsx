"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { TrashIcon, MinusIcon, PlusIcon, BagIcon, ArrowRightIcon, LockIcon, TruckIcon } from "@/components/ui/icons";
import { CartIcon } from "@/components/ui/CartIcon";
import { formatEUR } from "@/lib/format";
import { useAdminData } from "@/context/AdminDataContext";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal } = useCart();
  const { getProductBySlug, categories, settings: storeSettings } = useAdminData();

  const freeShippingThreshold = storeSettings.shipping.freeShippingThreshold;

  const shipping = useMemo(() => {
    if (lines.length === 0) return 0;
    if (subtotal >= freeShippingThreshold) return 0;
    return storeSettings.shipping.portugalContinental.price;
  }, [subtotal, lines.length, storeSettings, freeShippingThreshold]);

  const total = subtotal + shipping;
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
  const freeShippingProgress = Math.min(subtotal / freeShippingThreshold, 1) * 100;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold">
          <CartIcon className="h-9 w-9" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          O seu carrinho está vazio
        </h1>
        <p className="text-sm text-plum-dark/60">
          Explore a nossa coleção e descubra a sua próxima peça de luxo.
        </p>
        <Button href="/loja" variant="primary" size="lg" className="mt-2">
          <BagIcon className="h-4 w-4" />
          Ir para a Loja
        </Button>

        {categories.length > 0 && (
          <div className="mt-10 w-full border-t border-plum/10 pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-plum-dark/40">
              Ou explore por coleção
            </p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/loja/${c.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-plum/10 bg-white px-4 py-3 text-sm font-medium text-plum-dark shadow-sm transition-colors hover:border-gold hover:bg-gold/5"
                >
                  {c.name}
                  <ArrowRightIcon className="h-4 w-4 text-plum-dark/30 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">
          Carrinho de Compras
        </h1>
        <span className="mb-1 text-sm text-plum-dark/50">
          {itemCount} {itemCount === 1 ? "artigo" : "artigos"}
        </span>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-4">
          {lines.map((line) => {
            const product = getProductBySlug(line.slug);
            const unitSavings =
              product?.compareAtPrice && product.compareAtPrice > line.price
                ? product.compareAtPrice - line.price
                : 0;
            return (
              <div
                key={`${line.productId}-${line.variant}`}
                className="flex gap-4 rounded-2xl border border-plum/10 bg-white p-4 shadow-sm sm:p-5"
              >
                <Link
                  href={`/loja/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-plum-dark/5"
                >
                  <ProductImage
                    seed={line.slug}
                    category={product?.category}
                    src={product?.photos?.[0]}
                    alt={line.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        href={`/loja/${line.slug}`}
                        className="font-serif text-base font-semibold text-plum-dark hover:text-bordeaux"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-xs text-plum-dark/50">{line.variant}</p>
                      {unitSavings > 0 && (
                        <span className="mt-1.5 inline-flex w-fit items-center rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
                          Poupa {formatEUR(unitSavings * line.quantity)}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="whitespace-nowrap font-serif font-semibold text-bordeaux">
                        {formatEUR(line.price * line.quantity)}
                      </p>
                      {unitSavings > 0 && (
                        <p className="whitespace-nowrap text-xs text-plum-dark/35 line-through">
                          {formatEUR((line.price + unitSavings) * line.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-plum/15">
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-plum-dark transition-colors hover:bg-plum-dark/5 disabled:opacity-30 cursor-pointer"
                        disabled={line.quantity <= 1}
                        aria-label="Diminuir quantidade"
                      >
                        <MinusIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-plum-dark">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-plum-dark transition-colors hover:bg-plum-dark/5 disabled:opacity-30 cursor-pointer"
                        disabled={line.quantity >= line.stock}
                        aria-label="Aumentar quantidade"
                      >
                        <PlusIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(line.productId, line.variant)}
                      className="flex items-center gap-1.5 text-xs text-plum-dark/50 hover:text-bordeaux cursor-pointer"
                      aria-label={`Remover ${line.name} do carrinho`}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-[calc(var(--header-height,6rem)+1rem)] flex flex-col gap-5 rounded-2xl border border-plum/10 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-plum-dark">Resumo do Pedido</h2>

            {shipping > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-plum-dark/60">
                  Faltam <span className="font-semibold text-bordeaux">{formatEUR(remainingForFreeShipping)}</span> para
                  envio grátis
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-plum-dark/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-gold/10 px-3 py-2 text-xs font-semibold text-gold-dark">
                <TruckIcon className="h-4 w-4" />
                Parabéns, tem envio grátis!
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-plum/10 pt-4">
              <div className="flex justify-between text-sm text-plum-dark/70">
                <span>Subtotal</span>
                <span>{formatEUR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-plum-dark/70">
                <span>Portes de Envio</span>
                <span>{shipping === 0 ? "Grátis" : formatEUR(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-plum/10 pt-4 font-serif text-lg font-semibold text-plum-dark">
              <span>Total</span>
              <span className="text-bordeaux">{formatEUR(total)}</span>
            </div>

            <Button href="/checkout" variant="primary" size="lg" className="w-full">
              <LockIcon className="h-4 w-4" />
              Finalizar Compra
            </Button>
            <Button href="/loja" variant="ghost" size="sm" className="w-full">
              Continuar a Comprar
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-plum-dark/40">
              <LockIcon className="h-3 w-3 shrink-0" />
              Pagamento seguro via Multibanco, MB WAY ou Cartão
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
