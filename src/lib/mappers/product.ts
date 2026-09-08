import type { CategorySlug, Product, ProductBadge } from "@/types";

export interface ApiReview {
  id: string;
  autor: string;
  rating: number;
  comentario: string;
  createdAt: string;
}

export interface ApiProduct {
  id: string;
  nome: string;
  slug: string;
  resumo: string;
  descricao: string;
  cuidados: string;
  envio: string;
  preco: number;
  precoPromocional: number | null;
  stock: number;
  imagemPrincipal: string | null;
  imagens: string[];
  cores: string[];
  comprimentos: string[];
  densidades: string[];
  texturas: string[];
  badge: string | null;
  bestseller: boolean;
  destaque: boolean;
  ativo: boolean;
  createdAt: string;
  categoria: { slug: string };
  reviews: ApiReview[];
  rating: number;
  reviewsCount: number;
}

/**
 * Traduz o produto vindo da API (nomes de campo em português, schema Prisma)
 * para o tipo `Product` já usado por toda a loja — assim nenhum componente
 * de apresentação precisa de mudar, só a origem dos dados.
 */
export function mapApiProduct(api: ApiProduct): Product {
  const hasRealPhotos = api.imagens.length > 0;
  const photos = hasRealPhotos ? api.imagens : undefined;
  const galleryLength = hasRealPhotos ? api.imagens.length : 2;
  const images = Array.from({ length: galleryLength }, (_, i) =>
    i === 0 ? `${api.nome}, vista frontal` : `${api.nome}, detalhe ${i}`
  );

  return {
    id: api.id,
    slug: api.slug,
    name: api.nome,
    category: api.categoria.slug as CategorySlug,
    price: api.preco,
    compareAtPrice: api.precoPromocional ?? undefined,
    images,
    photos,
    badge: api.badge as ProductBadge,
    shortDescription: api.resumo,
    description: api.descricao,
    care: api.cuidados,
    shipping: api.envio,
    variants: {
      comprimentos: api.comprimentos.length ? api.comprimentos : undefined,
      cores: api.cores.length ? api.cores : undefined,
      densidades: api.densidades.length ? api.densidades : undefined,
      texturas: api.texturas.length ? api.texturas : undefined,
    },
    rating: api.rating,
    reviewsCount: api.reviewsCount,
    reviews: api.reviews.map((r) => ({
      id: r.id,
      author: r.autor,
      rating: r.rating,
      date: r.createdAt.slice(0, 10),
      comment: r.comentario,
    })),
    stock: api.stock,
    featured: api.destaque,
    bestseller: api.bestseller,
    createdAt: api.createdAt,
  };
}

/**
 * Traduz o formulário de admin (tipo `Product`) de volta para o payload que
 * os endpoints /api/admin/products (POST/PUT) esperam.
 */
export function buildProductPayload(product: Product, categoriaId: string) {
  return {
    nome: product.name,
    slug: product.slug,
    resumo: product.shortDescription,
    descricao: product.description,
    cuidados: product.care,
    envio: product.shipping,
    preco: product.price,
    precoPromocional: product.compareAtPrice ?? null,
    stock: product.stock,
    categoriaId,
    imagemPrincipal: product.photos?.[0] ?? null,
    imagens: product.photos ?? [],
    cores: product.variants.cores ?? [],
    comprimentos: product.variants.comprimentos ?? [],
    densidades: product.variants.densidades ?? [],
    texturas: product.variants.texturas ?? [],
    badge: product.badge,
    bestseller: !!product.bestseller,
    destaque: !!product.featured,
    ativo: true,
  };
}
