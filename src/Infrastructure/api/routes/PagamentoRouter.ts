import PagamentoRepository from "@/Infrastructure/drivers/Repositories/PagamentoRepository";
import MercadoPagoService from "@/Infrastructure/drivers/Services/MercadoPagoService";
import PedidoQueue from "@/Infrastructure/drivers/Services/PedidoQueue";
import { PagamentoController } from "@/Interfaces/Controllers/PagamentoController";
import { Router } from "express";

const pagamentoRouter = Router();

const pagamentoController = new PagamentoController(
  new MercadoPagoService(),
  new PagamentoRepository(),
  new PedidoQueue()
);

pagamentoRouter.get("/status/:id_pedido", (req, res, next) => {
  void pagamentoController.buscarPorId(req, res, next);
});

export { pagamentoRouter };
