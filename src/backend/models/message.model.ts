import { prisma } from "@/backend/lib/db";

export function listMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export function createMessage(data: { nome: string; email: string; assunto: string; mensagem: string }) {
  return prisma.contactMessage.create({ data });
}

export function markMessageRead(id: string) {
  return prisma.contactMessage.update({ where: { id }, data: { lida: true } });
}

export function deleteMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}

export function listSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
}

// Devolve null se o email já estava subscrito, em vez de dar erro — o
// formulário de newsletter trata isso como sucesso silencioso.
export async function addSubscriber(email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalized } });
  if (existing) return null;
  return prisma.newsletterSubscriber.create({ data: { email: normalized } });
}
