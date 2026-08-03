import type { Category } from "@/types";

export const categories: Category[] = [
  {
    slug: "perucas-lisas",
    name: "Perucas Lisas",
    description:
      "Cabelo 100% humano, brilho natural e caimento fluido para um efeito liso impecável.",
    image: "perucas-lisas",
  },
  {
    slug: "perucas-cacheadas",
    name: "Perucas Cacheadas",
    description:
      "Cachos definidos e volumosos, cheios de movimento e personalidade.",
    image: "perucas-cacheadas",
  },
  {
    slug: "box-braids",
    name: "Box Braids",
    description:
      "Tranças sintéticas premium, leves e duradouras, prontas a usar.",
    image: "box-braids",
  },
  {
    slug: "pestanas",
    name: "Pestanas",
    description:
      "Pestanas de efeito volume e fio a fio para um olhar sofisticado.",
    image: "pestanas",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
