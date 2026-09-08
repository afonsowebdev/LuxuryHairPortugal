import type { Customer } from "@/types";

export interface ApiCustomer {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  ultimaCidade: string;
  ultimoPais: string;
}

export function mapApiCustomer(api: ApiCustomer): Customer {
  return {
    id: api.id,
    name: api.nome,
    email: api.email,
    phone: api.telefone ?? "",
    location: [api.ultimaCidade, api.ultimoPais].filter(Boolean).join(", "),
    ordersCount: api.ordersCount,
    totalSpent: api.totalSpent,
    since: api.createdAt,
  };
}
