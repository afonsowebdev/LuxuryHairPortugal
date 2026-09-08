import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ok, fail } from "@/backend/lib/response";
import { generateToken } from "@/backend/lib/auth";
import { findUserByEmail } from "@/backend/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) return fail("Email e palavra-passe são obrigatórios.");

    const user = await findUserByEmail(email);
    if (!user) return fail("Email ou palavra-passe incorretos.", 401);

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return fail("Email ou palavra-passe incorretos.", 401);

    const token = generateToken(user.id, user.role);

    return ok(
      {
        token,
        user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      },
      "Sessão iniciada."
    );
  } catch (error) {
    console.error("POST /api/auth/login", error);
    return fail("Não foi possível iniciar sessão.", 500);
  }
}
