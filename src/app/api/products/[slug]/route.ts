import { ok, fail } from "@/backend/lib/response";
import { findProductBySlug } from "@/backend/models/product.model";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await findProductBySlug(slug);
    if (!result) return fail("Produto não encontrado.", 404);
    return ok(result);
  } catch (error) {
    console.error("GET /api/products/[slug]", error);
    return fail("Não foi possível carregar o produto.", 500);
  }
}
