import type { OrderStatus } from "@/types";
import { CheckIcon } from "@/components/ui/icons";

const steps: OrderStatus[] = ["A aguardar pagamento", "Pago", "Enviado", "Concluído"];

export function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === "Cancelado") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
        Esta encomenda foi cancelada.
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <ol className="flex items-start justify-between gap-2">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
            <div className="flex w-full items-center">
              <span
                className={`h-px flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-gold" : "bg-plum/15"}`}
              />
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-gold text-plum-dark"
                    : active
                      ? "bg-plum-dark text-gold ring-2 ring-gold ring-offset-2 ring-offset-cream"
                      : "bg-plum-dark/10 text-plum-dark/40"
                }`}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`h-px flex-1 ${i === steps.length - 1 ? "opacity-0" : done ? "bg-gold" : "bg-plum/15"}`}
              />
            </div>
            <span
              className={`text-[11px] font-medium leading-tight ${
                active ? "text-plum-dark" : done ? "text-plum-dark/70" : "text-plum-dark/40"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
