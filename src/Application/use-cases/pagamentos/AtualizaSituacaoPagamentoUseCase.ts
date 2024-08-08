import { RegistroNaoEncontradoError } from "@/Application/errors/RegistroNaoEncontradoError";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { StatusPedido } from "@/Domain/Enums/StatusPedido";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoQueue } from "@/Interfaces/Services/IPedidoQueue";

interface IRequest {
  paymentId: number;
}

export class AtualizaSituacaoPagamentoUseCase {
  constructor(
    private mercadoPagoGateway: IMercadoPagoGateway,
    private pagamentoGateway: IPagamentoGateway,
    private pedidoQueue: IPedidoQueue
  ) {}

  async executarAsync({ paymentId }: IRequest): Promise<void> {
    const paymentResponse = await this.mercadoPagoGateway.findByIdAsync(
      paymentId
    );

    console.log("paymentResponse", paymentResponse);
    if (!paymentResponse || !paymentResponse.external_reference) {
      throw new RegistroNaoEncontradoError();
    }

    const pagamento = await this.pagamentoGateway.findByIdPedidoAsync(
      parseInt(paymentResponse.external_reference)
    );

    if (paymentResponse.status != "") {
      const { idPedido, paymentStatus } = pagamento;
      await this.pagamentoGateway.updateStatusAsync(idPedido, paymentStatus);

      this.pedidoQueue.sendPedidoMessage({
        id: idPedido.toString(),
        status:
          paymentStatus == "approved"
            ? StatusPedido.em_preparacao
            : StatusPedido.recebido,
        statusPagamento:
          paymentStatus == "approved"
            ? StatusPagamento.recebido
            : StatusPagamento.recusado,
      });
    }
  }
}
