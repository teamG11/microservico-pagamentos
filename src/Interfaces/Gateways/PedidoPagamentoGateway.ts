import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";

export interface IPedidoPagamentoGateway {
  createAsync(pedidoPagamento: PedidoPagamento): Promise<PedidoPagamento>;
}

export default class PedidoPagamentoGateway implements IPedidoPagamentoGateway {
  constructor(private pedidoPagamentoRepository: IPedidoPagamentoGateway) {}

  createAsync(pedidoPagamento: PedidoPagamento): Promise<PedidoPagamento> {
    return this.pedidoPagamentoRepository.createAsync(pedidoPagamento);
  }
}
