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
    photo: "/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg",
  },
  {
    slug: "box-braids",
    name: "Box Braids",
    description:
      "Tranças sintéticas premium, leves e duradouras, prontas a usar.",
    image: "box-braids",
    photo: "/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg",
  },
  {
    slug: "pestanas",
    name: "Pestanas",
    description:
      "Pestanas de efeito volume e fio a fio para um olhar sofisticado.",
    image: "pestanas",
    photo: "/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
