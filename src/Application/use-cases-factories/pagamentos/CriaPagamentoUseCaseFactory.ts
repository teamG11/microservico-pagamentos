import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { CriaPagamentoUseCase } from "../../use-cases/pagamentos/CriaPagamentoUseCase";

export function CriaPagamentoUseCaseFactory(
  pagamentoGateway: IPagamentoGateway
) {
  const criaPagamento = new CriaPagamentoUseCase(pagamentoGateway);

  return criaPagamento;
}
