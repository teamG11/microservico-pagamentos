import { BuscaPagamentoUseCase } from "@/Application/use-cases/pagamentos/BuscaPagamentoUseCase";
import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";

export function BuscaPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway
) {
  const buscaPagamentoUseCase = new BuscaPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway
  );

  return buscaPagamentoUseCase;
}
