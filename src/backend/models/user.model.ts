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

// Para o admin listar clientes — nunca devolve a password.
export function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      cidade: true,
      pais: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
