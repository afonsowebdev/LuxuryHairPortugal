import type { CartLine } from "@/types";
import { ProductImage } from "@/components/product/ProductImage";
import { formatEUR } from "@/lib/format";
import { getProductBySlug } from "@/lib/data/products";

export function CheckoutSummary({
  lines,
  subtotal,
  shipping,
  shippingLabel,
}: {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
}) {
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-plum-dark/5 p-6">
      <h2 className="font-serif text-lg font-semibold text-plum-dark">Resumo do Pedido</h2>
      <div className="flex max-h-72 flex-col gap-4 overflow-y-auto pr-1">
        {lines.map((line) => {
          const product = getProductBySlug(line.slug);
          return (
            <div key={`${line.productId}-${line.variant}`} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                <ProductImage seed={line.slug} category={product?.category} className="h-full w-full object-cover" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-plum text-[10px] font-bold text-cream">
                  {line.quantity}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-sm font-medium text-plum-dark leading-tight">{line.name}</p>
                <p className="text-xs text-plum-dark/50">{line.variant}</p>
              </div>
              <p className="text-sm font-semibold text-plum-dark">{formatEUR(line.price * line.quantity)}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 border-t border-plum/10 pt-4 text-sm text-plum-dark/70">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatEUR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envio ({shippingLabel})</span>
          <span>{shipping === 0 ? "Grátis" : formatEUR(shipping)}</span>
        </div>
      </div>
      <div className="flex justify-between border-t border-plum/10 pt-4 font-serif text-lg font-semibold text-plum-dark">
        <span>Total</span>
        <span className="text-bordeaux">{formatEUR(total)}</span>
      </div>
    </div>
  );
}
