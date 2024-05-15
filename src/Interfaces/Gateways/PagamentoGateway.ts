import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";

export interface IPagamentoGateway {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
}

export default class PagamentoGateway implements IPagamentoGateway {
  constructor(private pagamentoRepository: IPagamentoRepository) {}

  createAsync(pagamento: Pagamento): Promise<Pagamento> {
    return this.pagamentoRepository.createAsync(pagamento);
  }
}
