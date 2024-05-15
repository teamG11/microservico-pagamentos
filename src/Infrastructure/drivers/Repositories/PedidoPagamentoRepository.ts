import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPedidoPagamentoRepository } from "@/Interfaces/Repositories/IPedidoPagamentoRepository";

export default class PedidoPagamentoRepository
  implements IPedidoPagamentoRepository
{
  async createAsync(data: PedidoPagamento): Promise<PedidoPagamento> {
    const createdPedidoPagamento = await prisma.pedidoPagamento.create({
      data: {
        statusPagamento: data.statusPagamento,
        valor: data.valor,
        idPedido: data.idPedido,
        idPagamento: data.idPagamento,
      },
    });

    return createdPedidoPagamento;
  }
}
