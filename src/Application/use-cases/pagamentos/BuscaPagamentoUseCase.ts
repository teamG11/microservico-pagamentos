import { Pagamento } from "@/Domain/Entities/Pagamento";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";

interface IRequest {
  idPedido: number;
}

interface IResponse {
  pagamento: Pagamento;
}

export class BuscaPagamentoUseCase {
  constructor(
    private mercadoPagoGateway: IMercadoPagoGateway,
    private pagamentoGateway: IPagamentoGateway
  ) {}

  async executarAsync({ idPedido }: IRequest): Promise<IResponse> {
    let pagamento = await this.pagamentoGateway.findByIdAsync(idPedido);

    const paymentResponse = await this.mercadoPagoGateway.findByIdAsync(
      pagamento.paymentId
    );

    if (paymentResponse.status != "") {
      const status = StatusPagamento.recebido;
      pagamento = await this.pagamentoGateway.updateStatusAsync(
        idPedido,
        status
      );
    }

    return { pagamento };
  }
}
