import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedReview {
  autor: string;
  rating: number;
  comentario: string;
}

async function main() {
  // As 4 categorias têm de corresponder exatamente aos slugs que o frontend
  // já usa (rotas /loja/perucas-lisas, /loja/box-braids, etc.) — não aos
  // "Perucas"/"Pestanas" genéricos do pedido original.
  const perucasLisas = await prisma.category.upsert({
    where: { slug: "perucas-lisas" },
    update: {},
    create: {
      nome: "Perucas Lisas",
      slug: "perucas-lisas",
      descricao: "Cabelo 100% humano, brilho natural e caimento fluido para um efeito liso impecável.",
      imagem: null,
    },
  });

  const perucasCacheadas = await prisma.category.upsert({
    where: { slug: "perucas-cacheadas" },
    update: {},
    create: {
      nome: "Perucas Cacheadas",
      slug: "perucas-cacheadas",
      descricao: "Cachos definidos e volumosos, cheios de movimento e personalidade.",
      imagem: "/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg",
    },
  });

  const boxBraids = await prisma.category.upsert({
    where: { slug: "box-braids" },
    update: {},
    create: {
      nome: "Box Braids",
      slug: "box-braids",
      descricao: "Tranças sintéticas premium, leves e duradouras, prontas a usar.",
      imagem: "/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg",
    },
  });

  const pestanas = await prisma.category.upsert({
    where: { slug: "pestanas" },
    update: {},
    create: {
      nome: "Pestanas",
      slug: "pestanas",
      descricao: "Pestanas de efeito volume e fio a fio para um olhar sofisticado.",
      imagem: "/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg",
    },
  });

  const produtos = [
    {
      nome: "Peruca Lace Front Lisa Loira 613",
      slug: "peruca-lace-front-lisa-loira-613",
      resumo: "Cabelo 100% humano, caimento liso e fluido com brilho natural.",
      descricao:
        "Peruca lace front em cabelo 100% humano Remy, com um liso fluido e natural que acompanha o movimento sem perder o brilho. A base em lace transparente permite uma risca personalizável e um acabamento indetetável junto ao couro cabeludo.",
      cuidados:
        "Lave com produtos sem sulfatos, seque ao ar ou a temperatura baixa e guarde num suporte próprio para preservar o caimento.",
      preco: 189.9,
      precoPromocional: 219.9,
      stock: 12,
      categoriaId: perucasLisas.id,
      imagemPrincipal: null,
      imagens: [],
      cores: ["Loiro 613", "Castanho Natural"],
      comprimentos: ["16\"", "20\"", "24\""],
      densidades: ["150%", "180%"],
      badge: "Novo",
      bestseller: false,
      destaque: true,
      reviews: [
        { autor: "Ana Patrícia", rating: 5, comentario: "Cabelo lindíssimo e muito natural, o lace é mesmo indetetável." },
      ] as SeedReview[],
    },
    {
      nome: "Peruca Lace Front Cacheada Preta",
      slug: "peruca-lace-front-cacheada-preta",
      resumo: "Cachos definidos e volumosos, prontos a usar, sem necessidade de estilo extra.",
      descricao:
        "Peruca lace front cacheada em cabelo 100% humano, com padrão de caracol definido que mantém a forma lavagem após lavagem. Volume e movimento naturais, ideal para quem quer sair de casa pronta em minutos.",
      cuidados:
        "Desembarace com os dedos ou pente de dentes largos, hidrate regularmente com leave-in e evite escovar a seco.",
      preco: 209.9,
      stock: 8,
      categoriaId: perucasCacheadas.id,
      imagemPrincipal: "/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg",
      imagens: ["/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg"],
      cores: ["Preto Natural", "Castanho Chocolate"],
      comprimentos: ["18\"", "22\"", "26\""],
      texturas: ["Cacheado 3B", "Cacheado 3C"],
      badge: "Mais Vendido",
      bestseller: true,
      destaque: true,
      reviews: [
        { autor: "Sofia Marques", rating: 5, comentario: "Os cachos mantêm-se perfeitos mesmo depois de várias lavagens. Recomendo muito." },
      ] as SeedReview[],
    },
    {
      nome: "Peruca Bob Curto Castanho",
      slug: "peruca-bob-curto-castanho",
      resumo: "Corte bob moderno, leve e fácil de estilizar.",
      descricao:
        "Peruca bob em lace front, corte moderno e versátil que se adapta a qualquer rotina. Leve no couro cabeludo e pronta a usar, sem necessidade de escova ou chapinha para manter a forma.",
      cuidados: "Lave com produtos sem sulfatos a cada 8-10 usos e guarde num suporte de cabeça para manter o corte.",
      preco: 159.9,
      stock: 10,
      categoriaId: perucasLisas.id,
      imagemPrincipal: null,
      imagens: [],
      cores: ["Castanho Chocolate", "Castanho Acaju"],
      comprimentos: ["10\"", "12\""],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Peruca Ondulada Ruiva",
      slug: "peruca-ondulada-ruiva",
      resumo: "Ondulações naturais com reflexos cor de cobre.",
      descricao:
        "Peruca lace front ondulada em tom ruivo cobreado, com um movimento suave e reflexos que captam a luz. Ideal para quem procura um visual vibrante sem abdicar de um caimento natural.",
      cuidados: "Hidrate semanalmente com máscara sem óleo e seque ao ar para preservar o ondulado.",
      preco: 199.9,
      stock: 6,
      categoriaId: perucasCacheadas.id,
      imagemPrincipal: "/assets/produtos/perucas/peruca-loira-ondulada-frontal.jpg",
      imagens: ["/assets/produtos/perucas/peruca-loira-ondulada-frontal.jpg"],
      cores: ["Ombré Mel"],
      comprimentos: ["18\"", "20\""],
      texturas: ["Ondulado"],
      badge: "Novo",
      bestseller: false,
      destaque: true,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Peruca Longa Platinado",
      slug: "peruca-longa-platinado",
      resumo: "Comprimento extra longo em tom platinado luminoso.",
      descricao:
        "Peruca lace front de comprimento extra longo em platinado luminoso, para um efeito dramático e sofisticado. Cabelo denso do topo às pontas, sem perder leveza.",
      cuidados: "Use champô matizador ocasionalmente para preservar o tom e hidrate as pontas a cada lavagem.",
      preco: 229.9,
      stock: 5,
      categoriaId: perucasLisas.id,
      imagemPrincipal: null,
      imagens: [],
      cores: ["Platinum Blonde"],
      comprimentos: ["26\"", "28\"", "30\""],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Peruca Curta Preta Natural",
      slug: "peruca-curta-preta-natural",
      resumo: "Acabamento discreto e natural para o dia a dia.",
      descricao:
        "Peruca curta em preto natural, pensada para um uso diário discreto e confortável. Lace transparente junto à testa para um acabamento indetetável mesmo com o cabelo apanhado.",
      cuidados: "Lave com água morna e produtos suaves, e deixe secar ao ar longe de fontes de calor direto.",
      preco: 139.9,
      stock: 15,
      categoriaId: perucasLisas.id,
      imagemPrincipal: null,
      imagens: [],
      cores: ["Preto"],
      comprimentos: ["8\"", "10\""],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Box Braids Knotless Castanhas",
      slug: "box-braids-knotless-castanhas",
      resumo: "Tranças knotless leves e duradouras, prontas a usar sem tempo de salão.",
      descricao:
        "Box braids knotless em fibra sintética premium, com um acabamento junto à raiz que reduz a tensão no couro cabeludo. Leves, duradouras e com um movimento muito próximo do cabelo natural.",
      cuidados:
        "Proteja com um lenço de cetim à noite, hidrate o couro cabeludo regularmente e evite molhar em excesso nos primeiros dias.",
      preco: 129.9,
      stock: 15,
      categoriaId: boxBraids.id,
      imagemPrincipal: "/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg",
      imagens: ["/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg"],
      cores: ["Castanho Natural", "Preto", "Ombré Mel"],
      comprimentos: ["18\"", "24\"", "30\""],
      badge: "Novo",
      bestseller: false,
      destaque: true,
      reviews: [
        { autor: "Joana Ribeiro", rating: 5, comentario: "Ficaram super naturais, ninguém acreditou que não era o meu cabelo." },
      ] as SeedReview[],
    },
    {
      nome: "Box Braids Boho com Franjas",
      slug: "box-braids-boho-com-franjas",
      resumo: "Franjas soltas ao longo da trança para um efeito boho descontraído.",
      descricao:
        "Box braids com franjas soltas distribuídas ao longo do comprimento, para um efeito boho descontraído e cheio de movimento. Fibra leve que não pesa no couro cabeludo mesmo em tranças longas.",
      cuidados: "Proteja com lenço de cetim à noite e reaplique gel nas franjas conforme necessário.",
      preco: 149.9,
      stock: 10,
      categoriaId: boxBraids.id,
      imagemPrincipal: null,
      imagens: [],
      cores: ["Castanho Natural", "Preto"],
      comprimentos: ["20\"", "26\""],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Pestanas Volume Russo Fio a Fio",
      slug: "pestanas-volume-russo-fio-a-fio",
      resumo: "Efeito volume e fio a fio para um olhar sofisticado, leves de usar.",
      descricao:
        "Pestanas em fibra de seda sintética, ultra leves, para um efeito de volume russo denso sem pesar na pálpebra. Curvatura duradoura e aplicação fácil com a cola incluída.",
      cuidados:
        "Evite água e vapor nas primeiras 24h após a aplicação, e use apenas removedor de maquilhagem à base de óleo com moderação.",
      preco: 24.9,
      precoPromocional: 29.9,
      stock: 30,
      categoriaId: pestanas.id,
      imagemPrincipal: null,
      imagens: [],
      densidades: ["Volume Clássico", "Volume Russo 3D", "Volume Russo 5D"],
      comprimentos: ["10-14mm Mix", "12-16mm Mix"],
      badge: null,
      bestseller: false,
      destaque: true,
      reviews: [
        {
          autor: "Beatriz Lourenço",
          rating: 4,
          comentario: "Duram semanas e o efeito é mesmo bonito, só demorei um pouco a habituar-me à aplicação.",
        },
      ] as SeedReview[],
    },
    {
      nome: "Pestanas Volume Clássico",
      slug: "pestanas-volume-classico",
      resumo: "Efeito natural, leve e confortável de usar.",
      descricao:
        "Pestanas de volume clássico, uma extensão por fio natural, para um efeito discreto que realça o olhar sem exagero. Leves e confortáveis mesmo ao final do dia.",
      cuidados: "Evite água nas primeiras 24h e escove diariamente com uma escovinha limpa.",
      preco: 19.9,
      stock: 25,
      categoriaId: pestanas.id,
      imagemPrincipal: null,
      imagens: [],
      densidades: ["Volume Clássico"],
      comprimentos: ["8-12mm Mix"],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Pestanas Efeito Boneca",
      slug: "pestanas-efeito-boneca",
      resumo: "Curvatura acentuada para olhos mais abertos e expressivos.",
      descricao:
        "Pestanas com curvatura acentuada tipo boneca, pensadas para abrir o olhar e dar um efeito mais expressivo e jovem. Aplicação em volume russo 3D para maior densidade.",
      cuidados: "Durma de barriga para cima quando possível e evite óleos na zona dos olhos.",
      preco: 22.9,
      stock: 20,
      categoriaId: pestanas.id,
      imagemPrincipal: null,
      imagens: [],
      densidades: ["Volume Russo 3D"],
      comprimentos: ["10-14mm Mix"],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
    {
      nome: "Pestanas Mega Volume 3D",
      slug: "pestanas-mega-volume-3d",
      resumo: "Densidade máxima para um look mais dramático.",
      descricao:
        "Pestanas mega volume com fios ultra finos aplicados em leques de 5D, para a densidade máxima do catálogo e um efeito dramático de glamour.",
      cuidados: "Use removedor à base de óleo com moderação e evite esfregar os olhos.",
      preco: 27.9,
      stock: 18,
      categoriaId: pestanas.id,
      imagemPrincipal: null,
      imagens: [],
      densidades: ["Volume Russo 5D"],
      comprimentos: ["12-16mm Mix"],
      badge: null,
      bestseller: false,
      destaque: false,
      reviews: [] as SeedReview[],
    },
  ];

  for (const { reviews, ...produto } of produtos) {
    const saved = await prisma.product.upsert({
      where: { slug: produto.slug },
      update: produto,
      create: produto,
    });

    // Reseed idempotente: apaga e recria as reviews deste produto em vez de
    // acumular duplicados cada vez que o seed corre.
    await prisma.review.deleteMany({ where: { productId: saved.id } });
    if (reviews.length) {
      await prisma.review.createMany({
        data: reviews.map((r) => ({ productId: saved.id, autor: r.autor, rating: r.rating, comentario: r.comentario })),
      });
    }
  }

  // Limpa a categoria genérica "perucas" de uma seed anterior, agora que
  // todos os produtos foram reatribuídos às 4 categorias reais acima.
  const legacy = await prisma.category.findUnique({ where: { slug: "perucas" } });
  if (legacy) {
    const stillUsed = await prisma.product.count({ where: { categoriaId: legacy.id } });
    if (stillUsed === 0) await prisma.category.delete({ where: { id: legacy.id } });
  }

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@luxuryhair.pt" },
    update: {},
    create: {
      nome: "Admin Luxury Hair",
      email: "admin@luxuryhair.pt",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const clientPassword = await bcrypt.hash("Cliente123!", 10);
  await prisma.user.upsert({
    where: { email: "cliente@teste.pt" },
    update: {},
    create: {
      nome: "Cliente Teste",
      email: "cliente@teste.pt",
      password: clientPassword,
      role: "CLIENTE",
    },
  });

  console.log(`Seed concluído: 4 categorias, ${produtos.length} produtos, 1 admin, 1 cliente.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
