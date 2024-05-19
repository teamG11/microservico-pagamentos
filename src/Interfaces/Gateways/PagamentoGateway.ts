import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";

export interface IPagamentoGateway {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
  findByIdAsync(idPedido: number): Promise<Pagamento>;
  updateStatusAsync(idPedido: number, status: string): Promise<Pagamento>;
}

export default class PagamentoGateway implements IPagamentoGateway {
  constructor(private pagamentoRepository: IPagamentoRepository) {}

  createAsync(pagamento: Pagamento): Promise<Pagamento> {
    return this.pagamentoRepository.createAsync(pagamento);
  }

  findByIdAsync(idPedido: number): Promise<Pagamento> {
    return this.pagamentoRepository.findByIdAsync(idPedido);
  }

  updateStatusAsync(idPedido: number, status: string): Promise<Pagamento> {
    return this.pagamentoRepository.updateStatusAsync(idPedido, status);
  }
}
