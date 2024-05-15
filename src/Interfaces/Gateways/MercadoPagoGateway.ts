import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IMercadoPagoService } from "../Services/IMercadoPagoService";

export interface IMercadoPagoGateway {
  createAsync(valor: number, idPedido: number): Promise<Pagamento>;
  findByIdAsync(id: string): Promise<Pagamento | null>;
}

export default class MercadoPagoGateway implements IMercadoPagoGateway {
  constructor(private mercadoPagoService: IMercadoPagoService) {}

  createAsync(valor: number, idPedido: number): Promise<Pagamento> {
    return this.mercadoPagoService.createAsync(valor, idPedido);
  }

  findByIdAsync(id: string): Promise<Pagamento | null> {
    return this.mercadoPagoService.findByIdAsync(id);
  }
}
