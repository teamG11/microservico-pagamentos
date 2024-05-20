import { Pagamento } from "../../Domain/Entities/Pagamento";

export interface IPagamentoRepository {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
  findByIdPedidoAsync(idPedido: number): Promise<Pagamento | null>;
  updateStatusAsync(
    idPedido: number,
    status: string
  ): Promise<Pagamento | null>;
}
