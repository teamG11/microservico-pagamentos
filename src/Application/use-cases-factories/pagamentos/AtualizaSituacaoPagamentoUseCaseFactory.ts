import { AtualizaSituacaoPagamentoUseCase } from "@/Application/use-cases/pagamentos/AtualizaSituacaoPagamentoUseCase";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";

export function AtualizaSituacaoPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway
) {
  const buscaPagamentoUseCase = new AtualizaSituacaoPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway
  );

  return buscaPagamentoUseCase;
}
