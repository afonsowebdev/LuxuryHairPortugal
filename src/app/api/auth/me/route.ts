import { ok, fail } from "@/backend/lib/response";
import { withAuth } from "@/backend/middleware/withAuth";
import { findUserById } from "@/backend/models/user.model";

export const GET = withAuth(async (_req, user) => {
  const record = await findUserById(user.userId);
  if (!record) return fail("Utilizador não encontrado.", 404);

  return ok({
    id: record.id,
    nome: record.nome,
    email: record.email,
    telefone: record.telefone,
    morada: record.morada,
    cidade: record.cidade,
    pais: record.pais,
    role: record.role,
  });
});
