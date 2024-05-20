import { RegistroNaoEncontradoError } from "@/Application/errors/RegistroNaoEncontradoError";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class PagamentoRepository implements IPagamentoRepository {
  async createAsync(pagamento: Pagamento): Promise<Pagamento> {
    const createdPagamento = await prisma.pagamento.create({
      data: pagamento,
    });

    createdPagamento.responsePayload = JSON.parse(
      createdPagamento.responsePayload as string
    );

    return createdPagamento;
  }

  async findByIdPedidoAsync(idPedido: number): Promise<Pagamento | null> {
    const pagamento = await prisma.pagamento.findUnique({
      where: { idPedido: idPedido },
    });

    return pagamento;
  }

  async updateStatusAsync(
    idPedido: number,
    status: string
  ): Promise<Pagamento | null> {
    const pagamento = await prisma.pagamento.findUnique({
      where: { idPedido: idPedido },
    });

    if (!pagamento) {
      throw new RegistroNaoEncontradoError();
    }

    const pagamentoUpdated = await prisma.pagamento.update({
      where: { id: pagamento.id },
      data: { paymentStatus: status },
    });

    return pagamentoUpdated;
  }
}
