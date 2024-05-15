import { Pagamento } from "@/Domain/Entities/Pagamento";
import { env } from "@/Infrastructure/env";
import { mercadoPagoPagamentos } from "@/Infrastructure/lib/mercadoPago";
import { IMercadoPagoService } from "@/Interfaces/Services/IMercadoPagoService";
import { PaymentCreateData } from "mercadopago/dist/clients/payment/create/types";
import { v4 as uuidv4 } from "uuid";

export default class MercadoPagoService implements IMercadoPagoService {
  async createAsync(valor: number, idPedido: number): Promise<Pagamento> {
    const request: PaymentCreateData = {
      body: {
        transaction_amount: valor,
        description: "Pedido de lanche nro " + idPedido,
        payment_method_id: env.NODE_ENV == "dev" ? "pix" : "Pix",
        external_reference: idPedido.toString(),
        payer: {
          email: "financeiro@lanchonete.com",
          identification: {
            type: "CPF",
            number: "28254905045",
          },
        },
      },
      requestOptions: { idempotencyKey: uuidv4() },
    };

    const paymentResponse = await mercadoPagoPagamentos.create(request);

    const pagamento = new Pagamento(
      JSON.stringify(request),
      JSON.stringify(paymentResponse)
    );

    return pagamento;
  }

  findByIdAsync(id: string): Promise<Pagamento | null> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
}
