import { prisma } from "@/backend/lib/db";
import type { OrderStatus } from "@prisma/client";
import type { CartOwner } from "@/backend/models/cart.model";

export interface CreateOrderInput {
  userId?: string;
  nomeCliente: string;
  email: string;
  telefone: string;
  morada: string;
  cidade: string;
  codigoPostal: string;
  pais: string;
  desconto?: number;
  envio?: number;
  cartOwner: CartOwner;
}

function cartWhere(owner: CartOwner) {
  return owner.userId ? { userId: owner.userId } : { sessionId: owner.sessionId };
}

// Cria a encomenda a partir do carrinho atual dentro de uma transação: lê o
// carrinho, confirma stock, cria a encomenda + itens, desconta o stock e
// esvazia o carrinho — tudo ou nada, para nunca ficar num estado a meio.
export async function createOrderFromCart(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    const cartItems = await tx.cart.findMany({
      where: cartWhere(input.cartOwner),
      include: { product: true },
    });
    if (cartItems.length === 0) throw new Error("Carrinho vazio.");

    for (const item of cartItems) {
      if (item.product.stock < item.quantidade) {
        throw new Error(`Stock insuficiente para "${item.product.nome}".`);
      }
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.product.preco * i.quantidade, 0);
    const desconto = input.desconto ?? 0;
    const envio = input.envio ?? 0;
    const total = Math.max(subtotal - desconto, 0) + envio;

    const order = await tx.order.create({
      data: {
        userId: input.userId,
        nomeCliente: input.nomeCliente,
        email: input.email,
        telefone: input.telefone,
        morada: input.morada,
        cidade: input.cidade,
        codigoPostal: input.codigoPostal,
        pais: input.pais,
        subtotal,
        desconto,
        envio,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            nomeProduto: item.product.nome,
            variante: item.variante,
            precoUnitario: item.product.preco,
            quantidade: item.quantidade,
          })),
        },
        tracking: {
          create: { estado: "PENDENTE", descricao: "Encomenda criada, a aguardar pagamento." },
        },
      },
      include: { items: true, tracking: true },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantidade } },
      });
    }

    await tx.cart.deleteMany({ where: cartWhere(input.cartOwner) });

    return order;
  });
}

export function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true, tracking: { orderBy: { createdAt: "asc" } } },
  });
}

export function listOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export function listAllOrdersForAdmin(estado?: OrderStatus) {
  return prisma.order.findMany({
    where: estado ? { estado } : undefined,
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, estado: OrderStatus, descricao?: string) {
  return prisma.order.update({
    where: { id },
    data: {
      estado,
      tracking: {
        create: {
          estado,
          descricao: descricao ?? `Estado atualizado para ${estado}.`,
        },
      },
    },
    include: { items: true, tracking: true },
  });
}
