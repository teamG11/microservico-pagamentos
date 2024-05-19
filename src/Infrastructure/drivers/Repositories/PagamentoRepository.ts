import { DadosInvalidosError } from "@/Application/errors/DadosInvalidosError";
import { RegistroNaoEncontradoError } from "@/Application/errors/RegistroNaoEncontradoError";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class pagamentoRepository implements IPagamentoRepository {
  async createAsync(data: Pagamento): Promise<Pagamento> {
    if (!data.paymentId || !data.paymentStatus) {
      throw new DadosInvalidosError();
    }

    const createdPagamento = await prisma.pagamento.create({
      data: {
        idPedido: data.idPedido,
        valor: data.valor,
        paymentId: data.paymentId,
        paymentStatus: data.paymentStatus,
        responsePayload: JSON.stringify(data.responsePayload),
      },
    });

    createdPagamento.responsePayload = JSON.parse(
      createdPagamento.responsePayload as string
    );

    return createdPagamento;
  }

  async findByIdAsync(idPedido: number): Promise<Pagamento> {
    const pagamento = await prisma.pagamento.findUnique({
      where: { idPedido: idPedido },
    });

    if (!pagamento) {
      throw new RegistroNaoEncontradoError();
    }

    return pagamento;
  }

  async updateStatusAsync(
    idPedido: number,
    status: string
  ): Promise<Pagamento> {
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
