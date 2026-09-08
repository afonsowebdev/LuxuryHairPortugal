import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { updateSettings } from "@/backend/models/settings.model";

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const settings = await updateSettings(body);
    return ok(settings, "Definições atualizadas.");
  } catch (error) {
    console.error("PUT /api/admin/settings", error);
    return fail("Não foi possível atualizar as definições.", 400);
  }
});
