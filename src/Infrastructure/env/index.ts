import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(7001),
  DATABASE_URL: z.string(),
  TOKEN_MERCADO_PAGO_DEV: z.string(),
  MICROSERVICO_OPERACAO_URL: z.string().url(),
  AWS_REGION: z.string(),
  AWS_ENDPOINT: z.string(),
  PEDIDO_QUEUE_URL: z.string(),
  PAGAMENTO_QUEUE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Variáveis de ambiente inválidas", _env.error.format());

  throw new Error("Variáveis de ambiente inválidas");
}

export const env = _env.data;
