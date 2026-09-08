import type { Category, CategorySlug } from "@/types";

export interface ApiCategory {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  imagem: string | null;
}

export function mapApiCategory(api: ApiCategory): Category {
  return {
    slug: api.slug as CategorySlug,
    name: api.nome,
    description: api.descricao,
    image: api.slug,
    photo: api.imagem ?? undefined,
  };
}
