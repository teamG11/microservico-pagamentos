import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";

export interface IPedidoPagamentoRepository {
  createAsync(pedidoPagamento: PedidoPagamento): Promise<PedidoPagamento>;
}
