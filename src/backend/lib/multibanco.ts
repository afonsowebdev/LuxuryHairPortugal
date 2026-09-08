/**
 * Gerador de referência Multibanco para testes. A estrutura (entidade de 5
 * dígitos + referência de 9 dígitos, com 2 dígitos de verificação calculados
 * por Módulo 97) segue o formato real, mas isto NÃO está ligado à SIBS —
 * para aceitar pagamentos reais é preciso um acordo com um banco ou um PSP
 * (ex: Ifthenpay, EasyPay) que emita referências válidas de verdade.
 */

const VALIDITY_HOURS = 48;

function mod97CheckDigits(base: string): string {
  // ISO 7064 MOD 97-10, como usado na validação de IBAN: junta "00" ao
  // fundo, tira o resto da divisão por 97 e o dígito de controlo é 98
  // menos esse resto (com zero à esquerda se for de um só dígito).
  let remainder = 0;
  for (const digit of `${base}00`) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return String(98 - remainder).padStart(2, "0");
}

export interface MultibancoPayment {
  entidade: string;
  referencia: string;
  valor: number;
  expiraEm: Date;
}

/**
 * Gera uma referência determinística a partir do orderId, para que pedir a
 * mesma encomenda duas vezes (ex: reabrir a página de pagamento) devolva
 * sempre a mesma referência em vez de uma nova a cada pedido.
 */
export function generateReference(valor: number, orderId: string): MultibancoPayment {
  const entidade = process.env.MULTIBANCO_ENTIDADE ?? "11111";

  let seed = 0;
  for (const char of orderId) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  const base = String(seed % 10_000_000).padStart(7, "0");
  const referencia = `${base}${mod97CheckDigits(entidade + base)}`;

  const expiraEm = new Date();
  expiraEm.setHours(expiraEm.getHours() + VALIDITY_HOURS);

  return { entidade, referencia, valor, expiraEm };
}
