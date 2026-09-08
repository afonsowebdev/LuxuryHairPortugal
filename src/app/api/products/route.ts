import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { listProducts } from "@/backend/models/product.model";

// GET /api/products?categoria=perucas&min=10&max=100&q=lace&page=1&limit=12
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const csv = (key: string) => {
      const raw = params.get(key);
      return raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : undefined;
    };

    const result = await listProducts({
      categoria: params.get("categoria") ?? undefined,
      min: params.has("min") ? Number(params.get("min")) : undefined,
      max: params.has("max") ? Number(params.get("max")) : undefined,
      q: params.get("q") ?? undefined,
      cores: csv("cor"),
      comprimentos: csv("comprimento"),
      texturas: csv("textura"),
      densidades: csv("densidade"),
      page: params.has("page") ? Number(params.get("page")) : undefined,
      limit: params.has("limit") ? Number(params.get("limit")) : undefined,
    });

    return ok(result);
  } catch (error) {
    console.error("GET /api/products", error);
    return fail("Não foi possível carregar os produtos.", 500);
  }
}
