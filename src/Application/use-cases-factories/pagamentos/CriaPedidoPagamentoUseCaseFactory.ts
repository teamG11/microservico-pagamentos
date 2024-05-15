import { CriaPedidoPagamentoUseCase } from "@/Application/use-cases/pagamentos/CriaPedidoPagamentoUseCase";
import { IPedidoPagamentoGateway } from "@/Interfaces/Gateways/PedidoPagamentoGateway";

export function CriaPedidoPagamentoUseCaseFactory(
  pedidoPagamentoGateway: IPedidoPagamentoGateway
) {
  const criaPedidoPagamento = new CriaPedidoPagamentoUseCase(
    pedidoPagamentoGateway
  );

  return criaPedidoPagamento;
}
