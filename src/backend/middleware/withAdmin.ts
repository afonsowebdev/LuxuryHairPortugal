import { NextResponse, type NextRequest } from "next/server";
import { withAuth, type AuthedHandler } from "@/backend/middleware/withAuth";

// Usa withAuth por dentro, e a seguir confirma que o utilizador é ADMIN.
export function withAdmin<Ctx = unknown>(handler: AuthedHandler<Ctx>) {
  return withAuth<Ctx>(async (req: NextRequest, user, context: Ctx) => {
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Acesso restrito a administradores." },
        { status: 403 }
      );
    }
    return handler(req, user, context);
  });
}
