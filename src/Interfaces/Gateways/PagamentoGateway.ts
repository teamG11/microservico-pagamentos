import { RegistroNaoEncontradoError } from "@/Application/errors/RegistroNaoEncontradoError";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";

export interface IPagamentoGateway {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
  findByIdPedidoAsync(idPedido: number): Promise<Pagamento>;
  updateStatusAsync(idPedido: number, status: string): Promise<Pagamento>;
}

export default class PagamentoGateway implements IPagamentoGateway {
  constructor(private pagamentoRepository: IPagamentoRepository) {}

  createAsync(pagamento: Pagamento): Promise<Pagamento> {
    return this.pagamentoRepository.createAsync(pagamento);
  }

  async findByIdPedidoAsync(idPedido: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findByIdPedidoAsync(
      idPedido
    );

    if (!pagamento) {
      throw new RegistroNaoEncontradoError();
    }

    return pagamento;
  }

  async updateStatusAsync(
    idPedido: number,
    status: string
  ): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.updateStatusAsync(
      idPedido,
      status
    );

    if (!pagamento) {
      throw new RegistroNaoEncontradoError();
    }

    return pagamento;
  }
}
