import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { CriaPagamentoUseCase } from "../../use-cases/pagamentos/CriaPagamentoUseCase";

export function CriaPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway
) {
  const criaPagamentoUseCase = new CriaPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway
  );

  return criaPagamentoUseCase;
}
