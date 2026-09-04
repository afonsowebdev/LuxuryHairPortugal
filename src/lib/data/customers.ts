import type { Customer } from "@/types";

/**
 * Sem clientes de exemplo — os clientes são criados/atualizados
 * automaticamente a partir de encomendas reais (ver AdminDataContext.placeOrder)
 * e vivem em localStorage.
 */
export const customers: Customer[] = [];
