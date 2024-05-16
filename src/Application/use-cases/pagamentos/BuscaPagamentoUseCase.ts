import { Pagamento } from "@/Domain/Entities/Pagamento";
import { PedidoPagamento } from "@/Domain/Entities/PedidoPagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoPagamentoGateway } from "@/Interfaces/Gateways/PedidoPagamentoGateway";

interface BuscaPagamentoRequest {
  idPedido: number;
}

interface BuscaPagamentoResponse {
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
  }: BuscaPagamentoRequest): Promise<BuscaPagamentoResponse> {
    const Pagamento = await this.mercadoPagoGateway.createAsync(idPedido);
    const pagamentoCriado = await this.pagamentoGateway.createAsync(Pagamento);

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
