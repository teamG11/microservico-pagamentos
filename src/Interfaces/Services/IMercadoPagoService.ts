import { Pagamento } from "../../Domain/Entities/Pagamento";

export interface IMercadoPagoService {
  createAsync(valor: number, idPedido: number): Promise<Pagamento>;
  findStatusByIdAsync(paymentId: number): Promise<string>;
}
