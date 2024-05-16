import { CriaPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/CriaPagamentoUseCaseFactory";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import MercadoPagoGateway from "../Gateways/MercadoPagoGateway";
import PagamentoGateway from "../Gateways/PagamentoGateway";
import PedidoPagamentoGateway from "../Gateways/PedidoPagamentoGateway";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";
import { IPedidoPagamentoRepository } from "../Repositories/IPedidoPagamentoRepository";
import { IMercadoPagoService } from "../Services/IMercadoPagoService";

class PagamentoController {
  constructor(
    private mercadoPagoService: IMercadoPagoService,
    private pagamentoRepository: IPagamentoRepository,
    private pedidoPagamentoRepository: IPedidoPagamentoRepository
  ) {}

  async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const dados = request.body;

      const createBodySchema = z.object({
        id_pedido: z.number(),
        valor: z.number(),
      });

      const { id_pedido: idPedido, valor } = createBodySchema.parse(dados);

      const criaPagamento = CriaPagamentoUseCaseFactory(
        new MercadoPagoGateway(this.mercadoPagoService),
        new PagamentoGateway(this.pagamentoRepository),
        new PedidoPagamentoGateway(this.pedidoPagamentoRepository)
      );

      const { pagamento, pedidoPagamento } = await criaPagamento.executarAsync({
        idPedido,
        valor,
      });

      return response.status(201).json({
        pagamento: {
          id: pagamento.id,
          payload: {
            request: JSON.parse(pagamento.requestPayload),
            response: JSON.parse(pagamento.responsePayload),
          },
        },
        pedidoPagamento,
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id_pedido: z.string().transform((value) => Number(value)),
      });
      const { id_pedido: pedidoId } = paramsSchema.parse(request.params);

      const buscarPedido = BuscarPedidoUseCaseFactory();

      const pedido = await buscarPedido.executarAsync(pedidoId);

      if (pedido) {
        return response.status(200).json(pedido);
      } else {
        return response.status(404).send("Pedido não encontrado.");
      }
    } catch (error) {
      next(error);
    }
  }
}

export { PagamentoController };
