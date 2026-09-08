/**
 * Integração real com a ifthenpay (https://ifthenpay.com) para Multibanco
 * (referência offline, gerada localmente sem chamada à API) e MB WAY
 * (pedido de pagamento pela API, com notificação push real na app).
 *
 * Algoritmo da referência Multibanco offline e nomes dos parâmetros do
 * callback confirmados a partir do SDK PHP oficial da ifthenpay
 * (github.com/ifthenpay/ifthenpay-sdk-php, ficheiros
 * src/Service/MultibancoOfflineService.php e src/Service/WebhookService.php) —
 * validar contra a documentação atual antes de aceitar pagamentos reais.
 *
 * Sem as variáveis de ambiente configuradas, as funções `is*Configured()`
 * devolvem false e o resto do backend usa o gerador simulado em
 * `multibanco.ts` — por isso o checkout continua a funcionar em
 * desenvolvimento sem precisar de conta na ifthenpay.
 */

const MB_ENTITY = process.env.IFTHENPAY_MB_ENTITY;
const MB_SUBENTITY = process.env.IFTHENPAY_MB_SUBENTITY;
const MBWAY_KEY = process.env.IFTHENPAY_MBWAY_KEY;
const ANTI_PHISHING_KEY = process.env.IFTHENPAY_ANTI_PHISHING_KEY;

export function isMultibancoConfigured(): boolean {
  return !!(MB_ENTITY && MB_SUBENTITY);
}

export function isMbwayConfigured(): boolean {
  return !!MBWAY_KEY;
}

const CHK_WEIGHTS = [3, 30, 9, 90, 27, 76, 81, 34, 49, 5, 50, 15, 53, 45, 62, 38, 89, 17, 73, 51];

// Deriva um "seed" numérico estável a partir do id da encomenda (cuid, não
// numérico) — o algoritmo da Multibanco só tem espaço para 4-5 dígitos, por
// isso não dá para usar o cuid diretamente. Duas encomendas diferentes podem,
// em teoria, colidir no mesmo seed (probabilidade baixa para uma loja
// pequena); para grande volume, trocar por um contador sequencial persistido.
function numericSeedFromOrderId(orderId: string, digits: number): string {
  let hash = 0;
  for (const char of orderId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return String(hash % 10 ** digits).padStart(digits, "0");
}

export interface MultibancoPayment {
  entidade: string;
  referencia: string;
}

/**
 * Gera uma referência Multibanco real, sem chamada à API — a ifthenpay
 * atribui uma Entidade + Sub-Entidade dedicadas e o cálculo do dígito de
 * controlo (Módulo 97 com pesos fixos) é feito localmente.
 */
export function generateMultibancoOfflineReference(orderId: string, amount: number): MultibancoPayment {
  if (!MB_ENTITY || !MB_SUBENTITY) {
    throw new Error("IFTHENPAY_MB_ENTITY / IFTHENPAY_MB_SUBENTITY não configurados.");
  }

  const amountCents = Math.round(amount * 100);
  const seedDigits = MB_SUBENTITY.length === 2 ? 5 : 4;
  const seed = numericSeedFromOrderId(orderId, seedDigits);

  const chkStr =
    MB_ENTITY.padStart(5, "0") +
    MB_SUBENTITY.padStart(MB_SUBENTITY.length === 2 ? 2 : 3, "0") +
    seed +
    String(amountCents).padStart(8, "0");

  let chkVal = 0;
  for (let i = 0; i < 20; i++) {
    const digit = Number(chkStr[19 - i]);
    chkVal += (digit % 10) * CHK_WEIGHTS[i];
  }
  chkVal %= 97;
  const chkDigits = String(98 - chkVal).padStart(2, "0");

  return { entidade: MB_ENTITY, referencia: `${MB_SUBENTITY}${seed}${chkDigits}` };
}

export interface MbwayResult {
  ok: boolean;
  requestId?: string;
  message: string;
}

/**
 * Pede um pagamento MB WAY real — a ifthenpay envia de imediato uma
 * notificação push para a app MB WAY associada a `mobileNumber`, que o
 * cliente tem ~4 minutos para aprovar. A confirmação chega pelo callback
 * (ver `verifyIfthenpayCallback`) ou pode ser consultada via `getMbwayStatus`.
 */
export async function requestMbwayPayment(
  orderId: string,
  amount: number,
  mobileNumber: string,
  email?: string
): Promise<MbwayResult> {
  if (!MBWAY_KEY) throw new Error("IFTHENPAY_MBWAY_KEY não configurado.");

  const res = await fetch("https://api.ifthenpay.com/spg/payment/mbway", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mbWayKey: MBWAY_KEY,
      orderId,
      amount: amount.toFixed(2),
      mobileNumber,
      email,
      description: "Luxury Hair Portugal",
    }),
  });

  const json = await res.json();

  if (json.Status === "000") {
    return { ok: true, requestId: String(json.RequestId), message: "Pedido enviado para a app MB WAY." };
  }
  return { ok: false, message: String(json.Message ?? "Não foi possível iniciar o pagamento MB WAY.") };
}

export async function getMbwayStatus(requestId: string): Promise<"pendente" | "pago" | "recusado" | "expirado" | "desconhecido"> {
  if (!MBWAY_KEY) throw new Error("IFTHENPAY_MBWAY_KEY não configurado.");

  const res = await fetch(
    `https://api.ifthenpay.com/spg/payment/mbway/status?${new URLSearchParams({ mbWayKey: MBWAY_KEY, requestId })}`
  );
  const json = await res.json();

  switch (json.Status) {
    case "123":
      return "pendente";
    case "000":
      return "pago";
    case "020":
      return "recusado";
    case "101":
      return "expirado";
    default:
      return "desconhecido";
  }
}

export interface IfthenpayCallbackParams {
  oid: string;
  val: string;
  tid?: string;
  ref?: string;
  apk: string;
}

/**
 * Valida o callback que a ifthenpay chama quando um pagamento é confirmado
 * — compara o valor, o id da encomenda e (para Multibanco) a referência com
 * os dados guardados, e exige que a "anti-phishing key" corresponda à
 * configurada no backoffice da ifthenpay.
 */
export function verifyIfthenpayCallback(
  params: IfthenpayCallbackParams,
  expected: { orderId: string; amount: number; reference?: string; transactionId?: string }
): boolean {
  if (!ANTI_PHISHING_KEY || params.apk !== ANTI_PHISHING_KEY) return false;
  if (params.oid !== expected.orderId) return false;
  if (params.val !== expected.amount.toFixed(2)) return false;
  // Multibanco compara a referência; MB WAY compara o id da transação
  // (guardado em `referencia`, ver requestMbwayPaymentForOrder).
  if (expected.reference && params.ref !== expected.reference) return false;
  if (expected.transactionId && params.tid !== expected.transactionId) return false;
  return true;
}
