import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
  userId: string;
  role: Role;
}

function requireSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
  }
  return JWT_SECRET;
}

export function generateToken(userId: string, role: Role): string {
  return jwt.sign({ userId, role }, requireSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

// Aceita qualquer objeto com uma interface Request (inclui NextRequest do
// App Router, que estende a Request nativa da Fetch API).
export function extractToken(req: { headers: Headers }): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
}
