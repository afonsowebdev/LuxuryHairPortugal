import type { Order, OrderStatus } from "@/types";

const STATUS_MAP: Record<string, OrderStatus> = {
  PENDENTE: "A aguardar pagamento",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  ENTREGUE: "Concluído",
  CANCELADO: "Cancelado",
};

export interface ApiOrderItem {
  productId: string;
  nomeProduto: string;
  variante: string;
  precoUnitario: number;
  quantidade: number;
}

export interface ApiPayment {
  metodo: string;
  entidade: string;
  referencia: string;
  valor: number;
  estado: string;
  expiraEm: string;
}

export interface ApiOrder {
  id: string;
  nomeCliente: string;
  email: string;
  telefone: string;
  morada: string;
  cidade: string;
  codigoPostal: string;
  pais: string;
  subtotal: number;
  desconto: number;
  envio: number;
  total: number;
  estado: string;
  createdAt: string;
  items: ApiOrderItem[];
  payment: ApiPayment | null;
}

/**
 * Traduz a encomenda vinda da API (schema Prisma, nomes em português) para o
 * tipo `Order` já usado pela página de confirmação, área de cliente e admin.
 */
export function mapApiOrder(api: ApiOrder): Order {
  return {
    id: api.id,
    reference: api.payment?.referencia ?? "-",
    entity: api.payment?.entidade ?? "-",
    customer: {
      name: api.nomeCliente,
      email: api.email,
      phone: api.telefone,
      address: api.morada,
      city: api.cidade,
      postalCode: api.codigoPostal,
      country: api.pais,
    },
    items: api.items.map((i) => ({
      productId: i.productId,
      name: i.nomeProduto,
      image: i.nomeProduto,
      variant: i.variante || "Padrão",
      quantity: i.quantidade,
      price: i.precoUnitario,
    })),
    subtotal: api.subtotal,
    shipping: api.envio,
    discount: api.desconto > 0 ? api.desconto : undefined,
    total: api.total,
    status: STATUS_MAP[api.estado] ?? "A aguardar pagamento",
    paymentMethod: api.payment?.metodo === "mbway" ? "MB WAY" : "Multibanco",
    createdAt: api.createdAt,
  };
}
