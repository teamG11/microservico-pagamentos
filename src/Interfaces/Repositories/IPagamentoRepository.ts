import { Pagamento } from "../../Domain/Entities/Pagamento";

export interface IPagamentoRepository {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
  findByIdAsync(idPedido: number): Promise<Pagamento>;
  updateStatusAsync(idPedido: number, status: string): Promise<Pagamento>;
}
