import type { Product, ProductBadge } from "@/types";

/**
 * Catálogo gerido inteiramente pelo administrador em /admin/produtos (criar,
 * editar, apagar, stock, imagens) e que vive em localStorage via
 * AdminDataContext. Este array é apenas o estado inicial antes da primeira
 * gestão de produtos — inclui um produto de exemplo por categoria só para
 * pré-visualizar a apresentação da loja; pode ser editado ou apagado em
 * /admin/produtos como qualquer outro produto.
 */
export const products: Product[] = [
  {
    id: "p-peruca-lisa-loira-613",
    slug: "peruca-lace-front-lisa-loira-613",
    name: "Peruca Lace Front Lisa Loira 613",
    category: "perucas-lisas",
    price: 189.9,
    compareAtPrice: 219.9,
    images: ["Peruca lace front lisa loira, vista frontal", "Detalhe da risca e do lace"],
    badge: "Novo",
    shortDescription: "Cabelo 100% humano, caimento liso e fluido com brilho natural.",
    description:
      "Peruca lace front em cabelo 100% humano Remy, com um liso fluido e natural que acompanha o movimento sem perder o brilho. A base em lace transparente permite uma risca personalizável e um acabamento indetetável junto ao couro cabeludo.",
    care: "Lave com produtos sem sulfatos, seque ao ar ou a temperatura baixa e guarde num suporte próprio para preservar o caimento.",
    shipping: "Envio em 24-48h para Portugal Continental. Entrega em 3-10 dias úteis para Ilhas e Moçambique.",
    variants: {
      comprimentos: ["16\"", "20\"", "24\""],
      cores: ["Loiro 613", "Castanho Natural"],
      densidades: ["150%", "180%"],
    },
    rating: 4.8,
    reviewsCount: 1,
    reviews: [
      {
        id: "r-p1-1",
        author: "Ana Patrícia",
        rating: 5,
        date: "2026-08-12",
        comment: "Cabelo lindíssimo e muito natural, o lace é mesmo indetetável.",
      },
    ],
    stock: 12,
    featured: true,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "p-peruca-cacheada-preta",
    slug: "peruca-lace-front-cacheada-preta",
    name: "Peruca Lace Front Cacheada Preta Natural",
    category: "perucas-cacheadas",
    price: 209.9,
    images: ["Peruca cacheada preta, vista frontal", "Peruca cacheada preta, vista de perfil"],
    photos: [
      "/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg",
      "/assets/produtos/perucas/peruca-preta-cacheada-perfil.jpg",
    ],
    badge: "Mais Vendido",
    shortDescription: "Cachos definidos e volumosos, prontos a usar, sem necessidade de estilo extra.",
    description:
      "Peruca lace front cacheada em cabelo 100% humano, com padrão de caracol definido que mantém a forma lavagem após lavagem. Volume e movimento naturais, ideal para quem quer sair de casa pronta em minutos.",
    care: "Desembarace com os dedos ou pente de dentes largos, hidrate regularmente com leave-in e evite escovar a seco.",
    shipping: "Envio em 24-48h para Portugal Continental. Entrega em 3-10 dias úteis para Ilhas e Moçambique.",
    variants: {
      comprimentos: ["18\"", "22\"", "26\""],
      cores: ["Preto Natural", "Castanho Escuro"],
      texturas: ["Cacheado 3B", "Cacheado 3C"],
    },
    rating: 4.9,
    reviewsCount: 1,
    reviews: [
      {
        id: "r-p2-1",
        author: "Sofia Marques",
        rating: 5,
        date: "2026-07-28",
        comment: "Os cachos mantêm-se perfeitos mesmo depois de várias lavagens. Recomendo muito.",
      },
    ],
    stock: 8,
    bestseller: true,
    createdAt: "2026-07-15T10:00:00.000Z",
  },
  {
    id: "p-box-braids-castanhas",
    slug: "box-braids-knotless-castanhas",
    name: "Box Braids Knotless Castanhas",
    category: "box-braids",
    price: 129.9,
    images: ["Box braids knotless castanhas, vista frontal", "Detalhe do acabamento junto ao lace"],
    photos: [
      "/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg",
      "/assets/produtos/box-braids/box-braids-castanhas-detalhe-lace.jpg",
    ],
    badge: "Novo",
    shortDescription: "Tranças knotless leves e duradouras, prontas a usar sem tempo de salão.",
    description:
      "Box braids knotless em fibra sintética premium, com um acabamento junto à raiz que reduz a tensão no couro cabeludo. Leves, duradouras e com um movimento muito próximo do cabelo natural.",
    care: "Proteja com um lenço de cetim à noite, hidrate o couro cabeludo regularmente e evite molhar em excesso nos primeiros dias.",
    shipping: "Envio em 24-48h para Portugal Continental. Entrega em 3-10 dias úteis para Ilhas e Moçambique.",
    variants: {
      comprimentos: ["18\"", "24\"", "30\""],
      cores: ["Castanho Natural", "Preto", "Ombré Mel"],
    },
    rating: 4.7,
    reviewsCount: 1,
    reviews: [
      {
        id: "r-p3-1",
        author: "Joana Ribeiro",
        rating: 5,
        date: "2026-08-20",
        comment: "Ficaram super naturais, ninguém acreditou que não era o meu cabelo.",
      },
    ],
    stock: 15,
    createdAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "p-pestanas-volume-russo",
    slug: "pestanas-volume-russo-fio-a-fio",
    name: "Pestanas Volume Russo Fio a Fio",
    category: "pestanas",
    price: 24.9,
    compareAtPrice: 29.9,
    images: ["Modelo com pestanas volume russo, retrato", "Aplicação das pestanas em detalhe"],
    photos: [
      "/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg",
      "/assets/modelos/modelo-aplicacao-pestanas.jpg",
    ],
    badge: null,
    shortDescription: "Efeito volume e fio a fio para um olhar sofisticado, leves de usar.",
    description:
      "Pestanas em fibra de seda sintética, ultra leves, para um efeito de volume russo denso sem pesar na pálpebra. Curvatura duradoura e aplicação fácil com a cola incluída.",
    care: "Evite água e vapor nas primeiras 24h após a aplicação, e use apenas removedor de maquilhagem à base de óleo com moderação.",
    shipping: "Envio em 24-48h para Portugal Continental. Entrega em 3-10 dias úteis para Ilhas e Moçambique.",
    variants: {
      densidades: ["Volume Clássico", "Volume Russo 3D", "Volume Russo 5D"],
      comprimentos: ["10-14mm Mix", "12-16mm Mix"],
    },
    rating: 4.6,
    reviewsCount: 1,
    reviews: [
      {
        id: "r-p4-1",
        author: "Beatriz Lourenço",
        rating: 4,
        date: "2026-08-05",
        comment: "Duram semanas e o efeito é mesmo bonito, só demorei um pouco a habituar-me à aplicação.",
      },
    ],
    stock: 30,
    createdAt: "2026-08-22T10:00:00.000Z",
  },
];

/**
 * O badge "Esgotado" é sempre derivado do stock real, independentemente da
 * etiqueta escolhida no admin — assim a loja nunca mostra um produto sem
 * stock como disponível.
 */
export function getEffectiveBadge(product: Product): ProductBadge {
  if (product.stock <= 0) return "Esgotado";
  return product.badge;
}
