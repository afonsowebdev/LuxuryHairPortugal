import { ok, fail } from "@/backend/lib/response";
import { withAuth } from "@/backend/middleware/withAuth";
import { listOrdersByUser } from "@/backend/models/order.model";

export const GET = withAuth(async (_req, user) => {
  try {
    const orders = await listOrdersByUser(user.userId);
    return ok(orders);
  } catch (error) {
    console.error("GET /api/orders", error);
    return fail("Não foi possível carregar as encomendas.", 500);
  }
});
