import { ok, fail } from "@/backend/lib/response";
import { withAuth } from "@/backend/middleware/withAuth";
import { CART_SESSION_COOKIE } from "@/backend/lib/cartSession";
import { mergeCartOnLogin } from "@/backend/models/cart.model";

// Junta o carrinho anónimo (identificado pelo cookie de sessão) ao carrinho
// do utilizador logo após o login — chamado pelo frontend uma vez, a seguir
// a autenticar com sucesso.
export const POST = withAuth(async (req, user) => {
  try {
    const sessionId = req.cookies.get(CART_SESSION_COOKIE)?.value;
    if (!sessionId) return ok([], "Sem carrinho anónimo para juntar.");

    const items = await mergeCartOnLogin(user.userId, sessionId);
    return ok(items, "Carrinho sincronizado.");
  } catch (error) {
    console.error("POST /api/cart/merge", error);
    return fail("Não foi possível sincronizar o carrinho.", 500);
  }
});
