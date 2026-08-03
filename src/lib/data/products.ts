import type { Product, Review } from "@/types";

const sampleReviews: Review[] = [
  {
    id: "r1",
    author: "Ana P.",
    rating: 5,
    date: "2026-06-02",
    comment:
      "Qualidade impressionante, parece mesmo o meu cabelo. Recebi em Lisboa em 3 dias.",
  },
  {
    id: "r2",
    author: "Sofia M.",
    rating: 5,
    date: "2026-05-18",
    comment: "Já é a terceira peruca que compro. Nunca desiludem, sempre luxuosa.",
  },
  {
    id: "r3",
    author: "Beatriz L.",
    rating: 4,
    date: "2026-04-27",
    comment: "Muito bonita e confortável, só demorou um pouco mais no envio para Maputo.",
  },
  {
    id: "r4",
    author: "Carla F.",
    rating: 5,
    date: "2026-03-11",
    comment: "Atendimento impecável e o cabelo é mesmo humano, dá para pintar sem problema.",
  },
];

export const products: Product[] = [
  // Perucas Lisas
  {
    id: "p1",
    slug: "peruca-lisa-honey-blonde-24",
    name: "Peruca Lisa Honey Blonde 24”",
    category: "perucas-lisas",
    price: 289,
    compareAtPrice: 340,
    images: [
      "Peruca lisa honey blonde, vista frontal",
      "Peruca lisa honey blonde, perfil",
      "Peruca lisa honey blonde, detalhe da risca",
    ],
    badge: "Mais Vendido",
    shortDescription: "Cabelo 100% humano Remy, tom honey blonde com efeito lace natural.",
    description:
      "A Peruca Lisa Honey Blonde é confecionada em cabelo 100% humano Remy, com uma base lace que se funde na perfeição com a pele, criando um nascimento de cabelo naturalíssimo. O comprimento de 24 polegadas garante um efeito luxuoso e versátil, ideal tanto para o dia a dia como para ocasiões especiais.",
    care:
      "Lavar a cada 10-15 usos com champô sem sulfatos e água morna. Secar ao ar sobre um suporte de peruca. Evitar calor direto excessivo; usar sempre protetor térmico ao alisar ou modelar.",
    shipping:
      "Envio em 24-48h para Portugal Continental. Envio para Moçambique em 5-10 dias úteis. Portes calculados no checkout.",
    variants: {
      comprimentos: ["18”", "20”", "24”", "28”"],
      cores: ["Honey Blonde", "Preto Natural", "Castanho Chocolate"],
      densidades: ["150%", "180%"],
    },
    rating: 4.9,
    reviewsCount: 128,
    reviews: sampleReviews,
    stock: 14,
    featured: true,
    bestseller: true,
    createdAt: "2026-01-15",
  },
  {
    id: "p2",
    slug: "peruca-lisa-jet-black-20",
    name: "Peruca Lisa Jet Black 20”",
    category: "perucas-lisas",
    price: 259,
    images: [
      "Peruca lisa jet black, vista frontal",
      "Peruca lisa jet black, movimento",
    ],
    badge: "Novo",
    shortDescription: "Preto profundo, brilho de vidro e caimento sedoso.",
    description:
      "Um clássico atemporal: preto intenso com brilho de vidro, perfeito para quem procura sofisticação absoluta. Base lace frontal 13x4 para uma implantação naturalíssima.",
    care:
      "Lavar a cada 10-15 usos com champô sem sulfatos. Pentear sempre com escova de dentes largos, começando pelas pontas.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["16”", "20”", "24”"],
      cores: ["Preto Natural"],
      densidades: ["150%", "180%", "200%"],
    },
    rating: 4.8,
    reviewsCount: 76,
    reviews: sampleReviews.slice(0, 3),
    stock: 9,
    featured: true,
    createdAt: "2026-07-02",
  },
  {
    id: "p3",
    slug: "peruca-lisa-chocolate-silk-26",
    name: "Peruca Lisa Chocolate Silk 26”",
    category: "perucas-lisas",
    price: 319,
    images: ["Peruca lisa chocolate silk, vista frontal", "Peruca lisa chocolate silk, costas"],
    badge: null,
    shortDescription: "Castanho chocolate acetinado, comprimento generoso.",
    description:
      "Tom castanho chocolate profundo com reflexos acetinados. O comprimento extra-longo de 26” cria um efeito dramático e elegante, perfeito para quem adora um visual imponente.",
    care: "Lavar a cada 10-15 usos. Guardar em suporte próprio para manter a forma da lace.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["22”", "26”", "30”"],
      cores: ["Castanho Chocolate", "Castanho Acaju"],
      densidades: ["180%"],
    },
    rating: 4.7,
    reviewsCount: 41,
    reviews: sampleReviews.slice(1, 4),
    stock: 6,
    createdAt: "2026-02-20",
  },
  {
    id: "p4",
    slug: "peruca-lisa-platinum-blonde-22",
    name: "Peruca Lisa Platinum Blonde 22”",
    category: "perucas-lisas",
    price: 349,
    images: ["Peruca lisa platinum blonde, vista frontal"],
    badge: "Esgotado",
    shortDescription: "Loiro platinado editorial, para um efeito de alta-costura.",
    description:
      "Um loiro platinado espetacular, pré-branqueado na raiz para máxima naturalidade. Recomendado para peles claras a médias e para quem procura um visual de destaque absoluto.",
    care: "Usar champô matizador ocasionalmente para manter o tom. Hidratar semanalmente com máscara sem óleo.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["18”", "22”"],
      cores: ["Platinum Blonde"],
      densidades: ["150%"],
    },
    rating: 4.6,
    reviewsCount: 22,
    reviews: sampleReviews.slice(0, 2),
    stock: 0,
    createdAt: "2025-11-08",
  },

  // Perucas Cacheadas
  {
    id: "p5",
    slug: "peruca-cacheada-deep-curly-18",
    name: "Peruca Cacheada Deep Curly 18”",
    category: "perucas-cacheadas",
    price: 299,
    compareAtPrice: 349,
    images: ["Peruca cacheada deep curly, vista frontal", "Peruca cacheada deep curly, perfil"],
    badge: "Mais Vendido",
    shortDescription: "Cachos profundos e definidos, volume natural do início ao fim.",
    description:
      "Cachos deep curly cheios de definição e movimento, mantendo elasticidade mesmo após lavagem. Base lace 360º que permite apanhados altos com naturalidade total.",
    care:
      "Lavar com técnica de co-wash a cada 7-10 usos. Definir os cachos com creme sem enxaguar e deixar secar ao ar.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["14”", "18”", "22”"],
      cores: ["Preto Natural", "Castanho Chocolate"],
      densidades: ["180%", "200%"],
    },
    rating: 4.9,
    reviewsCount: 94,
    reviews: sampleReviews,
    stock: 11,
    featured: true,
    bestseller: true,
    createdAt: "2026-03-01",
  },
  {
    id: "p6",
    slug: "peruca-cacheada-water-wave-20",
    name: "Peruca Cacheada Water Wave 20”",
    category: "perucas-cacheadas",
    price: 279,
    images: ["Peruca cacheada water wave, vista frontal", "Peruca cacheada water wave, movimento"],
    badge: "Novo",
    shortDescription: "Ondulação fluida tipo 'water wave', leve e romântica.",
    description:
      "Um padrão de onda fluida inspirado no efeito molhado, ideal para um visual romântico e sofisticado. Leve, respirável e perfeita para o verão.",
    care: "Lavar a cada 10 usos. Aplicar óleo leve nas pontas para realçar o brilho da onda.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["16”", "20”", "24”"],
      cores: ["Preto Natural", "Honey Blonde"],
      densidades: ["150%", "180%"],
    },
    rating: 4.8,
    reviewsCount: 37,
    reviews: sampleReviews.slice(0, 3),
    stock: 17,
    featured: true,
    createdAt: "2026-06-25",
  },
  {
    id: "p7",
    slug: "peruca-cacheada-kinky-curly-16",
    name: "Peruca Cacheada Kinky Curly 16”",
    category: "perucas-cacheadas",
    price: 265,
    images: ["Peruca cacheada kinky curly, vista frontal"],
    badge: null,
    shortDescription: "Textura afro autêntica, volume denso e definido.",
    description:
      "Réplica fiel da textura de cabelo afro natural, com cachos apertados e volume denso do topo às pontas. Uma escolha popular para quem procura autenticidade e conforto.",
    care: "Hidratar 2x por semana com creme leave-in. Desembaraçar sempre com os dedos ou pente de dentes largos.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["12”", "16”", "20”"],
      cores: ["Preto Natural"],
      densidades: ["200%"],
    },
    rating: 4.7,
    reviewsCount: 58,
    reviews: sampleReviews.slice(1, 4),
    stock: 13,
    createdAt: "2026-01-30",
  },
  {
    id: "p8",
    slug: "peruca-cacheada-bouncy-curls-22",
    name: "Peruca Cacheada Bouncy Curls 22”",
    category: "perucas-cacheadas",
    price: 309,
    images: ["Peruca cacheada bouncy curls, vista frontal", "Peruca cacheada bouncy curls, costas"],
    badge: null,
    shortDescription: "Caracóis elásticos e volumosos, efeito 'blow-out' de salão.",
    description:
      "Caracóis grandes e elásticos que recriam o efeito de um blow-out de salão de luxo. Perfeita para eventos e para um visual glamoroso no dia a dia.",
    care: "Lavar a cada 10-15 usos. Reavivar os caracóis com ferro de 25mm em calor baixo, se necessário.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["18”", "22”", "26”"],
      cores: ["Preto Natural", "Castanho Acaju"],
      densidades: ["180%"],
    },
    rating: 4.8,
    reviewsCount: 29,
    reviews: sampleReviews.slice(0, 2),
    stock: 8,
    createdAt: "2025-12-14",
  },

  // Box Braids
  {
    id: "p9",
    slug: "box-braids-classicas-30",
    name: "Box Braids Clássicas 30”",
    category: "box-braids",
    price: 129,
    compareAtPrice: 149,
    images: ["Box braids clássicas, vista frontal", "Box braids clássicas, comprimento total"],
    badge: "Mais Vendido",
    shortDescription: "Tranças médias prontas a usar, leves e confortáveis.",
    description:
      "Box braids já entrançadas em fibra premium de baixa temperatura, prontas a aplicar. Leves na cabeça, sem peso excessivo, e com acabamento naturalíssimo na raiz.",
    care:
      "Selar as pontas com água morna. Dormir com lenço ou touca de cetim para prolongar a durabilidade até 8 semanas.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["24”", "30”", "36”"],
      cores: ["Preto Natural", "Castanho Chocolate", "Ombré Mel"],
      texturas: ["Clássica", "Jumbo"],
    },
    rating: 4.9,
    reviewsCount: 112,
    reviews: sampleReviews,
    stock: 25,
    featured: true,
    bestseller: true,
    createdAt: "2026-02-05",
  },
  {
    id: "p10",
    slug: "box-braids-goddess-28",
    name: "Box Braids Goddess 28”",
    category: "box-braids",
    price: 149,
    images: ["Box braids goddess, vista frontal", "Box braids goddess, detalhe das madeixas"],
    badge: "Novo",
    shortDescription: "Com madeixas onduladas soltas para um efeito 'goddess'.",
    description:
      "Trança clássica combinada com madeixas onduladas soltas nas pontas, criando um efeito boho-chique muito procurado. Ideal para casamentos, festivais e ocasiões especiais.",
    care: "Hidratar o couro cabeludo com óleo leve a cada 2-3 dias. Evitar tração excessiva na raiz.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["24”", "28”"],
      cores: ["Preto Natural", "Castanho Chocolate"],
      texturas: ["Goddess"],
    },
    rating: 4.8,
    reviewsCount: 33,
    reviews: sampleReviews.slice(0, 3),
    stock: 19,
    featured: true,
    createdAt: "2026-07-10",
  },
  {
    id: "p11",
    slug: "box-braids-knotless-32",
    name: "Box Braids Knotless 32”",
    category: "box-braids",
    price: 159,
    images: ["Box braids knotless, vista frontal"],
    badge: null,
    shortDescription: "Técnica 'knotless' sem nós, mais leve e confortável no couro cabeludo.",
    description:
      "Confecionadas com a técnica knotless, sem nós na raiz, para uma sensação de peso reduzido e maior conforto ao longo do dia. Acabamento extremamente natural.",
    care: "Selar as pontas com água quente. Massajar o couro cabeludo semanalmente com óleo nutritivo.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["28”", "32”"],
      cores: ["Preto Natural", "Castanho Chocolate", "Ombré Mel"],
      texturas: ["Knotless"],
    },
    rating: 4.9,
    reviewsCount: 47,
    reviews: sampleReviews.slice(1, 4),
    stock: 15,
    createdAt: "2026-04-18",
  },
  {
    id: "p12",
    slug: "box-braids-bob-14",
    name: "Box Braids Bob 14”",
    category: "box-braids",
    price: 99,
    images: ["Box braids bob, vista frontal", "Box braids bob, perfil"],
    badge: null,
    shortDescription: "Comprimento curto tipo 'bob', prático e elegante.",
    description:
      "Uma versão curta e chique das clássicas box braids, no comprimento bob. Fácil de aplicar e manter, perfeita para o dia a dia com um toque de sofisticação.",
    care: "Selar as pontas com água morna. Dormir com touca de cetim.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["10”", "14”"],
      cores: ["Preto Natural", "Castanho Chocolate"],
      texturas: ["Clássica"],
    },
    rating: 4.6,
    reviewsCount: 18,
    reviews: sampleReviews.slice(0, 2),
    stock: 21,
    createdAt: "2025-10-22",
  },

  // Pestanas
  {
    id: "p13",
    slug: "pestanas-volume-russo-20d",
    name: "Pestanas Volume Russo 20D",
    category: "pestanas",
    price: 24,
    images: ["Pestanas volume russo, embalagem", "Pestanas volume russo, detalhe"],
    badge: "Mais Vendido",
    shortDescription: "Efeito volume intenso, fibra de seda ultra leve.",
    description:
      "Pestanas em fibra de seda com efeito volume russo 20D, criando um olhar dramático e sofisticado sem pesar na pálpebra. Curvatura D para máximo destaque.",
    care: "Aplicar com cola de secagem rápida hipoalergénica. Evitar contacto com água nas primeiras 4 horas.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["10mm-15mm mistas"],
      cores: ["Preto"],
    },
    rating: 4.9,
    reviewsCount: 203,
    reviews: sampleReviews,
    stock: 60,
    featured: true,
    bestseller: true,
    createdAt: "2026-01-08",
  },
  {
    id: "p14",
    slug: "pestanas-fio-a-fio-natural",
    name: "Pestanas Fio a Fio Natural",
    category: "pestanas",
    price: 19,
    images: ["Pestanas fio a fio, embalagem"],
    badge: "Novo",
    shortDescription: "Efeito clássico fio a fio, subtil e elegante para o dia a dia.",
    description:
      "Extensão clássica fio a fio que realça o olhar de forma discreta e natural. Perfeita para quem procura elegância no dia a dia sem exagero.",
    care: "Evitar máscara de pestanas oleosa. Escovar diariamente com escova limpa.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["8mm-12mm mistas"],
      cores: ["Preto"],
    },
    rating: 4.7,
    reviewsCount: 88,
    reviews: sampleReviews.slice(0, 3),
    stock: 45,
    featured: true,
    createdAt: "2026-06-30",
  },
  {
    id: "p15",
    slug: "pestanas-volume-hibrido-mega",
    name: "Pestanas Volume Híbrido Mega",
    category: "pestanas",
    price: 27,
    images: ["Pestanas volume hibrido, embalagem", "Pestanas volume hibrido, detalhe"],
    badge: null,
    shortDescription: "Mistura de fio a fio e volume russo para um efeito equilibrado.",
    description:
      "A combinação perfeita entre naturalidade e intensidade — técnica híbrida que mistura fios individuais com leques de volume russo, resultando num olhar cheio mas equilibrado.",
    care: "Não usar produtos à base de óleo perto dos olhos. Retoque recomendado a cada 2-3 semanas.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["9mm-14mm mistas"],
      cores: ["Preto"],
    },
    rating: 4.8,
    reviewsCount: 54,
    reviews: sampleReviews.slice(1, 4),
    stock: 38,
    createdAt: "2026-03-25",
  },
  {
    id: "p16",
    slug: "pestanas-volume-egipcio-glamour",
    name: "Pestanas Volume Egípcio Glamour",
    category: "pestanas",
    price: 29,
    compareAtPrice: 34,
    images: ["Pestanas volume egipcio, embalagem"],
    badge: null,
    shortDescription: "Leques irregulares para um efeito glamoroso e dramático.",
    description:
      "Técnica de volume egípcio com leques de comprimentos irregulares, criando um efeito 'esfumado' extremamente glamoroso. Ideal para eventos e sessões fotográficas.",
    care: "Evitar dormir de bruços. Pentear diariamente com escovinha própria.",
    shipping: "Envio em 24-48h para Portugal Continental. Moçambique em 5-10 dias úteis.",
    variants: {
      comprimentos: ["10mm-16mm mistas"],
      cores: ["Preto"],
    },
    rating: 4.7,
    reviewsCount: 31,
    reviews: sampleReviews.slice(0, 2),
    stock: 0,
    createdAt: "2025-09-19",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export const allColors = Array.from(
  new Set(products.flatMap((p) => p.variants.cores ?? []))
);

export const allLengths = Array.from(
  new Set(products.flatMap((p) => p.variants.comprimentos ?? []))
);

export const allTextures = Array.from(
  new Set(products.flatMap((p) => p.variants.texturas ?? []))
);
