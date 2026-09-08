import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { prisma } from "@/backend/lib/db";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { sanitizeString } from "@/backend/lib/validators";

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

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const slug = String(body.slug ?? "");
    if (!slug) return fail("slug é obrigatório.");

    const category = await prisma.category.update({
      where: { slug },
      data: {
        ...(body.nome ? { nome: sanitizeString(String(body.nome)) } : {}),
        ...(body.descricao !== undefined ? { descricao: sanitizeString(String(body.descricao)) } : {}),
        ...(body.imagem !== undefined ? { imagem: body.imagem ? String(body.imagem) : null } : {}),
      },
    });
    return ok(category, "Categoria atualizada.");
  } catch (error) {
    console.error("PUT /api/categories", error);
    return fail("Não foi possível atualizar a categoria.", 400);
  }
});
