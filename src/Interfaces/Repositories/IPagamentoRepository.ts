import { Pagamento } from "../../Domain/Entities/Pagamento";

export interface IPagamentoRepository {
  createAsync(pagamento: Pagamento): Promise<Pagamento>;
}
