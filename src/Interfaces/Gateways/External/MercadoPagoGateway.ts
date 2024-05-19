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

    return new Pagamento(
      idPedido,
      valor,
      paymentResponse.id ?? 0,
      paymentResponse.status ?? StatusPagamento.aguardando,
      JSON.stringify(paymentResponse)
    );
  }

  findByIdAsync(paymentId: number): Promise<PaymentResponse> {
    return this.mercadoPagoService.findByIdAsync(paymentId);
  }
}
