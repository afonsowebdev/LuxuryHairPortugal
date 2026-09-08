import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ok, fail } from "@/backend/lib/response";
import { generateToken } from "@/backend/lib/auth";
import { validateEmail, validatePassword, sanitizeString } from "@/backend/lib/validators";
import { createUser, findUserByEmail } from "@/backend/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nome = sanitizeString(String(body.nome ?? ""));
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!nome) return fail("Nome é obrigatório.");
    if (!validateEmail(email)) return fail("Email inválido.");
    if (!validatePassword(password)) {
      return fail("A palavra-passe deve ter pelo menos 8 caracteres, com letras e números.");
    }

    const existing = await findUserByEmail(email);
    if (existing) return fail("Já existe uma conta com este email.", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({
      nome,
      email,
      password: hashed,
      telefone: body.telefone ? sanitizeString(String(body.telefone)) : undefined,
      morada: body.morada ? sanitizeString(String(body.morada)) : undefined,
      cidade: body.cidade ? sanitizeString(String(body.cidade)) : undefined,
      pais: body.pais ? sanitizeString(String(body.pais)) : undefined,
    });

    const token = generateToken(user.id, user.role);

    return ok(
      {
        token,
        user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      },
      "Conta criada com sucesso.",
      201
    );
  } catch (error) {
    console.error("POST /api/auth/register", error);
    return fail("Não foi possível criar a conta.", 500);
  }
}
