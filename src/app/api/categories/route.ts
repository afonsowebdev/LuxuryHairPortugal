import { ok, fail } from "@/backend/lib/response";
import { prisma } from "@/backend/lib/db";

// Pública — a loja precisa de listar categorias para navegação/filtros.
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { nome: "asc" } });
    return ok(categories);
  } catch (error) {
    console.error("GET /api/categories", error);
    return fail("Não foi possível carregar as categorias.", 500);
  }
}
