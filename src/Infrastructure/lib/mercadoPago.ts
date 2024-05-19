import { MercadoPagoConfig, Payment } from "mercadopago";
import { env } from "../env";

const mercadoPagoPagamentos = new Payment(
  new MercadoPagoConfig({
    accessToken: env.TOKEN_MERCADO_PAGO_DEV,
  })
);

export { mercadoPagoPagamentos };
