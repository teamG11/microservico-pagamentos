import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import PedidoPagamentoRepository from "@/Infrastructure/drivers/Repositories/PedidoPagamentoRepository";
import MercadoPagoService from "@/Infrastructure/drivers/Services/MercadoPagoServices";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import { Router } from "express";

const pagamentoRouter = Router();

const pagamentoController = new PagamentoController(
  new MercadoPagoService(),
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
