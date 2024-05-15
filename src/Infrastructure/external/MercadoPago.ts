import { MercadoPagoConfig, Payment } from "mercadopago";
import { env } from "../env";

const client = new MercadoPagoConfig({ accessToken: env.TOKEN_MERCADO_PAGO });
const payment = new Payment(client);

const req = {
  transaction_amount: 5.5,
  description: "Teste",
  paymentMethodId: "Pix",
  email: "lucas",
  identificationType: "CPF",
  number: "123456",
};

payment
  .create({
    body: {
      transaction_amount: req.transaction_amount,
      description: req.description,
      payment_method_id: req.paymentMethodId,
      payer: {
        email: req.email,
        identification: {
          type: req.identificationType,
          number: req.number,
        },
      },
    },
    requestOptions: { idempotencyKey: "<SOME_UNIQUE_VALUE>" },
  })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
