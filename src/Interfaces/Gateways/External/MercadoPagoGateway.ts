import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { IMercadoPagoService } from "../../Services/IMercadoPagoService";

export interface IMercadoPagoGateway {
  createAsync(valor: number, idPedido: number): Promise<Pagamento>;
  findByIdAsync(paymentId: number): Promise<PaymentResponse>;
}

export default class MercadoPagoGateway implements IMercadoPagoGateway {
  constructor(private mercadoPagoService: IMercadoPagoService) {}

  async createAsync(valor: number, idPedido: number): Promise<Pagamento> {
    const paymentResponse = await this.mercadoPagoService.createAsync(
      valor,
      idPedido
    );

    const paymentStatus = paymentResponse.status ?? StatusPagamento.aguardando;

    return new Pagamento(
      idPedido,
      valor,
      Number(paymentResponse.id),
      paymentStatus,
      JSON.stringify(paymentResponse)
    );
  }

  findByIdAsync(paymentId: number): Promise<PaymentResponse> {
    return this.mercadoPagoService.findByIdAsync(paymentId);
  }
}
