import { ApiError } from "@/Application/errors/ApiError";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class PagamentoRepository implements IPagamentoRepository {
  async createAsync(data: Pagamento): Promise<Pagamento> {
    if (!data.paymentId || !data.paymentStatus) {
      throw new ApiError("Dados inválidos", 500);
    }

    const createdPagamento = await prisma.pagamento.create({
      data: {
        requestPayload: JSON.stringify(data.requestPayload),
        responsePayload: JSON.stringify(data.responsePayload),
        paymentId: data.paymentId,
        paymentStatus: data.paymentStatus,
      },
    });

    createdPagamento.requestPayload = JSON.parse(
      createdPagamento.requestPayload as string
    );

    createdPagamento.responsePayload = JSON.parse(
      createdPagamento.responsePayload as string
    );

    return createdPagamento;
  }
}
