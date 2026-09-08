import { prisma } from "@/backend/lib/db";
import type { Role } from "@prisma/client";

export interface CreateUserInput {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
  morada?: string;
  cidade?: string;
  pais?: string;
  role?: Role;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(input: CreateUserInput) {
  return prisma.user.create({
    data: {
      nome: input.nome,
      email: input.email.toLowerCase(),
      password: input.password,
      telefone: input.telefone,
      morada: input.morada,
      cidade: input.cidade,
      pais: input.pais ?? "PT",
      role: input.role ?? "CLIENTE",
    },
  });
}

// Para o admin listar clientes — nunca devolve a password. ordersCount e
// totalSpent são derivados das encomendas reais em vez de guardados numa
// coluna, para nunca desalinharem.
export async function listUsers() {
  const users = await prisma.user.findMany({
    where: { role: "CLIENTE" },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      cidade: true,
      pais: true,
      role: true,
      createdAt: true,
      orders: {
        select: { total: true, cidade: true, pais: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map(({ orders, ...user }) => ({
    ...user,
    ordersCount: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
    ultimaCidade: orders[0]?.cidade ?? user.cidade ?? "",
    ultimoPais: orders[0]?.pais ?? user.pais,
  }));
}
