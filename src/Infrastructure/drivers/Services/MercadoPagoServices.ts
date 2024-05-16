import { ApiError } from "@/Application/errors/ApiError";
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

    if (!paymentResponse.id || !paymentResponse.status) {
      throw new ApiError("Dados inválidos", 500);
    }

    const pagamento = new Pagamento(
      paymentResponse.id,
      paymentResponse.status,
      JSON.stringify(request),
      JSON.stringify(paymentResponse)
    );

    return pagamento;
  }

  async findStatusByIdAsync(paymentId: number): Promise<string> {
    const response = await mercadoPagoPagamentos.get({
      id: paymentId,
      requestOptions: {
        idempotencyKey: uuidv4(),
      },
    });

    const paymentStatus = response.status;

    if (!paymentStatus) {
      throw new ApiError("Não foi possível consultar o status", 500);
    }

    return paymentStatus;
  }
}
