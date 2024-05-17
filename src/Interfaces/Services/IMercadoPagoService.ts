import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export interface IMercadoPagoService {
  createAsync(valor: number, idPedido: number): Promise<PaymentResponse>;
  findByIdAsync(paymentId: number): Promise<PaymentResponse>;
}
