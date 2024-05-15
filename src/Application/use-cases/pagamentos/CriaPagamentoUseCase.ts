import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";

export class CriaPagamentoUseCase {
  constructor(private pagamentoGateway: IPagamentoGateway) {}

  async executarAsync(id_cliente: number): Promise<Pagamento> {
    const pagamento = new Pagamento({
      id_cliente,
      valor_final: null,
      tipo_pagamento: null,
      status: null,
      status_pagamento: StatusPagamento.aguardando,
    });

    const pagamentoSalvo = await this.pagamentoGateway.createAsync(pagamento);
    return pagamentoSalvo;
  }
}
