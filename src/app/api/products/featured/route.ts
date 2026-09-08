import { ok, fail } from "@/backend/lib/response";
import { listFeaturedProducts } from "@/backend/models/product.model";

export async function GET() {
  try {
    const products = await listFeaturedProducts(8);
    return ok(products);
  } catch (error) {
    console.error("GET /api/products/featured", error);
    return fail("Não foi possível carregar os produtos em destaque.", 500);
  }
}
