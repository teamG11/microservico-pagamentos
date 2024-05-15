import { Pagamento } from "../../Domain/Entities/Pagamento";

export interface IMercadoPagoService {
  createAsync(valor: number, idPedido: number): Promise<Pagamento>;
  findByIdAsync(id: string): Promise<Pagamento | null>;
}
