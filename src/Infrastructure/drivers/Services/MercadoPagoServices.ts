import { ApiError } from "@/Application/errors/ApiError";
import { env } from "@/Infrastructure/env";
import { mercadoPagoPagamentos } from "@/Infrastructure/lib/mercadoPago";
import { IMercadoPagoService } from "@/Interfaces/Services/IMercadoPagoService";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { PaymentCreateData } from "mercadopago/dist/clients/payment/create/types";
import { v4 as uuidv4 } from "uuid";

export default class MercadoPagoService implements IMercadoPagoService {
  async createAsync(valor: number, idPedido: number): Promise<PaymentResponse> {
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

    if (!paymentResponse.id || !paymentResponse.status) {
      throw new ApiError("Dados inválidos", 500);
    }

    return paymentResponse;
  }

  async findByIdAsync(paymentId: number): Promise<PaymentResponse> {
    const response = await mercadoPagoPagamentos.get({
      id: paymentId,
      requestOptions: {
        idempotencyKey: uuidv4(),
      },
    });

    if (!response) {
      throw new ApiError("Não foi possível consultar o pagamento", 500);
    }

    return response;
  }
}
