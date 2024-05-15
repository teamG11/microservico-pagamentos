import { ApiError } from "@/Application/errors/ApiError";
import { CriaPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/CriaPagamentoUseCaseFactory";
import { CriaPedidoPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/CriaPedidoPagamentoUseCaseFactory";
import { StatusPagamento } from "@/Domain/Enums/StatusPagamento";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";
import { IPedidoPagamentoRepository } from "../Repositories/IPedidoPagamentoRepository";

class PagamentoController {
  constructor(
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

      const requestMercadoPago = { id: 123 };
      const responseMercadoPago = { id: 123 };

      const criaPagamento = CriaPagamentoUseCaseFactory(
        this.pagamentoRepository
      );

      const { pagamento } = await criaPagamento.executarAsync({
        requestPayload: JSON.stringify(requestMercadoPago),
        responsePayload: JSON.stringify(responseMercadoPago),
      });

      const criaPedidoPagamento = CriaPedidoPagamentoUseCaseFactory(
        this.pedidoPagamentoRepository
      );

      if (!pagamento.id) {
        throw new ApiError("Não foi possível realizar o pagamento", 500);
      }

      const pedidoPagamento = await criaPedidoPagamento.executarAsync({
        idPagamento: pagamento.id,
        idPedido,
        status_pagamento: StatusPagamento.aguardando,
        valor,
      });

      return response.status(201).json({
        pagamento: {
          id: pagamento.id,
          payload: {
            request: JSON.parse(pagamento.requestPayload),
            response: JSON.parse(pagamento.responsePayload),
            webhook: JSON.parse(pagamento.webhookResponsePayload as string),
          },
        },
        pedidoPagamento,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { PagamentoController };
