import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { StatusPedido } from "@/Domain/Enums/StatusPedido";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoQueue } from "@/Interfaces/Services/IPedidoQueue";
interface IRequest {
  idPedido: number;
  valor: number;
}
interface IResponse {
  pagamento: Pagamento;
}
export class CriaPagamentoUseCase {
  constructor(
    private mercadoPagoGateway: IMercadoPagoGateway,
    private pagamentoGateway: IPagamentoGateway,
    private pedidoQueue: IPedidoQueue
  ) {}

  async executarAsync({ idPedido, valor }: IRequest): Promise<IResponse> {
    const pagamento = await this.mercadoPagoGateway.createAsync(
      valor,
      idPedido
    );

    const pagamentoCriado = await this.pagamentoGateway.createAsync(pagamento);

    this.pedidoQueue.sendPedidoMessage({
      id: idPedido.toString(),
      status: StatusPedido.recebido,
      statusPagamento: StatusPagamento.aguardando,
    });

    return { pagamento: pagamentoCriado };
  }
}
