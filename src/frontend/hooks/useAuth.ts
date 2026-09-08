"use client";

// Abstração fina sobre o AuthContext — mantém os componentes a importar de
// `hooks/` sem terem de saber que a implementação vive num Context.
export { useAuthContext as useAuth } from "@/frontend/context/AuthContext";
export type { AuthUser } from "@/frontend/context/AuthContext";
