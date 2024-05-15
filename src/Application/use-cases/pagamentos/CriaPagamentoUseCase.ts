import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
interface CriaPagamentoRequest {
  requestPayload: string;
  responsePayload: string;
  webhookResponsePayload?: string | null;
}
interface CriaPagamentoResponse {
  pagamento: Pagamento;
}
export class CriaPagamentoUseCase {
  constructor(private pagamentoGateway: IPagamentoGateway) {}

  async executarAsync({
    requestPayload,
    responsePayload,
    webhookResponsePayload = null,
  }: CriaPagamentoRequest): Promise<CriaPagamentoResponse> {
    const pagamento = new Pagamento(
      requestPayload,
      responsePayload,
      webhookResponsePayload
    );

    const pagamentoSalvo = await this.pagamentoGateway.createAsync(pagamento);
    return { pagamento: pagamentoSalvo };
  }
}
