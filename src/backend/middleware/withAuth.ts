import { NextResponse, type NextRequest } from "next/server";
import { extractToken, verifyToken, type TokenPayload } from "@/backend/lib/auth";

/**
 * Adaptação do padrão `withAuth(handler)` para o App Router: em vez de
 * (req, res) do Pages Router, um Route Handler recebe (req, context) e
 * devolve uma Response — por isso o utilizador autenticado é passado como
 * segundo argumento ao handler, em vez de um `req.user` injetado.
 *
 * Uso num route.ts:
 *   export const GET = withAuth(async (req, user) => {
 *     return NextResponse.json({ success: true, data: user });
 *   });
 */
export type AuthedHandler<Ctx = unknown> = (
  req: NextRequest,
  user: TokenPayload,
  context: Ctx
) => Promise<Response> | Response;

export function withAuth<Ctx = unknown>(handler: AuthedHandler<Ctx>) {
  return async (req: NextRequest, context: Ctx) => {
    const token = extractToken(req);
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Não autenticado." },
        { status: 401 }
      );
    }

    return handler(req, user, context);
  };
}
