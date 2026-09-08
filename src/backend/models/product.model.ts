import { prisma } from "@/backend/lib/db";
import type { Prisma } from "@prisma/client";

type ProductWithReviews = { reviews: { rating: number }[] } & Record<string, unknown>;

// A avaliação média e o total de reviews são derivados a pedido em vez de
// guardados em colunas próprias, para nunca desalinharem da lista real.
function withRatingSummary<T extends ProductWithReviews>(product: T) {
  const reviewsCount = product.reviews.length;
  const rating = reviewsCount
    ? Math.round((product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount) * 10) / 10
    : 0;
  return { ...product, rating, reviewsCount };
}

export interface ProductFilters {
  categoria?: string;
  min?: number;
  max?: number;
  q?: string;
  cores?: string[];
  comprimentos?: string[];
  texturas?: string[];
  densidades?: string[];
  page?: number;
  limit?: number;
}

export async function listProducts(filters: ProductFilters) {
  const page = Math.max(filters.page ?? 1, 1);
  const limit = Math.min(Math.max(filters.limit ?? 12, 1), 50);

  const where: Prisma.ProductWhereInput = { ativo: true };

  if (filters.categoria) {
    where.categoria = { slug: filters.categoria };
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    where.preco = {
      ...(filters.min !== undefined ? { gte: filters.min } : {}),
      ...(filters.max !== undefined ? { lte: filters.max } : {}),
    };
  }
  if (filters.q) {
    where.OR = [
      { nome: { contains: filters.q, mode: "insensitive" } },
      { descricao: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.cores?.length) where.cores = { hasSome: filters.cores };
  if (filters.comprimentos?.length) where.comprimentos = { hasSome: filters.comprimentos };
  if (filters.texturas?.length) where.texturas = { hasSome: filters.texturas };
  if (filters.densidades?.length) where.densidades = { hasSome: filters.densidades };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { categoria: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items: items.map(withRatingSummary), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function listFeaturedProducts(limit = 8) {
  const items = await prisma.product.findMany({
    where: { ativo: true, destaque: true },
    include: { categoria: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return items.map(withRatingSummary);
}

export async function findProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      categoria: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;

  const related = await prisma.product.findMany({
    where: {
      categoriaId: product.categoriaId,
      ativo: true,
      id: { not: product.id },
    },
    include: { reviews: { select: { rating: true } } },
    take: 4,
  });

  return { product: withRatingSummary(product), related: related.map(withRatingSummary) };
}

// Para o admin — inclui produtos inativos.
export async function listAllProductsForAdmin() {
  const items = await prisma.product.findMany({
    include: { categoria: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });
  return items.map(withRatingSummary);
}

export function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
