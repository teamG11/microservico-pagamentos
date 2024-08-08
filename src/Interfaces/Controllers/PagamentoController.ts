import { AtualizaSituacaoPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/AtualizaSituacaoPagamentoUseCaseFactory";
import { BuscaPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/BuscaPagamentoUseCaseFactory";
import { CriaPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/CriaPagamentoUseCaseFactory";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { StatusPedido } from "@/Domain/Enums/StatusPedido";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import MercadoPagoGateway from "../Gateways/External/MercadoPagoGateway";
import PagamentoGateway from "../Gateways/PagamentoGateway";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";
import { IMercadoPagoService } from "../Services/IMercadoPagoService";
import { IPedidoQueue } from "../Services/IPedidoQueue";

class PagamentoController {
  constructor(
    private mercadoPagoService: IMercadoPagoService,
    private pagamentoRepository: IPagamentoRepository,
    private pedidoQueue: IPedidoQueue
  ) {}

  async criar(idPedido: number, valor: number) {
    let status = StatusPedido.recebido;
    let statusPagamento = StatusPagamento.aguardando;

    try {
      const criaPagamento = CriaPagamentoUseCaseFactory(
        new MercadoPagoGateway(this.mercadoPagoService),
        new PagamentoGateway(this.pagamentoRepository),
        this.pedidoQueue
      );

      await criaPagamento.executarAsync({
        idPedido,
        valor,
      });

      this.pedidoQueue.sendPedidoMessage({
        id: idPedido.toString(),
        status: StatusPedido.recebido,
        statusPagamento: StatusPagamento.aguardando,
      });
    } catch (error) {
      status = StatusPedido.recebido;
      statusPagamento = StatusPagamento.recusado;
    }

    this.pedidoQueue.sendPedidoMessage({
      id: idPedido.toString(),
      status: status,
      statusPagamento: statusPagamento,
    });
  }

  async buscarPorId(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id_pedido: z.string().transform((idPedido) => Number(idPedido)),
      });

      const { id_pedido: idPedido } = paramsSchema.parse(request.params);

      const buscarPedido = BuscaPagamentoUseCaseFactory(
        new MercadoPagoGateway(this.mercadoPagoService),
        new PagamentoGateway(this.pagamentoRepository)
      );

      const pedido = await buscarPedido.executarAsync({ idPedido });
      return response.status(200).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(request: Request, response: Response, next: NextFunction) {
    try {
      const { action, type, id } = z
        .object({
          action: z.string(),
          api_version: z.string(),
          date_created: z.string(),
          id: z.string().transform((value) => Number(value)),
          live_mode: z.boolean(),
          type: z.string(),
          user_id: z.number(),
        })
        .parse(request.body);

      // Só trataremos os retornos de pagamento
      if (action != "payment.update" || type != "payment") {
        return response.status(204);
      }

      const atualizaSituacaoPagamento = AtualizaSituacaoPagamentoUseCaseFactory(
        new MercadoPagoGateway(this.mercadoPagoService),
        new PagamentoGateway(this.pagamentoRepository),
        this.pedidoQueue
      );

      await atualizaSituacaoPagamento.executarAsync({ paymentId: id });

      return response.status(200);
    } catch (error) {
      next(error);
    }
  }
}

export { PagamentoController };
