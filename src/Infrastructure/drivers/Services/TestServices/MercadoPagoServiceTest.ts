import { ApiError } from "@/Application/errors/ApiError";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { env } from "@/Infrastructure/env";
import { IMercadoPagoService } from "@/Interfaces/Services/IMercadoPagoService";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export default class MercadoPagoServiceTest implements IMercadoPagoService {
  public payments: PaymentResponse[] = [];

  async createAsync(valor: number, idPedido: number): Promise<PaymentResponse> {
    const paymentResponse: PaymentResponse = {
      api_response: { status: 200, headers: ["", [""]] },
      id: 222,
      status: StatusPagamento.aguardando,
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
    };

    this.payments.push(paymentResponse);

    return paymentResponse;
  }

  async findByIdAsync(paymentId: number): Promise<PaymentResponse> {
    const paymentResponse = this.payments.find(
      (payment) => payment.id === paymentId
    );

    if (!paymentResponse) {
      throw new ApiError("Não foi possível consultar o pagamento", 500);
    }

    paymentResponse.status = StatusPagamento.recebido;
    return paymentResponse;
  }
}
