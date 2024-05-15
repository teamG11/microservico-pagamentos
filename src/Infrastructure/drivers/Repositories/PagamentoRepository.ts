import { Pagamento } from "@/Domain/Entities/Pagamento";
import { prisma } from "@/Infrastructure/lib/prisma";
import { IPagamentoRepository } from "@/Interfaces/Repositories/IPagamentoRepository";

export default class PagamentoRepository implements IPagamentoRepository {
  async createAsync(data: Pagamento): Promise<Pagamento> {
    console.log(data);

    const createdPagamento = await prisma.pagamento.create({
      data: {
        requestPayload: JSON.stringify(data.requestPayload),
        responsePayload: JSON.stringify(data.responsePayload),
      },
    });

    const request = JSON.parse(createdPagamento.requestPayload as string);
    const response = JSON.parse(createdPagamento.responsePayload as string);
    const webhookResponse = JSON.parse(
      createdPagamento.webhookResponsePayload as string
    );

    const responsePagamento = new Pagamento(request, response, webhookResponse);
    responsePagamento.id = createdPagamento.id;

    console.log("createdPagamento: ", responsePagamento);

    return responsePagamento;
  }
}
