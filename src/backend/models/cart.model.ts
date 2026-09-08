import { prisma } from "@/backend/lib/db";

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}

function ownerWhere({ userId, sessionId }: CartOwner) {
  if (userId) return { userId };
  if (sessionId) return { sessionId };
  throw new Error("É necessário userId ou sessionId para aceder ao carrinho.");
}

export function getCart(owner: CartOwner) {
  return prisma.cart.findMany({
    where: ownerWhere(owner),
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function addToCart(
  owner: CartOwner,
  productId: string,
  quantidade: number,
  variante = ""
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.ativo) throw new Error("Produto não encontrado.");
  if (product.stock < quantidade) throw new Error("Stock insuficiente.");

  const existing = await prisma.cart.findFirst({
    where: { ...ownerWhere(owner), productId, variante },
  });

  if (existing) {
    const novaQuantidade = Math.min(existing.quantidade + quantidade, product.stock);
    return prisma.cart.update({
      where: { id: existing.id },
      data: { quantidade: novaQuantidade },
      include: { product: true },
    });
  }

  return prisma.cart.create({
    data: {
      userId: owner.userId,
      sessionId: owner.sessionId,
      productId,
      variante,
      quantidade: Math.min(quantidade, product.stock),
    },
    include: { product: true },
  });
}

export async function updateCartItem(id: string, quantidade: number) {
  const item = await prisma.cart.findUnique({ where: { id }, include: { product: true } });
  if (!item) throw new Error("Item do carrinho não encontrado.");
  const clamped = Math.min(Math.max(quantidade, 1), item.product.stock);
  return prisma.cart.update({ where: { id }, data: { quantidade: clamped } });
}

export function removeCartItem(id: string) {
  return prisma.cart.delete({ where: { id } });
}

export function clearCart(owner: CartOwner) {
  return prisma.cart.deleteMany({ where: ownerWhere(owner) });
}

// Junta o carrinho anónimo (por sessionId) ao carrinho do utilizador depois
// do login, somando quantidades quando o mesmo produto já lá está.
export async function mergeCartOnLogin(userId: string, sessionId: string) {
  const guestItems = await prisma.cart.findMany({ where: { sessionId } });

  for (const item of guestItems) {
    const existing = await prisma.cart.findFirst({
      where: { userId, productId: item.productId, variante: item.variante },
    });
    if (existing) {
      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantidade: existing.quantidade + item.quantidade },
      });
      await prisma.cart.delete({ where: { id: item.id } });
    } else {
      await prisma.cart.update({ where: { id: item.id }, data: { userId, sessionId: null } });
    }
  }

  return getCart({ userId });
}
