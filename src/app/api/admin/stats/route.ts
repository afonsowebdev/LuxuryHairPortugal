import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { prisma } from "@/backend/lib/db";

const SALE_STATES = ["PAGO", "ENVIADO", "ENTREGUE"] as const;

export const GET = withAdmin(async () => {
  try {
    const [salesAgg, totalEncomendas, totalClientes, porEstadoRaw, topProdutosRaw, orders7dias] =
      await Promise.all([
        prisma.order.aggregate({
          where: { estado: { in: [...SALE_STATES] } },
          _sum: { total: true },
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CLIENTE" } }),
        prisma.order.groupBy({ by: ["estado"], _count: { estado: true } }),
        prisma.orderItem.groupBy({
          by: ["productId", "nomeProduto"],
          _sum: { quantidade: true },
          orderBy: { _sum: { quantidade: "desc" } },
          take: 5,
        }),
        prisma.order.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          select: { total: true, createdAt: true },
        }),
      ]);

    const porEstado = Object.fromEntries(porEstadoRaw.map((r) => [r.estado, r._count.estado]));

    const topProdutos = topProdutosRaw.map((p) => ({
      productId: p.productId,
      nomeProduto: p.nomeProduto,
      totalVendido: p._sum.quantidade ?? 0,
    }));

    const vendasPorDia: Record<string, number> = {};
    for (const order of orders7dias) {
      const day = order.createdAt.toISOString().slice(0, 10);
      vendasPorDia[day] = (vendasPorDia[day] ?? 0) + order.total;
    }

    return ok({
      totalVendas: salesAgg._sum.total ?? 0,
      totalEncomendas,
      totalClientes,
      encomendasPorEstado: porEstado,
      topProdutos,
      vendasUltimos7Dias: vendasPorDia,
    });
  } catch (error) {
    console.error("GET /api/admin/stats", error);
    return fail("Não foi possível carregar as estatísticas.", 500);
  }
});
