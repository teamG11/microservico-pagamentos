import { RegistroNaoEncontradoError } from "@/Application/errors/RegistroNaoEncontradoError";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";

interface IRequest {
  paymentId: number;
}

export class AtualizaSituacaoPagamentoUseCase {
  constructor(
    private mercadoPagoGateway: IMercadoPagoGateway,
    private pagamentoGateway: IPagamentoGateway
  ) {}

  async executarAsync({ paymentId }: IRequest): Promise<void> {
    const paymentResponse = await this.mercadoPagoGateway.findByIdAsync(
      paymentId
    );

    if (!paymentResponse || !paymentResponse.external_reference) {
      throw new RegistroNaoEncontradoError();
    }

    const pagamento = await this.pagamentoGateway.findByIdPedidoAsync(
      parseInt(paymentResponse.external_reference)
    );

    if (paymentResponse.status != "") {
      const { idPedido, paymentStatus } = pagamento;
      await this.pagamentoGateway.updateStatusAsync(idPedido, paymentStatus);
    }
  }
}
