import { ApiError } from "@/Application/errors/ApiError";
import { Pagamento } from "@/Domain/Entities/Pagamento";
import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoPagamentoGateway } from "@/Interfaces/Gateways/PedidoPagamentoGateway";
interface CriaPagamentoRequest {
  idPedido: number;
  valor: number;
  requestPayload: string;
  responsePayload: string;
}
interface CriaPagamentoResponse {
  pagamento: Pagamento;
  pedidoPagamento: PedidoPagamento;
}
export class CriaPagamentoUseCase {
  constructor(
    private mercadoPagoGateway: IMercadoPagoGateway,
    private pagamentoGateway: IPagamentoGateway,
    private pedidoPagamentoGateway: IPedidoPagamentoGateway
  ) {}

  async executarAsync({
    idPedido,
    valor,
  }: CriaPagamentoRequest): Promise<CriaPagamentoResponse> {
    const Pagamento = await this.mercadoPagoGateway.createAsync(
      valor,
      idPedido
    );

    const pagamentoCriado = await this.pagamentoGateway.createAsync(Pagamento);

    if (!pagamentoCriado.id) {
      throw new ApiError("Não foi possível realizar o pagamento", 500);
    }

    const pedidoPagamentoCriado = await this.pedidoPagamentoGateway.createAsync(
      new PedidoPagamento(
        idPedido,
        valor,
        StatusPagamento.aguardando,
        pagamentoCriado.id
      )
    );

    return {
      pagamento: pagamentoCriado,
      pedidoPagamento: pedidoPagamentoCriado,
    };
  }
}
