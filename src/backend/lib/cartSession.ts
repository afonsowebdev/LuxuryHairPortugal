import type { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken } from "@/backend/lib/auth";

export const CART_SESSION_COOKIE = "cart_session";

export interface CartOwnerResolution {
  userId?: string;
  sessionId: string;
  isNewSession: boolean;
}

// O carrinho pertence a um utilizador autenticado (token válido) ou a uma
// sessão anónima identificada por cookie. Se não existir nenhum dos dois,
// cria um novo sessionId — o chamador é responsável por gravá-lo na
// resposta com `applyCartSessionCookie`.
export function resolveCartOwner(req: NextRequest): CartOwnerResolution {
  const token = extractToken(req);
  const user = token ? verifyToken(token) : null;

  const existingSessionId = req.cookies.get(CART_SESSION_COOKIE)?.value;

  return {
    userId: user?.userId,
    sessionId: existingSessionId ?? crypto.randomUUID(),
    isNewSession: !existingSessionId,
  };
}

export function applyCartSessionCookie(res: NextResponse, owner: CartOwnerResolution) {
  if (owner.isNewSession) {
    res.cookies.set(CART_SESSION_COOKIE, owner.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return res;
}
