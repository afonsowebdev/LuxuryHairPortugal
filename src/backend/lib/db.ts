import { PrismaClient } from "@prisma/client";

// Singleton do Prisma Client — evita abrir uma ligação nova à base de dados
// a cada hot-reload em desenvolvimento (Next.js recarrega módulos, mas o
// objeto global sobrevive entre recargas).
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
