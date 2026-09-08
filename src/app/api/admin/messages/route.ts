import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { listMessages, markMessageRead, deleteMessage } from "@/backend/models/message.model";

export const GET = withAdmin(async () => {
  const messages = await listMessages();
  return ok(messages);
});

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");

    const message = await markMessageRead(id);
    return ok(message, "Mensagem marcada como lida.");
  } catch (error) {
    console.error("PUT /api/admin/messages", error);
    return fail("Não foi possível atualizar a mensagem.", 400);
  }
});

export const DELETE = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");

    await deleteMessage(id);
    return ok(null, "Mensagem eliminada.");
  } catch (error) {
    console.error("DELETE /api/admin/messages", error);
    return fail("Não foi possível eliminar a mensagem.", 400);
  }
});
