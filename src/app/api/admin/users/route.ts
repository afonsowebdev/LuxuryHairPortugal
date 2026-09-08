import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { listUsers } from "@/backend/models/user.model";

export const GET = withAdmin(async () => {
  try {
    const users = await listUsers();
    return ok(users);
  } catch (error) {
    console.error("GET /api/admin/users", error);
    return fail("Não foi possível carregar os clientes.", 500);
  }
});
