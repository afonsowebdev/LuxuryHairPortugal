const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

// Mínimo 8 caracteres, pelo menos 1 número e 1 letra.
export function validatePassword(password: string): boolean {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

export interface CheckoutBody {
  nomeCliente?: string;
  email?: string;
  telefone?: string;
  morada?: string;
  cidade?: string;
  codigoPostal?: string;
  pais?: string;
}

export function validateCheckout(body: CheckoutBody): string | null {
  if (!body.nomeCliente?.trim()) return "Nome é obrigatório.";
  if (!body.email?.trim() || !validateEmail(body.email)) return "Email inválido.";
  if (!body.telefone?.trim()) return "Telefone é obrigatório.";
  if (!body.morada?.trim()) return "Morada é obrigatória.";
  if (!body.cidade?.trim()) return "Cidade é obrigatória.";
  if (!body.codigoPostal?.trim()) return "Código postal é obrigatório.";
  if (!body.pais?.trim()) return "País é obrigatório.";
  return null;
}

// Remove tags HTML/scripts de uma string de entrada livre (ex: notas de
// encomenda, comentários) antes de guardar na base de dados.
export function sanitizeString(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}
