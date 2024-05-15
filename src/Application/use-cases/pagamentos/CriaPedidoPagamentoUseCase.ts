import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";
import { IPedidoPagamentoGateway } from "@/Interfaces/Gateways/PedidoPagamentoGateway";

interface CriaPedidoPagamentoRequest {
  idPedido: number;
  idPagamento: string;
  status_pagamento: string;
  valor: number;
}

interface CriaPedidoPagamentoResponse {
  pagamento: PedidoPagamento;
}

export class CriaPedidoPagamentoUseCase {
  constructor(private pedidoPagamentoGateway: IPedidoPagamentoGateway) {}

  async executarAsync(
    pagamento: CriaPedidoPagamentoRequest
  ): Promise<CriaPedidoPagamentoResponse> {
    const pagamentoCriado = await this.pedidoPagamentoGateway.createAsync(
      new PedidoPagamento(
        pagamento.idPedido,
        pagamento.valor,
        pagamento.status_pagamento,
        pagamento.idPagamento
      )
    );

    return { pagamento: pagamentoCriado };
  }
}
