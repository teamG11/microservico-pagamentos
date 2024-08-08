import { AtualizaSituacaoPagamentoUseCase } from "@/Application/use-cases/pagamentos/AtualizaSituacaoPagamentoUseCase";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoQueue } from "@/Interfaces/Services/IPedidoQueue";

export function AtualizaSituacaoPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway,
  pedidoQueue: IPedidoQueue
) {
  const buscaPagamentoUseCase = new AtualizaSituacaoPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway,
    pedidoQueue
  );

  return buscaPagamentoUseCase;
}
