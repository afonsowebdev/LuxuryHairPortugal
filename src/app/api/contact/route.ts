import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { sanitizeString, validateEmail } from "@/backend/lib/validators";
import { createMessage } from "@/backend/models/message.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nome = sanitizeString(String(body.nome ?? ""));
    const email = String(body.email ?? "").trim();
    const assunto = sanitizeString(String(body.assunto ?? ""));
    const mensagem = sanitizeString(String(body.mensagem ?? ""));

    if (!nome) return fail("Nome é obrigatório.");
    if (!validateEmail(email)) return fail("Email inválido.");
    if (!assunto) return fail("Assunto é obrigatório.");
    if (!mensagem) return fail("Mensagem é obrigatória.");

    const created = await createMessage({ nome, email, assunto, mensagem });
    return ok(created, "Mensagem enviada.", 201);
  } catch (error) {
    console.error("POST /api/contact", error);
    return fail("Não foi possível enviar a mensagem.", 500);
  }
}
