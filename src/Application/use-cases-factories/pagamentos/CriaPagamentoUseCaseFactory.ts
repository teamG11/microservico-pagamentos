import { IMercadoPagoGateway } from "@/Interfaces/Gateways/External/MercadoPagoGateway";
import { IPagamentoGateway } from "@/Interfaces/Gateways/PagamentoGateway";
import { IPedidoQueue } from "@/Interfaces/Services/IPedidoQueue";
import { CriaPagamentoUseCase } from "../../use-cases/pagamentos/CriaPagamentoUseCase";

export function CriaPagamentoUseCaseFactory(
  mercadoPagoGateway: IMercadoPagoGateway,
  pagamentoGateway: IPagamentoGateway,
  pedidoQueue: IPedidoQueue
) {
  const criaPagamentoUseCase = new CriaPagamentoUseCase(
    mercadoPagoGateway,
    pagamentoGateway,
    pedidoQueue
  );

  return criaPagamentoUseCase;
}
