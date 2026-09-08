import { prisma } from "@/backend/lib/db";

export function listWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addToWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) return existing;

  return prisma.wishlist.create({ data: { userId, productId }, include: { product: true } });
}

export async function removeFromWishlist(id: string, userId: string) {
  const item = await prisma.wishlist.findUnique({ where: { id } });
  if (!item || item.userId !== userId) throw new Error("Item não encontrado.");
  return prisma.wishlist.delete({ where: { id } });
}
