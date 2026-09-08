import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { validateEmail } from "@/backend/lib/validators";
import { addSubscriber } from "@/backend/models/message.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    if (!validateEmail(email)) return fail("Email inválido.");

    const created = await addSubscriber(email);
    return ok(!!created, created ? "Subscrito com sucesso." : "Este email já está subscrito.");
  } catch (error) {
    console.error("POST /api/newsletter", error);
    return fail("Não foi possível subscrever.", 500);
  }
}
