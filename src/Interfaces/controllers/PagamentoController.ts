import { CriaPagamentoUseCaseFactory } from "@/Application/use-cases-factories/pagamentos/CriaPagamentoUseCaseFactory";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { IPagamentoRepository } from "../Repositories/IPagamentoRepository";

class PagamentoController {
  constructor(private pagamentoRepository: IPagamentoRepository) {}

  async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const dados = request.body;

      const createBodySchema = z.object({
        id_cliente: z.number(),
      });

      const { id_cliente } = createBodySchema.parse(dados);

      const criaPagamento = CriaPagamentoUseCaseFactory(
        this.pagamentoRepository
      );

      const pagamento = await criaPagamento.executarAsync(id_cliente);

      return response.status(201).json(pagamento);
    } catch (error) {
      next(error);
    }
  }
}

export { PagamentoController };
