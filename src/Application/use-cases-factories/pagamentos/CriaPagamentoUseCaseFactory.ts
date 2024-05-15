import { IMercadoPagoGateway } from "@/Interfaces/Gateways/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoPagamentoGateway } from "@/Interfaces/Gateways/PedidoPagamentoGateway";
import { CriaPagamentoUseCase } from "../../use-cases/pagamentos/CriaPagamentoUseCase";

export function CriaPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway,
  pedidoPagamentoGateway: IPedidoPagamentoGateway
) {
  const criaPagamento = new CriaPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway,
    pedidoPagamentoGateway
  );

  return criaPagamento;
}
