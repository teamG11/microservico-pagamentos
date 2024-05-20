import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class PagamentoRepositoryTest implements IPagamentoRepository {
  public pagamentos: Pagamento[] = [];

  async updateStatusAsync(
    idPedido: number,
    status: string
  ): Promise<Pagamento | null> {
    const produto = this.pagamentos.find(
      (produto) => produto.idPedido === idPedido
    );

    if (!produto) {
      return null;
    }

    produto.paymentStatus = status;

    return produto;
  }

  async createAsync(data: Pagamento): Promise<Pagamento> {
    const pagamento: Pagamento = {
      idPedido: data.idPedido,
      valor: data.valor,
      paymentId: data.paymentId,
      paymentStatus: data.paymentStatus,
      responsePayload: data.responsePayload,
      webhookResponsePayload: data.webhookResponsePayload,
    };

    this.pagamentos.push(pagamento);

    return pagamento;
  }

  async findByIdPedidoAsync(idPedido: number): Promise<Pagamento | null> {
    const pagamento = this.pagamentos.find(
      (pagamento) => pagamento.idPedido === idPedido
    );

    return pagamento ?? null;
  }
}
