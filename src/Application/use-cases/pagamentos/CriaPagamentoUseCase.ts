import { Pagamento } from "@/Domain/Entities/Pagamento";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
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
    private pagamentoGateway: IPagamentoGateway
  ) {}

  async executarAsync({ idPedido, valor }: IRequest): Promise<IResponse> {
    const pagamento = await this.mercadoPagoGateway.createAsync(
      valor,
      idPedido
    );

    const pagamentoCriado = await this.pagamentoGateway.createAsync(pagamento);
    return { pagamento: pagamentoCriado };
  }
}
