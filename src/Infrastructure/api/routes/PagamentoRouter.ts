import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import PedidoPagamentoRepository from "@/Infrastructure/drivers/Repositories/PedidoPagamentoRepository";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import { Router } from "express";

const pagamentoRouter = Router();

const pagamentoController = new PagamentoController(
  new PagamentoRepository(),
  new PedidoPagamentoRepository()
);

pagamentoRouter.post("", (req, res, next) => {
  void pagamentoController.criar(req, res, next);
});

pagamentoRouter.get("/status/{idPedido}", (req, res, next) => {
  void pagamentoController.criar(req, res, next);
});

export { pagamentoRouter };
