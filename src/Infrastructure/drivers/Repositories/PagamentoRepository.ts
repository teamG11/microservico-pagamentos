import { Pagamento } from "@/Domain/Entities/Pagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class PagamentoRepository implements IPagamentoRepository {
  async createAsync(data: Pagamento): Promise<Pagamento> {
    const createdPagamento = await prisma.pedido.create({ data });
    return createdPagamento;
  }
}
