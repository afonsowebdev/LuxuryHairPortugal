"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@/components/ui/icons";
import { CartIcon } from "@/components/ui/CartIcon";
import { formatEUR } from "@/lib/format";
import { getProductBySlug } from "@/lib/data/products";
import { storeSettings } from "@/lib/data/settings";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal } = useCart();

  const shipping = useMemo(() => {
    if (lines.length === 0) return 0;
    if (subtotal >= storeSettings.shipping.freeShippingThreshold) return 0;
    return storeSettings.shipping.portugalContinental.price;
  }, [subtotal, lines.length]);

  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <CartIcon className="h-14 w-14 text-plum/30" />
        <h1 className="font-serif text-2xl font-semibold text-plum-dark">
          O seu carrinho está vazio
        </h1>
        <p className="text-sm text-plum-dark/60">
          Explore a nossa coleção e descubra a sua próxima peça de luxo.
        </p>
        <Button href="/loja" variant="primary" size="lg" className="mt-2">
          Ir para a Loja
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 font-serif text-3xl font-semibold text-plum-dark sm:text-4xl">
        Carrinho de Compras
      </h1>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex-1 divide-y divide-plum/10">
          {lines.map((line) => {
            const product = getProductBySlug(line.slug);
            return (
              <div key={`${line.productId}-${line.variant}`} className="flex gap-4 py-6">
                <Link
                  href={`/loja/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <ProductImage
                    seed={line.slug}
                    category={product?.category}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        href={`/loja/${line.slug}`}
                        className="font-serif text-base font-semibold text-plum-dark hover:text-bordeaux"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-xs text-plum-dark/50">{line.variant}</p>
                    </div>
                    <p className="whitespace-nowrap font-serif font-semibold text-bordeaux">
                      {formatEUR(line.price * line.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-plum/20">
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity - 1)}
                        className="px-3 py-1.5 text-plum-dark cursor-pointer disabled:opacity-30"
                        disabled={line.quantity <= 1}
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.productId, line.variant, line.quantity + 1)}
                        className="px-3 py-1.5 text-plum-dark cursor-pointer disabled:opacity-30"
                        disabled={line.quantity >= line.stock}
                        aria-label="Aumentar quantidade"
                      >
                        +
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
          <div className="sticky top-24 flex flex-col gap-4 rounded-2xl bg-plum-dark/5 p-6">
            <h2 className="font-serif text-lg font-semibold text-plum-dark">Resumo do Pedido</h2>
            <div className="flex justify-between text-sm text-plum-dark/70">
              <span>Subtotal</span>
              <span>{formatEUR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-plum-dark/70">
              <span>Portes de Envio</span>
              <span>{shipping === 0 ? "Grátis" : formatEUR(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-plum-dark/40">
                Envio grátis a partir de {formatEUR(storeSettings.shipping.freeShippingThreshold)}.
                Valor final calculado no checkout consoante o destino.
              </p>
            )}
            <div className="flex justify-between border-t border-plum/10 pt-4 font-serif text-lg font-semibold text-plum-dark">
              <span>Total</span>
              <span className="text-bordeaux">{formatEUR(total)}</span>
            </div>
            <Button href="/checkout" variant="primary" size="lg" className="mt-2 w-full">
              Finalizar Compra
            </Button>
            <Button href="/loja" variant="ghost" size="sm" className="w-full">
              Continuar a Comprar
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
