import { ok, fail } from "@/backend/lib/response";
import { getSettings } from "@/backend/models/settings.model";
import { defaultStoreSettings } from "@/lib/data/settings";

// Pública — a loja precisa das definições (portes, marca, pagamentos) sem autenticação.
export async function GET() {
  try {
    const settings = await getSettings(defaultStoreSettings);
    return ok(settings);
  } catch (error) {
    console.error("GET /api/settings", error);
    return fail("Não foi possível carregar as definições.", 500);
  }
}
